/**
 * SaaS subscriptions — the Jamvi and Mavuno HR customer base, synced from each
 * product's super-admin API by the `syncSaasSubscriptions` Cloud Function and
 * stored in RTDB under `saasSubscriptions/<product>_<orgId>`.
 *
 * This is customer billing data, so it lives in a staff-only node (see
 * database.rules.json) — never in `siteData`, which is world-readable.
 *
 * All amounts are in minor units (cents). KES 1,234.56 -> 123456.
 */

export type SaasProduct = "mavuno" | "jamvi";

export const SAAS_PRODUCTS: { id: SaasProduct; label: string }[] = [
  { id: "mavuno", label: "Mavuno HR" },
  { id: "jamvi", label: "Jamvi" },
];

export const saasProductLabel = (p: string): string =>
  SAAS_PRODUCTS.find((x) => x.id === p)?.label ?? p;

export interface SaasSubscription {
  product: SaasProduct;
  productLabel: string;
  orgId: string;
  orgName: string;
  orgSlug?: string;
  /** Plan id as the source product names it (e.g. "starter", "growth"). */
  plan: string;
  /** "active" | "suspended" | "trialing" | whatever the source reports. */
  status: string;
  billingCycle: "monthly" | "annual";
  /** Billable seats — active employees for Mavuno HR, members for Jamvi. */
  seats: number;
  /** Seat cap on the plan; 0 when the source doesn't report one. */
  seatLimit: number;
  /** Mavuno HR only — completed payroll runs. 0 for products without payroll. */
  payrollRuns: number;
  /** Mavuno HR only — ISO date of the most recent payroll run, or null. */
  lastPayrollRun: string | null;
  /** Effective charge per month (override wins over rate card), cents. */
  monthlyChargeCents: number;
  /** Amount per invoice — annual bills ~10x the monthly, cents. */
  cycleChargeCents: number;
  currency: string;
  /** ISO date the trial ends, if the org is on trial. */
  trialEndsAt: string | null;
  /** ISO date the org was created in the source product. */
  createdAt: string | null;
  adminEmail: string | null;
  /** ISO — stamped by the sync function on every run. */
  lastSyncedAt: string;
}

/** A subscription counts toward MRR unless it is suspended or clearly a trial. */
export const isBilling = (s: SaasSubscription): boolean => {
  const st = (s.status || "").toLowerCase();
  if (st === "suspended" || st === "cancelled" || st === "canceled") return false;
  if (st === "trial" || st === "trialing") return false;
  return s.monthlyChargeCents > 0;
};

export const monthlyMrrCents = (subs: SaasSubscription[]): number =>
  subs.filter(isBilling).reduce((sum, s) => sum + (s.monthlyChargeCents || 0), 0);

export const mrrByProduct = (subs: SaasSubscription[]): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const s of subs.filter(isBilling)) {
    out[s.product] = (out[s.product] ?? 0) + (s.monthlyChargeCents || 0);
  }
  return out;
};

/** Whole days since the org's last payroll run; null if it has never run one. */
export const daysSincePayroll = (s: SaasSubscription): number | null => {
  if (!s.lastPayrollRun) return null;
  return Math.floor((Date.now() - new Date(s.lastPayrollRun).getTime()) / 86_400_000);
};

export const trialsEndingSoon = (subs: SaasSubscription[], withinDays = 7): SaasSubscription[] => {
  const cutoff = Date.now() + withinDays * 86_400_000;
  return subs.filter(
    (s) => s.trialEndsAt && new Date(s.trialEndsAt).getTime() <= cutoff,
  );
};

/**
 * Best available "renews on" date. Neither product runs an invoice engine yet,
 * so for a paying org this is unknown; a trial has a hard end date.
 */
export const renewalDate = (s: SaasSubscription): string | null =>
  (s.status || "").toLowerCase().startsWith("trial") ? s.trialEndsAt : null;

export const kes = (cents: number): string =>
  "KES " +
  Math.round((cents || 0) / 100).toLocaleString("en-KE");
