import { useState, useMemo } from 'react';
import {
  KeyRound, AlertCircle, CalendarClock, ArrowUpCircle, Cloud, CheckCircle2, Search, Plus,
} from 'lucide-react';
import type { SiteData, Client, ClientProduct, Lead, DealType } from '../../data/siteData';
import { clientProducts, productExpires, effectiveExpiresOn } from '../../data/siteData';

interface P {
  data: SiteData;
  onSave: (d: SiteData) => void;
  // Raising a renewal drops a deal into the pipeline; the Demo Leads tab opens it.
  onRaised?: (leadId: string) => void;
}

// ── Why this tab exists ─────────────────────────────────────────────────────
// The rest of the panel is reactive: it shows work that already exists. This one
// looks forward, because the things that quietly cost the most money all have
// deadlines and none of them announce themselves.
//
//   * TSS lapses. It runs on every licence — Perpetual included, since owning
//     the licence outright does not keep updates and remote access alive.
//   * The Annual → Perpetual top-up window closes at the licence year end. Up to
//     that date the client pays only the difference; after it they buy afresh.
//   * A Cloud Hosting subscription lapses on its own billing cycle — Monthly or
//     Annual, whichever the client is on. A Perpetual one is a one-time fee and
//     never appears here, the same as a Perpetual licence.
//
// All of these are invisible until a client rings up having already lost them,
// so they are surfaced here by how little time is left.

const DAY = 24 * 60 * 60 * 1000;

// Whole days from today to a YYYY-MM-DD date. Negative means it has passed.
const daysUntil = (date?: string): number | null => {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / DAY);
};

const fmt = (date?: string): string =>
  date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

// How urgent a date is. Anything past due is its own state — it is not "very
// soon", it is already lost revenue that may still be recoverable.
type Urgency = 'expired' | 'critical' | 'soon' | 'watch' | 'fine';
const urgencyOf = (days: number | null): Urgency => {
  if (days === null) return 'fine';
  if (days < 0) return 'expired';
  if (days <= 30) return 'critical';
  if (days <= 60) return 'soon';
  if (days <= 90) return 'watch';
  return 'fine';
};

const URGENCY_STYLE: Record<Urgency, { chip: string; label: (d: number) => string }> = {
  expired:  { chip: 'bg-red-100 text-red-700 border-red-200',        label: d => `${Math.abs(d)}d overdue` },
  critical: { chip: 'bg-orange-100 text-orange-700 border-orange-200', label: d => `${d}d left` },
  soon:     { chip: 'bg-amber-100 text-amber-700 border-amber-200',  label: d => `${d}d left` },
  watch:    { chip: 'bg-sky-100 text-sky-700 border-sky-200',        label: d => `${d}d left` },
  fine:     { chip: 'bg-slate-100 text-slate-600 border-slate-200',  label: d => `${d}d left` },
};

