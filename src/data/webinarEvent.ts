// ─────────────────────────────────────────────────────────────────────────────
// Webinar events — the online mirror of the workshop system.
// Event details (title, date, time, "venue" = the online platform / join link)
// live in Firebase under `webinars/` and are edited from the admin panel, so a
// new webinar needs no code changes. Registrants are tagged with `eventId`;
// any row without one is treated as belonging to LEGACY_WEBINAR_ID so nothing
// has to be migrated.
// ─────────────────────────────────────────────────────────────────────────────
export interface WebinarEvent {
  id: string;
  title: string;
  date: string;   // human-readable, e.g. 'Friday, 24th July 2026'
  time: string;   // e.g. '10:00 AM (EAT)'
  venue: string;  // online joining details, e.g. 'Online — Google Meet link sent on registration'
  active?: boolean;      // the one currently open for RSVPs (only one at a time)
  createdAt: string;
  calendarStart?: string; // optional ISO for the "Add to Google Calendar" link
  calendarEnd?: string;
}

// Registrants with no eventId map onto this fixed fallback id.
export const LEGACY_WEBINAR_ID = 'web-legacy';

// Template for the first webinar (seeded when none exist). The admin edits the
// title/date/time and adds the join link before making it live. No calendar
// date is set yet, so registration stays open until a date is chosen.
export const DEFAULT_WEBINAR: WebinarEvent = {
  id: LEGACY_WEBINAR_ID,
  title: 'TallyPrime Online Webinar',
  date: 'Date to be announced',
  time: '10:00 AM (EAT)',
  venue: 'Online — Google Meet link sent on registration',
  active: true,
  createdAt: '2026-07-01T00:00:00.000Z',
};

export function parseWebinars(raw: Record<string, any> | null): WebinarEvent[] {
  if (!raw) return [];
  return Object.entries(raw)
    .map(([id, v]) => ({ id, ...(v as object) }) as WebinarEvent)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// The webinar the public RSVP page should show: the active one, else the most
// recently created, else the built-in default so the page is never blank.
export function pickActiveWebinar(list: WebinarEvent[]): WebinarEvent {
  if (list.length === 0) return DEFAULT_WEBINAR;
  return list.find(w => w.active) || list[list.length - 1];
}

// Which event a registrant belongs to (legacy rows have no eventId).
export const regEventId = (r: { eventId?: string }): string => r.eventId || LEGACY_WEBINAR_ID;

// Parse the calendar day (YYYY-MM-DD parts) out of an event's compact ISO
// calendarStart (e.g. '20260724T040000Z'). Null when no date is set.
export function eventDayParts(w: { calendarStart?: string }): { y: number; m: number; d: number } | null {
  const match = w.calendarStart?.match(/^(\d{4})(\d{2})(\d{2})/);
  return match ? { y: +match[1], m: +match[2], d: +match[3] } : null;
}

// Registration auto-closes at the END of the event day in Kenya time (EAT,
// UTC+3). The public RSVP page stops taking sign-ups once the event has
// happened. While no calendar date is set the link stays open, so a freshly
// created event is never accidentally closed.
export function isRegistrationClosed(w: { calendarStart?: string }, now: Date = new Date()): boolean {
  const day = eventDayParts(w);
  if (!day) return false;
  // 23:59:59 EAT == 20:59:59 UTC (EAT is UTC+3).
  const endOfEventDayUtcMs = Date.UTC(day.y, day.m - 1, day.d, 20, 59, 59);
  return now.getTime() > endOfEventDayUtcMs;
}
