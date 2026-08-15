import type { Lead } from '../../data/siteData';
import { sourceCategory, type SourceCategory } from './leadSource';

// ─────────────────────────────────────────────────────────────────────────────
// What each source is actually worth.
//
// Counting leads per source flatters volume: a storming round that produces 32
// leads outranks the referral that produced one — even when the referral closed
// and thirty of the thirty-two went nowhere. Spending decisions made off a lead
// count therefore point at the busiest channel rather than the best one.
//
// This bins the same leads by source and reports what happened to them: how
// many were won, how many were lost, and how much the won ones were worth.
//
// It is also honest about what it cannot see. Deal values are entered by hand
// when a deal is marked Closed Won, so some won deals have no figure against
// them; `wonWithoutValue` carries that count so the report can say "KES 450,000
// across 3 of 5 won deals" instead of quietly understating the total — the same
// mistake as defaulting a blank lead source to 'website'.
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceStats {
  key: SourceCategory;
  leads: number;
  won: number;
  lost: number;
  open: number;
  wonValue: number;          // KES, summed over won deals that carry a figure
  wonWithoutValue: number;   // won deals with no figure recorded
  /** Won as a share of DECIDED deals (won + lost). null while nothing has been decided. */
  winRate: number | null;
}

export interface SourcePerformance {
  rows: SourceStats[];               // only sources that have leads, best-value first
  totalLeads: number;
  totalWon: number;
  totalWonValue: number;
  totalWonWithoutValue: number;
  /** True once at least one won deal carries a value — until then, value ranking is meaningless. */
  hasValues: boolean;
}

const WON = 'Closed Won';
const LOST = 'Closed Lost';

export function sourcePerformance(leads: Lead[]): SourcePerformance {
  const byKey = new Map<SourceCategory, SourceStats>();

  leads.forEach(l => {
    const key = sourceCategory(l);
    let s = byKey.get(key);
    if (!s) {
      s = { key, leads: 0, won: 0, lost: 0, open: 0, wonValue: 0, wonWithoutValue: 0, winRate: null };
      byKey.set(key, s);
    }
    s.leads += 1;
    if (l.status === WON) {
      s.won += 1;
      // Only a real, positive figure counts. A zero or a missing one is "not
      // recorded", not "worth nothing".
      if (typeof l.amount === 'number' && l.amount > 0) s.wonValue += l.amount;
      else s.wonWithoutValue += 1;
    } else if (l.status === LOST) {
      s.lost += 1;
    } else {
      s.open += 1;
    }
  });

  const rows = [...byKey.values()].map(s => ({
    ...s,
    winRate: s.won + s.lost > 0 ? s.won / (s.won + s.lost) : null,
  }));

  // Most valuable first, then most won, then most leads — so the channel worth
  // repeating is at the top rather than the one with the most names in it.
  rows.sort((a, b) => b.wonValue - a.wonValue || b.won - a.won || b.leads - a.leads);

  return {
    rows,
    totalLeads: rows.reduce((n, r) => n + r.leads, 0),
    totalWon: rows.reduce((n, r) => n + r.won, 0),
    totalWonValue: rows.reduce((n, r) => n + r.wonValue, 0),
    totalWonWithoutValue: rows.reduce((n, r) => n + r.wonWithoutValue, 0),
    hasValues: rows.some(r => r.wonValue > 0),
  };
}

/** KES with thousands separators and no decimals — the way quotes are written. */
export const formatKes = (n: number): string =>
  `KES ${Math.round(n).toLocaleString('en-KE')}`;

export const formatWinRate = (r: number | null): string =>
  r === null ? '—' : `${Math.round(r * 100)}%`;
