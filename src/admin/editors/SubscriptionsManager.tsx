import { useEffect, useMemo, useState } from 'react';
import {
  Search, RefreshCw, Loader, CheckCircle, AlertCircle, Building2, Download,
} from 'lucide-react';
import { fbSubscribe } from '../../firebase/config';
import {
  type SaasSubscription, SAAS_PRODUCTS, saasProductLabel,
  monthlyMrrCents, mrrByProduct, trialsEndingSoon, renewalDate, daysSincePayroll, kes,
} from '../../data/saas';

// v1 Cloud Function, europe-west1. Guarded by SAAS_SYNC_TRIGGER_TOKEN; the
// token is entered once per browser and kept in localStorage — never in the
// bundle or git.
const SYNC_URL =
  'https://europe-west1-optimum-prime-website.cloudfunctions.net/syncSaasSubscriptionsNow';
const TOKEN_KEY = 'saasSyncToken';

type SyncState = 'idle' | 'syncing' | 'done' | 'error';

export default function SubscriptionsManager() {
  const [subs, setSubs] = useState<SaasSubscription[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState<'all' | 'mavuno' | 'jamvi'>('all');

  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncMsg, setSyncMsg] = useState('');
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY) ?? ''; } catch { return ''; }
  });
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const unsub = fbSubscribe('saasSubscriptions', (raw: Record<string, any> | null) => {
      const list: SaasSubscription[] = raw ? Object.values(raw) : [];
      list.sort((a, b) => (b.monthlyChargeCents || 0) - (a.monthlyChargeCents || 0));
      setSubs(list);
      setLoaded(true);
    });
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    let list = subs;
    if (product !== 'all') list = list.filter((s) => s.product === product);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.orgName.toLowerCase().includes(q) ||
          (s.adminEmail ?? '').toLowerCase().includes(q) ||
          s.plan.toLowerCase().includes(q),
      );
    }
    return list;
  }, [subs, product, search]);

  const mrr = monthlyMrrCents(subs);
  const byProduct = mrrByProduct(subs);
  const trials = trialsEndingSoon(subs);
  const lastSync = subs.reduce<string | null>(
    (max, s) => (s.lastSyncedAt && (!max || s.lastSyncedAt > max) ? s.lastSyncedAt : max),
    null,
  );

  const syncNow = async () => {
    if (!token.trim()) { setShowToken(true); return; }
    setSyncState('syncing');
    setSyncMsg('');
    try {
      const res = await fetch(SYNC_URL, { headers: { 'x-sync-token': token.trim() } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSyncState('error');
        setSyncMsg(body.error || `Sync failed (HTTP ${res.status})`);
        return;
      }
      setSyncState('done');
      const parts = SAAS_PRODUCTS.map((p) => `${p.label}: ${body[p.id] ?? '—'}`);
      setSyncMsg(parts.join('  ·  '));
    } catch {
      setSyncState('error');
      setSyncMsg('Could not reach the sync function');
    }
  };

  const saveToken = (v: string) => {
    setToken(v);
    try { v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ }
  };

  const exportCSV = () => {
    const headers = ['Product', 'Organisation', 'Plan', 'Status', 'Cycle', 'Seats', 'Seat limit', 'Payroll runs', 'Last payroll run', 'KES/month', 'Per invoice', 'Admin', 'Trial ends', 'Last synced'];
    const rows = filtered.map((s) => [
      s.productLabel, s.orgName, s.plan, s.status, s.billingCycle, s.seats,
      s.seatLimit || '', s.payrollRuns, s.lastPayrollRun ?? '',
      Math.round((s.monthlyChargeCents || 0) / 100), Math.round((s.cycleChargeCents || 0) / 100),
      s.adminEmail ?? '', s.trialEndsAt ?? '', s.lastSyncedAt ?? '',
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'saas-subscriptions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const statusPill = (status: string) => {
    const st = status.toLowerCase();
    if (st === 'suspended' || st === 'cancelled' || st === 'canceled')
      return 'bg-red-100 text-red-700';
    if (st.startsWith('trial')) return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Jamvi &amp; Mavuno HR customers, synced from each product every 15 minutes
            {lastSync && <> · last sync {new Date(lastSync).toLocaleString()}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={syncNow} disabled={syncState === 'syncing'}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50">
            {syncState === 'syncing' ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {syncState === 'syncing' ? 'Syncing…' : 'Sync now'}
          </button>
        </div>
      </div>

      {(showToken || (syncState === 'error' && !token)) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sync trigger token</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={token}
              onChange={(e) => saveToken(e.target.value)}
              placeholder="SAAS_SYNC_TRIGGER_TOKEN"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button onClick={() => setShowToken(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Done</button>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Stored in this browser only. The 6-hour schedule runs without it.</p>
        </div>
      )}

      {syncMsg && (
        <div className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs ${
          syncState === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {syncState === 'error' ? <AlertCircle className="h-3.5 w-3.5 shrink-0" /> : <CheckCircle className="h-3.5 w-3.5 shrink-0" />}
          {syncMsg}
        </div>
      )}

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-900 p-3.5 text-center text-white">
          <p className="text-xl font-bold">{kes(mrr)}</p>
          <p className="text-[10px] font-medium text-slate-300">Total MRR</p>
        </div>
        {SAAS_PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-xl bg-slate-50 p-3.5 text-center">
            <p className="text-xl font-bold text-slate-700">{kes(byProduct[p.id] ?? 0)}</p>
            <p className="text-[10px] font-medium text-slate-600">{p.label} MRR</p>
          </div>
        ))}
        <div className="rounded-xl bg-amber-50 p-3.5 text-center">
          <p className="text-xl font-bold text-amber-700">{trials.length}</p>
          <p className="text-[10px] font-medium text-amber-700">Trials ending &lt;7d</p>
        </div>
      </div>

      {/* Search + product filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search org, admin email, plan…"
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(['all', 'mavuno', 'jamvi'] as const).map((f) => (
            <button key={f} onClick={() => setProduct(f)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${
                product === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}>
              {f === 'all' ? 'All' : saasProductLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {!loaded ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm font-medium text-slate-500">
          Loading subscriptions…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {subs.length === 0 ? 'No subscriptions synced yet' : 'Nothing matches your filter'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {subs.length === 0
              ? 'Configure MAVUNO_ORGS_URL / MAVUNO_SYNC_KEY on the Cloud Function, then hit “Sync now”.'
              : 'Try a different search or product.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Organisation</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3 text-right">Seats</th>
                <th className="px-4 py-3">Payroll</th>
                <th className="px-4 py-3 text-right">KES / month</th>
                <th className="px-4 py-3">Renews</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const renew = renewalDate(s);
                const sincePayroll = daysSincePayroll(s);
                return (
                  <tr key={`${s.product}_${s.orgId}`} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{s.orgName}</p>
                      {s.adminEmail && <p className="text-xs text-slate-400">{s.adminEmail}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.productLabel}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-slate-700">{s.plan}</span>
                      <span className="ml-1 text-xs text-slate-400">/ {s.billingCycle}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {s.seats}{s.seatLimit ? <span className="text-xs text-slate-400"> / {s.seatLimit}</span> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {s.payrollRuns > 0 ? (
                        <>
                          <span className="tabular-nums">{s.payrollRuns}</span> run{s.payrollRuns === 1 ? '' : 's'}
                          {sincePayroll != null && (
                            <span className="ml-1 text-xs text-slate-400">
                              · {sincePayroll === 0 ? 'today' : `${sincePayroll}d ago`}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                      {kes(s.monthlyChargeCents)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {renew ? new Date(renew).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusPill(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
