// ─────────────────────────────────────────────────────────────────────────────
// Calendar invites for booked demos, consultations and client work.
//
// A booked slot is stored as a plain date (YYYY-MM-DD) + time (HH:MM) in
// Kenyan time. Calendars want absolute instants, so everything here converts
// EAT → UTC (a flat +03:00, Kenya has no daylight saving) and then offers the
// same event two ways:
//
//   • a Google Calendar link — opens the event pre-filled, guests attached,
//     one click to save into a Google account;
//   • an .ics file — what Outlook, Apple Calendar and the shared company
//     mailbox understand.
//
// Both carry the same guest list, so whichever route someone takes the demo
// lands on the same calendars.
// ─────────────────────────────────────────────────────────────────────────────
import { COMPANY_EMAIL, DEMO_TEAM, staffEmail } from '../../data/staff';

export const EAT_OFFSET_HOURS = 3;
export const DEFAULT_DEMO_MINUTES = 60;

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  date: string;              // YYYY-MM-DD (Kenyan date)
  time: string;              // HH:MM 24h (Kenyan time) — '09:00'
  durationMinutes?: number;
  guests?: string[];         // email addresses invited
  organizerEmail?: string;
}

// Accepts '09:00', '9:00', '9:00 AM', '2:30 PM' and returns [hour, minute] 24h.
// Anything unreadable falls back to 09:00 rather than producing a broken event.
export function parseTime(time?: string): [number, number] {
  if (!time) return [9, 0];
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return [9, 0];
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return [Math.min(h, 23), Math.min(min, 59)];
}

// Kenyan wall-clock → the equivalent UTC instant.
export function eatToUtc(date: string, time: string): Date {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = parseTime(time);
  return new Date(Date.UTC(y, (mo || 1) - 1, d || 1, h - EAT_OFFSET_HOURS, mi, 0));
}

// Calendar stamp: 20260810T060000Z
const stamp = (d: Date): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function eventWindow(e: CalendarEvent): { start: Date; end: Date } {
  const start = eatToUtc(e.date, e.time);
  const end = new Date(start.getTime() + (e.durationMinutes || DEFAULT_DEMO_MINUTES) * 60000);
  return { start, end };
}

// ── Google Calendar ─────────────────────────────────────────────────────────
export function googleCalendarUrl(e: CalendarEvent): string {
  const { start, end } = eventWindow(e);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: 'Africa/Nairobi',
  });
  if (e.description) params.set('details', e.description);
  if (e.location) params.set('location', e.location);
  const guests = dedupeEmails(e.guests);
  if (guests.length) params.set('add', guests.join(','));
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── .ics (Outlook / Apple / company mailbox) ────────────────────────────────
// Long lines are folded at 75 octets as the spec requires — Outlook silently
// drops the tail of an unfolded line, which is how invites lose their Meet link.
const fold = (line: string): string => {
  if (line.length <= 74) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 73) { parts.push(' ' + rest.slice(0, 73)); rest = rest.slice(73); }
  if (rest) parts.push(' ' + rest);
  return parts.join('\r\n');
};

const escText = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export function buildIcs(e: CalendarEvent): string {
  const { start, end } = eventWindow(e);
  const uid = `${start.getTime()}-${Math.random().toString(36).slice(2, 8)}@optimumprimesolutions.co.ke`;
  const organizer = e.organizerEmail || COMPANY_EMAIL;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Optimum Prime Solutions//Admin Panel//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escText(e.title)}`,
    ...(e.description ? [`DESCRIPTION:${escText(e.description)}`] : []),
    ...(e.location ? [`LOCATION:${escText(e.location)}`] : []),
    `ORGANIZER;CN=Optimum Prime Solutions:mailto:${organizer}`,
    ...dedupeEmails(e.guests).map(g =>
      `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${g}`),
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n');
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function dedupeEmails(list?: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  (list || []).forEach(raw => {
    const e = (raw || '').trim().toLowerCase();
    if (!e || !e.includes('@') || seen.has(e)) return;
    seen.add(e);
    out.push(e);
  });
  return out;
}

// ── Who gets invited ────────────────────────────────────────────────────────
// Every online booking goes to both members of the demo team (Kenneth and John
// Mark), the shared company mailbox, whoever is actually assigned, and the
// client. Passing the assigned staff separately means a booking handed to
// someone outside the demo team still reaches them.
export function demoGuestList(opts: {
  assignedStaffName?: string;
  extraStaffNames?: (string | undefined)[];
  clientEmail?: string;
  includeClient?: boolean;
}): string[] {
  const guests = [
    ...DEMO_TEAM.map(s => s.email),
    COMPANY_EMAIL,
    staffEmail(opts.assignedStaffName),
    ...(opts.extraStaffNames || []).map(n => staffEmail(n)),
  ];
  if (opts.includeClient !== false && opts.clientEmail) guests.push(opts.clientEmail);
  return dedupeEmails(guests);
}

// A short, readable summary of who is on the invite, for the UI.
export const guestSummary = (guests: string[]): string =>
  guests.length === 0 ? 'No guests' : guests.join(', ');
