// ─────────────────────────────────────────────────────────────────────────────
// Workshop events — makes the breakfast workshop repeatable.
// Event details (title, date, time, venue) live in Firebase under `workshops/`
// and are edited from the admin panel, so a new workshop needs no code changes.
// Registrants are tagged with `eventId`; existing July RSVPs that predate this
// feature have no eventId and are treated as belonging to LEGACY_WORKSHOP_ID,
// so nothing has to be migrated.
// ─────────────────────────────────────────────────────────────────────────────
export interface WorkshopEvent {
  id: string;
  title: string;
  date: string;   // human-readable, e.g. 'Friday, 24th July 2026'
  time: string;   // e.g. '7:00 AM (EAT)'
  venue: string;  // e.g. 'Ndanga Hotel, Ruiru'
  active?: boolean;      // the one currently open for RSVPs (only one at a time)
  createdAt: string;
  calendarStart?: string; // optional ISO for the "Add to Google Calendar" link
  calendarEnd?: string;
}

// The first workshop existed before events were configurable. Its registrants
// have no eventId, so we map them onto this fixed id.
export const LEGACY_WORKSHOP_ID = 'ws-jul-2026';

export const DEFAULT_WORKSHOP: WorkshopEvent = {
  id: LEGACY_WORKSHOP_ID,
  title: 'Inventory Management Breakfast Workshop',
  date: 'Friday, 24th July 2026',
  time: '7:00 AM (EAT)',
  venue: 'Ndanga Hotel, Ruiru',
  active: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  calendarStart: '20260724T040000Z',
  calendarEnd: '20260724T070000Z',
};

export function parseWorkshops(raw: Record<string, any> | null): WorkshopEvent[] {
  if (!raw) return [];
  return Object.entries(raw)
    .map(([id, v]) => ({ id, ...(v as object) }) as WorkshopEvent)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// The workshop the public RSVP page should show: the active one, else the most
// recently created, else the built-in default so the page is never blank.
export function pickActiveWorkshop(list: WorkshopEvent[]): WorkshopEvent {
  if (list.length === 0) return DEFAULT_WORKSHOP;
  return list.find(w => w.active) || list[list.length - 1];
}

// Which event a registrant belongs to (legacy rows have no eventId).
export const regEventId = (r: { eventId?: string }): string => r.eventId || LEGACY_WORKSHOP_ID;