export default function RenewalsManager({ data, onSave, onRaised }: P) {
  const [search, setSearch] = useState('');
  const [horizon, setHorizon] = useState<30 | 60 | 90 | 0>(90); // 0 = show everything
  const [raised, setRaised] = useState<string | null>(null);

  const clients = data.clients || [];

  // Each client can yield several independent deadlines, so they are flattened
  // into one list of dated opportunities rather than one row per client — a
  // Gold Annual client can owe a TSS renewal, a top-up, and a Cloud Hosting
  // renewal, all on different dates.
  type Row = {
    key: string;
    client: Client;
    kind: 'TSS Renewal' | 'Term Upgrade' | 'Cloud Hosting';
    date?: string;
    days: number | null;
    urgency: Urgency;
    // Only set for Cloud Hosting rows — which line it is and what term it's
    // on (Monthly vs Annual reads differently in the row text).
    cloudProduct?: ClientProduct;
  };

  // How each kind reads and behaves — one place so a new kind can't disagree
  // with itself between the summary tiles, the row text and the raise button.
  const KIND_META: Record<Row['kind'], {
    icon: typeof CalendarClock;
    iconColor: string;
    buttonColor: string;
    button: string;
    message: (r: Row) => string;
    nextStep: string;
  }> = {
    'TSS Renewal': {
      icon: CalendarClock, iconColor: 'text-sky-600', buttonColor: 'bg-sky-600 hover:bg-sky-700',
      button: 'Raise renewal',
      message: r => `TSS ${r.urgency === 'expired' ? 'lapsed' : 'expires'} ${fmt(r.date)}.`,
      nextStep: 'Call to confirm the renewal and issue the invoice',
    },
    'Term Upgrade': {
      icon: ArrowUpCircle, iconColor: 'text-emerald-600', buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
      button: 'Raise top-up deal',
      message: r => `Top-up to Perpetual until ${fmt(r.date)} — after that they buy afresh.`,
      nextStep: 'Quote the top-up difference before the window closes',
    },
    'Cloud Hosting': {
      icon: Cloud, iconColor: 'text-violet-600', buttonColor: 'bg-violet-600 hover:bg-violet-700',
      button: 'Raise renewal',
      message: r => `Cloud Hosting (${r.cloudProduct?.term}) ${r.urgency === 'expired' ? 'lapsed' : 'renews'} ${fmt(r.date)}.`,
      nextStep: 'Call to confirm the Cloud Hosting renewal and issue the invoice',
    },
  };

  // Shared by the visible list and the summary counts, so the two can never
  // disagree about what's due.
  const buildRows = (clientList: Client[]): Row[] => {
    const out: Row[] = [];
    clientList.forEach(c => {
      const tssDays = daysUntil(c.tssExpiry);
      if (c.tssExpiry) {
        out.push({
          key: `${c.id}-tss`, client: c, kind: 'TSS Renewal',
          date: c.tssExpiry, days: tssDays, urgency: urgencyOf(tssDays),
        });
      }
      // Only an Annual licence can be topped up, and only while its year is
      // still running — once it has lapsed the upgrade is no longer on offer,
      // so a passed date is not an opportunity to chase.
      if (c.term === 'Annual' && c.licenceExpiry) {
        const upDays = daysUntil(c.licenceExpiry);
        if (upDays !== null && upDays >= 0) {
          out.push({
            key: `${c.id}-upgrade`, client: c, kind: 'Term Upgrade',
            date: c.licenceExpiry, days: upDays, urgency: urgencyOf(upDays),
          });
        }
      }
      // Cloud Hosting is its own product line, tracked the same way as TSS: any
      // term that actually expires (Monthly or Annual — Perpetual is a
      // one-time fee and is never due) is surfaced, lapsed or not.
      clientProducts(c)
        .filter(p => p.kind === 'Cloud Hosting' && productExpires(p))
        .forEach(p => {
          const date = effectiveExpiresOn(p);
          const days = daysUntil(date);
          out.push({
            key: `${c.id}-cloud-${p.id}`, client: c, kind: 'Cloud Hosting',
            date, days, urgency: urgencyOf(days), cloudProduct: p,
          });
        });
    });
    return out;
  };

  const rows = useMemo<Row[]>(() => {
    const out = buildRows(clients);
    const q = search.trim().toLowerCase();
    return out
      .filter(r => !q
        || r.client.company.toLowerCase().includes(q)
        || r.client.serialNo.includes(q)
        || (r.client.contactName || '').toLowerCase().includes(q))
      // Expired items always stay visible: the horizon filters what is coming,
      // not what has already been missed.
      .filter(r => horizon === 0 || r.days === null || r.days < 0 || r.days <= horizon)
      .sort((a, b) => (a.days ?? 99999) - (b.days ?? 99999));
  }, [clients, search, horizon]);

  const counts = useMemo(() => {
    const all = buildRows(clients);
    return {
      expired: all.filter(r => r.urgency === 'expired').length,
      within30: all.filter(r => r.days !== null && r.days >= 0 && r.days <= 30).length,
      within90: all.filter(r => r.days !== null && r.days >= 0 && r.days <= 90).length,
      topUps: all.filter(r => r.kind === 'Term Upgrade').length,
    };
  }, [clients]);

  // ── Raise the deal ────────────────────────────────────────────────────────
  // A renewal is a new deal against a licence (or Cloud Hosting line) we
  // already hold, so it enters the pipeline carrying the serial from the
  // outset — unlike a new licence, whose serial only exists once it's bought.
  const raiseDeal = (row: Row) => {
    const { client, kind } = row;
    const existing = (data.leads || []).find(l =>
      l.clientId === client.id && l.dealType === kind
      && l.status !== 'Closed Won' && l.status !== 'Closed Lost');
    if (existing) { onRaised?.(existing.id); return; }

    const id = `lead_${Date.now()}`;
    const label = kind === 'TSS Renewal'
      ? `TSS renewal — expires ${fmt(client.tssExpiry)}`
      : kind === 'Term Upgrade'
      ? `Annual → Perpetual top-up — window closes ${fmt(client.licenceExpiry)}`
      : `Cloud Hosting (${row.cloudProduct?.term}) renewal — expires ${fmt(row.date)}`;
    const lead: Lead = {
      id,
      name: client.contactName || client.company,
      company: client.company,
      phone: client.phone || '',
      email: client.email || '',
      businessType: '',
      demoDate: '',
      currentSoftware: `TallyPrime ${client.edition} ${client.term}`,
      message: label,
      createdAt: new Date().toISOString(),
      status: 'New',
      source: 'direct',
      dealType: kind as DealType,
      serialNo: client.serialNo,
      clientId: client.id,
      nextStep: KIND_META[kind].nextStep,
    };
    onSave({ ...data, leads: [lead, ...(data.leads || [])] });
    setRaised(client.id + kind);
    setTimeout(() => setRaised(null), 5000);
    onRaised?.(id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Renewals &amp; Upgrades</h2>
        <p className="text-sm text-slate-500 mt-1">
          Money with a deadline on it. TSS runs on every licence, Perpetual included; the
          Annual → Perpetual top-up is only on offer until the licence year ends; and Cloud
          Hosting comes due on its own Monthly or Annual cycle unless it was sold Perpetual.
        </p>

        {/* Headline numbers, worst first */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-2xl font-black text-red-700">{counts.expired}</p>
            <p className="text-xs font-semibold text-red-600">Already lapsed</p>
          </div>
          <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
            <p className="text-2xl font-black text-orange-700">{counts.within30}</p>
            <p className="text-xs font-semibold text-orange-600">Due within 30 days</p>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
            <p className="text-2xl font-black text-sky-700">{counts.within90}</p>
            <p className="text-xs font-semibold text-sky-600">Due within 90 days</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <p className="text-2xl font-black text-emerald-700">{counts.topUps}</p>
            <p className="text-xs font-semibold text-emerald-600">Top-up windows open</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by company, contact or serial number…"
              className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div className="flex gap-2">
            {([30, 60, 90, 0] as const).map(h => (
              <button key={h} onClick={() => setHorizon(h)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  horizon === h ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {h === 0 ? 'All' : `${h} days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <KeyRound className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No licences on record yet</p>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            A client record is created the first time a deal is closed won with its serial number.
            Once a few are in, the renewals and top-up windows appear here automatically.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Nothing due in the next {horizon === 0 ? 'period' : `${horizon} days`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {search ? 'No licence matches that search.' : 'Widen the window to look further ahead.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          {rows.map(r => {
            const style = URGENCY_STYLE[r.urgency];
            const meta = KIND_META[r.kind];
            const Icon = meta.icon;
            const justRaised = raised === r.client.id + r.kind;
            return (
              <div key={r.key}
                className="flex items-start justify-between gap-4 border-b border-slate-100 last:border-0 p-4 flex-wrap hover:bg-slate-50/60 transition">
                <div className="min-w-[240px] flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className={`h-4 w-4 shrink-0 ${meta.iconColor}`} />
                    <p className="text-sm font-bold text-slate-900">{r.client.company}</p>
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${style.chip}`}>
                      {r.days !== null ? style.label(r.days) : 'no date'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    <span className="font-mono tracking-wide">{r.client.serialNo}</span>
                    {' · '}{r.kind === 'Cloud Hosting'
                      ? `Cloud Hosting — ${r.cloudProduct?.term}`
                      : `TallyPrime ${r.client.edition} ${r.client.term}`}
                    {r.client.contactName ? ` · ${r.client.contactName}` : ''}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{meta.message(r)}</p>
                </div>

                <div className="shrink-0">
                  {justRaised ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs font-bold text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Added to pipeline
                    </span>
                  ) : (
                    <button onClick={() => raiseDeal(r)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition ${meta.buttonColor}`}>
                      <Plus className="h-3.5 w-3.5" />
                      {meta.button}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500">
          Dates come from the client record, which is set when a deal is closed won and can be
          corrected from that deal's licence panel at any time. Raising a deal here puts it into
          the pipeline at <strong>New</strong> carrying the serial, so it closes through the same
          stages as any other sale.
        </p>
      </div>
    </div>
  );
}
