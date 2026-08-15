// ─────────────────────────────────────────────────────────────────────────────
// Demo booking timings — the SINGLE source of truth for when a demo can be
// booked. Shared by the public request form (Contact) and the admin booking
// pop-up (Demo Leads) so the two never offer different days or hours.
//
// Rules (Kenya / EAT):
//   • Closed on Sundays and Kenyan public holidays.
//   • Weekdays 9:00 AM–4:00 PM, with a 1:00–2:00 PM lunch break.
//   • Saturdays 9:00 AM–12:00 PM (no lunch break).
//
// These are DEMO BOOKING hours, deliberately narrower than the office hours
// published on the site and in Google Business Profile (Mon–Fri 8:00–17:00,
// Sat 8:00–12:00). On weekdays the office opens before and closes after the
// last bookable slot, so don't "correct" one to match the other. Saturday is
// the one day where booking and closing coincide at noon — the last slot runs
// 11:30–12:00 and must not extend past it.
//
// Blocks are minutes from midnight rather than whole hours. Every boundary
// currently lands on the hour, but the previous integer-hour model silently
// rounded half-hour closings away instead of failing, so a future "closes at
// 12:30" would be lost rather than reported. Minutes keep that honest.
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

// Bookable blocks [startMinute, endMinute) for a date, lunch already removed.
// Minutes from midnight. Empty when the day is closed. This is the one place
// the hours are defined.
export function workingBlocks(dateStr: string): [number, number][] {
  if (isDateBlocked(dateStr)) return [];
  if (isSaturday(dateStr)) return [[9 * 60, 12 * 60]];             // 9:00–12:00
  return [[9 * 60, 13 * 60], [14 * 60, 16 * 60]];                  // 9–1, lunch, 2–4
}

const label12 = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// 30-minute slots for the admin booking pop-up.
// value: 'HH:MM' (24h, stored on the lead) · label: '8:30 AM' (shown).
export function generateTimeSlots(dateStr: string): { value: string; label: string; blocked: boolean }[] {
  const slots: { value: string; label: string; blocked: boolean }[] = [];
  for (const [start, end] of workingBlocks(dateStr)) {
    // Step by 30 only while a whole slot still fits inside the block, so the
    // last Saturday offer is 11:30 (running to the noon close) and never one
    // that would overrun it.
    for (let t = start; t + 30 <= end; t += 30) {
      slots.push({
        value: `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`,
        label: label12(t),
        blocked: false,
      });
    }
  }
  return slots;
}

// 1-hour range strings for the public request form, e.g. "9:00 AM – 10:00 AM".
// A block that doesn't divide into whole hours yields a short final range
// rather than being truncated, so a half-hour tail would show as e.g.
// "12:00 PM – 12:30 PM" instead of vanishing.
function hourRanges(blocks: [number, number][]): string[] {
  const out: string[] = [];
  for (const [start, end] of blocks) {
    for (let t = start; t < end; t += 60) {
      out.push(`${label12(t)} – ${label12(Math.min(t + 60, end))}`);
    }
  }
  return out;
}

// Static lists used by the public form. Derived from the same block definitions
// as workingBlocks() above so the form and the admin pop-up can't drift apart.
export const WEEKDAY_HOUR_RANGES = hourRanges([[9 * 60, 13 * 60], [14 * 60, 16 * 60]]);
export const SATURDAY_HOUR_RANGES = hourRanges([[9 * 60, 12 * 60]]);
