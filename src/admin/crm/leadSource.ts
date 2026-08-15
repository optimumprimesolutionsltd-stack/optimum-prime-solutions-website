import type { Lead } from '../../data/siteData';

// ─────────────────────────────────────────────────────────────────────────────
// Where a lead came from — the one canonical list, shared by the capture form,
// the CSV import, the filter chips and the "needs a source" queue.
//
// Attribution is only worth reporting on if it was chosen deliberately. Every
// entry point therefore starts blank rather than pre-selected: a pre-selected
// source is the reason a panel ends up showing 32 Field leads and 0 referrals —
// nobody picked Field, it was simply already there when they hit Save.
//
// Two sources say nothing on their own — "field" without the drive it came off,
// "referral" without who referred — so each carries the lead field that has to
// be filled in alongside it.
// ─────────────────────────────────────────────────────────────────────────────

export type LeadSource = NonNullable<Lead['source']>;

export interface SourceOption {
  value: LeadSource;
  label: string;                                  // full label, for selects
  short: string;                                  // for chips, badges and exports
  detailKey?: 'fieldCampaign' | 'referredBy';     // the lead field it fills
  detailLabel?: string;                           // prompt shown next to the select
  detailPlaceholder?: string;
  gapNote?: string;                               // shown when the detail is missing
}

// What a person can pick when entering or correcting a lead by hand.
export const MANUAL_SOURCES: SourceOption[] = [
  {
    value: 'field', label: '📣 Field storming / Marketing', short: 'Field / Marketing',
    detailKey: 'fieldCampaign',
    detailLabel: 'Which drive or area?',
    detailPlaceholder: 'e.g. Industrial Area storming, Nakuru road show',
    gapNote: 'no drive or area recorded',
  },
  {
    value: 'referral', label: '🤝 Referral', short: 'Referral',
    detailKey: 'referredBy',
    detailLabel: 'Who referred them?',
    detailPlaceholder: 'e.g. James Mwangi — Acme Ltd (existing client)',
    gapNote: 'no referrer recorded',
  },
  { value: 'phone',    label: '📞 Phone call — they rang us', short: 'Phone' },
  { value: 'whatsapp', label: '💬 WhatsApp',                   short: 'WhatsApp' },
  { value: 'email',    label: '✉️ Email enquiry',              short: 'Email' },
  { value: 'direct',   label: '🚶 Walk-in / direct contact',   short: 'Direct' },
];

// Set by the system when the lead arrives through that channel. Offered when
// correcting an existing lead, never as a default on a new one.
export const SYSTEM_SOURCES: SourceOption[] = [
  { value: 'website',  label: '🌐 Website form', short: 'Website' },
  { value: 'workshop', label: '🎓 Workshop',     short: 'Workshop' },
  { value: 'webinar',  label: '💻 Webinar',      short: 'Webinar' },
];

export const ALL_SOURCES: SourceOption[] = [...MANUAL_SOURCES, ...SYSTEM_SOURCES];

export const sourceOption = (s?: string): SourceOption | undefined =>
  ALL_SOURCES.find(o => o.value === s);

export const sourceLabel = (s?: string): string => sourceOption(s)?.short || 'Unknown';

/** The detail recorded against a lead's source, if that source takes one. */
export const sourceDetail = (l: Lead): string => {
  const key = sourceOption(l.source)?.detailKey;
  return key ? String(l[key] || '').trim() : '';
};

/**
 * What is missing from this lead's attribution, or null when it is complete.
 *
 * A blank source, 'unknown', the legacy 'manual', and the free-text values old
 * forms wrote ('Website — Contact Form') all count as missing: none of them
 * answer the question "where did this lead come from?".
 */
export function attributionGap(l: Lead): string | null {
  const opt = sourceOption(l.source);
  if (!opt) return 'no source recorded';
  if (opt.detailKey && !sourceDetail(l)) return `${opt.short} — ${opt.gapNote}`;
  return null;
}

export const needsAttribution = (l: Lead): boolean => attributionGap(l) !== null;

// ── Lead source buckets ──────────────────────────────────────────────────────
// The categories the Source chips filter by. 'other' is the honest home for a
// lead whose source is blank or something we don't recognise — these used to be
// swept into 'email', so a lead with no source at all was reported to Tally as
// an email enquiry.
export type SourceCategory =
  'workshop' | 'webinar' | 'online' | 'field' | 'email' | 'whatsapp' | 'referral' | 'phone' | 'direct' | 'other';

// Sources that arrive as a one-to-one contact rather than through an event.
// Kept as data so the mapper below can't drift from the chip list.
const DIRECT_SOURCES = ['email', 'whatsapp', 'referral', 'phone', 'direct'] as const;

// Which chip a lead belongs under. Pure and module-level so the chips, the
// stats strip, the on-screen chart and the exports all bin leads through this
// one function — and so it can be tested without mounting the panel.
export const sourceCategory = (l: Lead): SourceCategory =>
  l.source === 'workshop' ? 'workshop'
  : l.source === 'webinar' ? 'webinar'
  : l.source === 'website' ? 'online'
  : l.source === 'field' ? 'field'
  // Only a recognised direct source keeps its own bucket. Anything else —
  // blank, legacy 'manual', a value from an import — lands in 'other' rather
  // than being mislabelled as an email enquiry.
  : (DIRECT_SOURCES as readonly string[]).includes(l.source || '')
    ? (l.source as typeof DIRECT_SOURCES[number])
    : 'other';

// The chips can also filter on a question rather than a category: "which leads
// can't tell me where they came from?". That is the queue staff work through to
// clean up attribution, so it lives alongside the real sources.
export type SourceFilter = 'All' | SourceCategory | 'needs-source';

export const matchesSourceFilter = (l: Lead, f: SourceFilter): boolean =>
  f === 'All' ? true
  : f === 'needs-source' ? needsAttribution(l)
  : sourceCategory(l) === f;

/**
 * Details already used against a source, most recently first.
 *
 * Retyping "Industrial Area storming" for every lead off one drive is how a
 * compulsory field fills up with "x" — so the box offers what has been used
 * before and stays free-text for a genuinely new drive.
 */
export function knownDetails(leads: Lead[], key: 'fieldCampaign' | 'referredBy'): string[] {
  const seen = new Map<string, string>();
  [...leads]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .forEach(l => {
      const v = String(l[key] || '').trim();
      if (v && !seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v);
    });
  return [...seen.values()];
}

/**
 * Validate a source pick before it is saved. Returns an error message, or null
 * when the pick is complete. Used by both the add form and the inline fixer so
 * the same rule applies wherever a source is set.
 */
export function validateSourcePick(source: string, detail: string): string | null {
  if (!source) return 'Choose where this lead came from — it cannot be left blank.';
  const opt = sourceOption(source);
  if (!opt) return 'Choose where this lead came from — it cannot be left blank.';
  if (opt.detailKey && !detail.trim()) return `${opt.detailLabel} This is required for ${opt.short} leads.`;
  return null;
}

/**
 * The lead fields a source pick writes. Only the key belonging to the chosen
 * source is set; the other is blanked so a lead switched from Referral to Field
 * doesn't keep a stale referrer hanging off it.
 */
export function sourceFields(source: LeadSource, detail: string, staffName?: string) {
  const opt = sourceOption(source);
  return {
    source,
    fieldCampaign: opt?.detailKey === 'fieldCampaign' ? detail.trim() : '',
    referredBy:    opt?.detailKey === 'referredBy'    ? detail.trim() : '',
    ...(staffName ? { sourceSetBy: staffName } : {}),
    sourceSetAt: new Date().toISOString(),
  };
}
