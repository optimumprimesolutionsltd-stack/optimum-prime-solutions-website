// ─────────────────────────────────────────────────────────────────────────────
// Demo booking timings — the SINGLE source of truth for when a demo can be
// booked. Shared by the public request form (Contact) and the admin booking
// pop-up (Demo Leads) so the two never offer different days or hours.
//
// Rules (Kenya / EAT):
//   • Closed on Sundays and Kenyan public holidays.
//   • Weekdays 8:00 AM–5:00 PM, with a 1:00–2:00 PM lunch break.
//   • Saturdays 8:00 AM–1:00 PM (no lunch break).
// ─────────────────────────────────────────────────────────────────────────────

// Recurring annual holidays as MM-DD.
const KE_HOLIDAYS_RECURRING = new Set([
  '01-01', // New Year's Day
  '05-01', // Labour Day
  '06-01', // Madaraka Day
  '10-10', // Huduma Day
  '10-20', // Mashujaa Day
  '12-12', // Jamhuri Day
  '12-25', // Christmas Day
  '12-26', // Boxing Day
]);
// One-off holidays (YYYY-MM-DD) — e.g. Easter, which moves each year. Add more.
const KE_HOLIDAYS_ONEOFF = new Set([
  '2026-04-03', // Good Friday 2026
  '2026-04-06', // Easter Monday 2026
  '2027-03-26', // Good Friday 2027
  '2027-03-29', // Easter Monday 2027
]);

export function isKenyaHoliday(dateStr: string): boolean {
  if (!dateStr) return false;
  return KE_HOLIDAYS_RECURRING.has(dateStr.slice(5)) || KE_HOLIDAYS_ONEOFF.has(dateStr);
}

// 0=Sun, 1=Mon … 6=Sat. Noon avoids any timezone date-shift.
export function getDayOfWeek(dateStr: string): number {
  if (!dateStr) return -1;
  return new Date(dateStr + 'T12:00:00').getDay();
}

export const isSaturday = (dateStr: string): boolean => getDayOfWeek(dateStr) === 6;

// A date we don't take bookings on at all (Sunday or public holiday).
export function isDateBlocked(dateStr: string): boolean {
  if (!dateStr) return false;
  return getDayOfWeek(dateStr) === 0 || isKenyaHoliday(dateStr);
}

// Bookable hour blocks [startHour, endHour) for a date, lunch already removed.
// Empty when the day is closed. This is the one place the hours are defined.
export function workingBlocks(dateStr: string): [number, number][] {
  if (isDateBlocked(dateStr)) return [];
  if (isSaturday(dateStr)) return [[8, 13]];   // 8am–1pm
  return [[8, 13], [14, 17]];                  // 8–1, lunch, 2–5
}

const label12 = (h: number, m: number): string => {
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// 30-minute slots for the admin booking pop-up.
// value: 'HH:MM' (24h, stored on the lead) · label: '8:30 AM' (shown).
export function generateTimeSlots(dateStr: string): { value: string; label: string; blocked: boolean }[] {
  const slots: { value: string; label: string; blocked: boolean }[] = [];
  for (const [start, end] of workingBlocks(dateStr)) {
    for (let h = start; h < end; h++) {
      for (const m of [0, 30]) {
        slots.push({
          value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          label: label12(h, m),
          blocked: false,
        });
      }
    }
  }
  return slots;
}

// 1-hour range strings for the public request form, e.g. "8:00 AM – 9:00 AM".
function hourRanges(blocks: [number, number][]): string[] {
  const out: string[] = [];
  for (const [start, end] of blocks) {
    for (let h = start; h < end; h++) out.push(`${label12(h, 0)} – ${label12(h + 1, 0)}`);
  }
  return out;
}

// Static lists used by the public form (kept identical to what it showed before,
// now derived from the shared rules above so they can never drift).
export const WEEKDAY_HOUR_RANGES = hourRanges([[8, 13], [14, 17]]);
export const SATURDAY_HOUR_RANGES = hourRanges([[8, 13]]);
