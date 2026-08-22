import { useState, useMemo } from 'react';
import {
  KeyRound, Search, Plus, Trash2, Download, Users, CalendarClock, X,
  AlertCircle, CheckCircle2, Pencil, Package,
} from 'lucide-react';
import type {
  SiteData, Client, ClientProduct, ProductKind, LicenceTerm, TallyEdition,
} from '../../data/siteData';
import {
  PRODUCT_KINDS, PRODUCT_RULES, productExpires, productLabel,
  clientProducts, syncClientLicence, daysUntilDate, isValidSerial, clientOnboarded,
} from '../../data/siteData';
import { downloadFile } from '../crm/crmExport';

interface P { data: SiteData; onSave: (d: SiteData) => void }

// ── Why this tab exists ─────────────────────────────────────────────────────
// Demo Leads tracks a deal up to the moment it is won and then stops caring.
// But a won customer is not one thing: they hold a licence, the TSS that keeps
// it current, sometimes a Tally Server, sometimes a customization written for
// them alone — each with its own activation date and, where the product has
// one, its own expiry. That is the record support rings up about and the record
// the renewal reminders are built on, so it needs a home of its own.
//
// A customer is identified by their Tally serial number, never by name: names
// are typed differently every time, serials are not.

const fmt = (d?: string): string =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

// A product line paired with the customer it belongs to, which is what the
// table actually shows: one row per thing owned, not one row per customer.
interface Row { client: Client; product: ClientProduct }

type Health = 'expired' | 'critical' | 'soon' | 'active' | 'perpetual';

const healthOf = (p: ClientProduct): Health => {
  if (!productExpires(p)) return 'perpetual';
  const days = daysUntilDate(p.expiresOn);
  if (days === null) return 'active';   // expires, but no date captured yet
  if (days < 0) return 'expired';
  if (days <= 30) return 'critical';
  if (days <= 90) return 'soon';
  return 'active';
};

const HEALTH_STYLE: Record<Health, { chip: string; text: (p: ClientProduct) => string }> = {
  expired:   { chip: 'bg-red-100 text-red-700 border-red-200',
               text: p => `Expired ${Math.abs(daysUntilDate(p.expiresOn) ?? 0)}d ago` },
  critical:  { chip: 'bg-orange-100 text-orange-700 border-orange-200',
               text: p => `${daysUntilDate(p.expiresOn)}d left` },
  soon:      { chip: 'bg-amber-100 text-amber-700 border-amber-200',
               text: p => `${daysUntilDate(p.expiresOn)}d left` },
  active:    { chip: 'bg-emerald-100 text-emerald-700 border-emerald-200',
               text: p => p.expiresOn ? `${daysUntilDate(p.expiresOn)}d left` : 'No expiry date yet' },
  // Owned outright. Saying "active" would imply something could lapse.
  perpetual: { chip: 'bg-slate-100 text-slate-600 border-slate-200',
               text: () => 'Owned outright' },
};

const newProduct = (kind: ProductKind = 'Tally Silver'): ClientProduct => ({
  id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  kind,
  term: PRODUCT_RULES[kind].term ? 'Annual' : undefined,
  activatedOn: new Date().toISOString().split('T')[0],
  expiresOn: '',
});

export default function CustomerDirectory({ data, onSave }: P) {
  const clients = useMemo(() => data.clients || [], [data.clients]);

  const [search, setSearch] = useState('');
  const [filterKind, setFilterKind] = useState<'All' | ProductKind>('All');
  const [filterHealth, setFilterHealth] = useState<'All' | 'expiring' | 'expired'>('All');
  const [editing, setEditing] = useState<Client | null>(null);
  const [formError, setFormError] = useState('');

  // One row per product owned. Legacy records with no product list are read
  // through clientProducts, which reconstructs their licence and TSS lines.
  const allRows = useMemo<Row[]>(
    () => clients.flatMap(c => clientProducts(c).map(product => ({ client: c, product }))),
    [clients],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows.filter(({ client, product }) => {
      if (filterKind !== 'All' && product.kind !== filterKind) return false;
      if (filterHealth !== 'All') {
        const h = healthOf(product);
        if (filterHealth === 'expired' && h !== 'expired') return false;
        if (filterHealth === 'expiring' && h !== 'critical' && h !== 'soon') return false;
      }
      if (!q) return true;
      return [
        client.serialNo, client.company, client.contactName, client.phone, client.email,
        productLabel(product), product.notes,
      ].some(v => (v || '').toLowerCase().includes(q));
    }).sort((a, b) =>
      (a.client.company || '').localeCompare(b.client.company || '')
      || a.product.kind.localeCompare(b.product.kind));
  }, [allRows, search, filterKind, filterHealth]);

  const counts = useMemo(() => {
    let expiring = 0, expired = 0;
    allRows.forEach(({ product }) => {
      const h = healthOf(product);
      if (h === 'expired') expired++;
      if (h === 'critical' || h === 'soon') expiring++;
    });
    return { customers: clients.length, lines: allRows.length, expiring, expired };
  }, [allRows, clients.length]);

  // ── Editing a customer's products ─────────────────────────────────────────
  const openEdit = (c: Client) => {
    // Materialise the reconstructed lines on first edit, so a legacy record
    // starts from what the directory has been showing rather than from blank.
    setEditing({ ...c, products: clientProducts(c).map(p => ({ ...p })) });
    setFormError('');
  };

  const openNew = () => {
    setEditing({
      id: `cl_${Date.now()}`,
      serialNo: '',
      company: '',
      edition: 'Silver' as TallyEdition,
      term: 'Annual' as LicenceTerm,
      products: [newProduct()],
      createdAt: new Date().toISOString(),
    });
    setFormError('');
  };

  const setField = <K extends keyof Client>(field: K, value: Client[K]) =>
    setEditing(prev => prev ? { ...prev, [field]: value } : prev);

  const setProduct = (id: string, patch: Partial<ClientProduct>) =>
    setEditing(prev => prev ? {
      ...prev,
      products: (prev.products || []).map(p => {
        if (p.id !== id) return p;
        const next = { ...p, ...patch };
        // Changing the kind can strip the term or the expiry out from under
        // the row — a Perpetual licence or a Tally Server must not keep an
        // expiry date it can never reach.
        const rule = PRODUCT_RULES[next.kind];
        if (!rule.term) next.term = undefined;
        else if (!next.term) next.term = 'Annual';
        if (!rule.customName) next.name = undefined;
        if (!productExpires(next)) next.expiresOn = undefined;
        return next;
      }),
    } : prev);

  const addProduct = () => setEditing(prev => prev ? {
    ...prev, products: [...(prev.products || []), newProduct()],
  } : prev);

  const removeProduct = (id: string) => setEditing(prev => prev ? {
    ...prev, products: (prev.products || []).filter(p => p.id !== id),
  } : prev);

  const saveClient = () => {
    if (!editing) return;
    const serial = editing.serialNo.trim();
    if (!isValidSerial(serial)) {
      setFormError('A Tally serial number is exactly 9 digits — it is what identifies the customer.');
      return;
    }
    // The serial is the identity, so it has to stay unique across the register.
    const clash = clients.find(c => c.serialNo === serial && c.id !== editing.id);
    if (clash) {
      setFormError(`Serial ${serial} already belongs to ${clash.company}. Edit that record instead.`);
      return;
    }
    if (!editing.company.trim()) { setFormError('The customer needs a name.'); return; }
    // A customization with no name is not a record of anything.
    const products = (editing.products || [])
      .filter(p => p.kind !== 'Customization' || !!p.name?.trim());
    if (products.length === 0) {
      setFormError('Add at least one product. A customization also needs the name the customer knows it by.');
      return;
    }
    // Keep the four legacy licence fields in step, so the Renewals tab and the
    // CRM report — which read those, not this list — stay correct.
    const record = syncClientLicence({ ...editing, serialNo: serial, products });
    const exists = clients.some(c => c.id === record.id);
    onSave({
      ...data,
      clients: exists ? clients.map(c => c.id === record.id ? record : c) : [record, ...clients],
    });
    setEditing(null);
    setFormError('');
  };

  const removeClient = (c: Client) => {
    if (!window.confirm(`Remove ${c.company} (${c.serialNo}) from the customer directory? Their leads and delivery jobs are not touched.`)) return;
    onSave({ ...data, clients: clients.filter(x => x.id !== c.id) });
  };

  const exportCsv = () => {
    const esc = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const lines = [
      ['Serial Number', 'Customer', 'Contact', 'Phone', 'Email', 'Onboarded', 'Product', 'Term', 'Activated', 'Expires', 'Status'].join(','),
      ...rows.map(({ client, product }) => [
        client.serialNo, client.company, client.contactName || '', client.phone || '', client.email || '',
        clientOnboarded(client) || '',
        productLabel(product), product.term || '—',
        product.activatedOn || '',
        productExpires(product) ? (product.expiresOn || '') : 'Not applicable',
        HEALTH_STYLE[healthOf(product)].text(product),
      ].map(v => esc(String(v))).join(',')),
    ];
    downloadFile(
      `customer-directory-${new Date().toISOString().split('T')[0]}.csv`,
      lines.join('\n'), 'text/csv;charset=utf-8',
    );
  };

  return (
    <div className="space-y-5">
      {/* ── Header & stats ── */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" /> Customer Directory
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              Every customer whose deal closed won, by Tally serial number, with each product
              they hold and when it was activated. Expiry is shown only where the product has
              one — a Perpetual licence and a Tally Server never lapse.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} disabled={rows.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button onClick={openNew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition">
              <Plus className="h-3.5 w-3.5" /> Add customer
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-2xl font-black text-slate-900">{counts.customers}</p>
            <p className="text-xs font-semibold text-slate-500">Customers</p>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
            <p className="text-2xl font-black text-sky-700">{counts.lines}</p>
            <p className="text-xs font-semibold text-sky-600">Products held</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-2xl font-black text-amber-700">{counts.expiring}</p>
            <p className="text-xs font-semibold text-amber-600">Expiring in 90 days</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-2xl font-black text-red-700">{counts.expired}</p>
            <p className="text-xs font-semibold text-red-600">Already expired</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by serial number, customer, contact or product…"
              className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div className="flex gap-2">
            {(['All', 'expiring', 'expired'] as const).map(h => (
              <button key={h} onClick={() => setFilterHealth(h)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  filterHealth === h ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {h === 'All' ? 'All' : h === 'expiring' ? 'Expiring soon' : 'Expired'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(['All', ...PRODUCT_KINDS] as const).map(k => (
            <button key={k} onClick={() => setFilterKind(k as 'All' | ProductKind)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filterKind === k ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {k === 'All' ? 'All products' : k}
            </button>
          ))}
        </div>
      </div>

      {/* ── The directory itself ── */}
      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <KeyRound className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No customers on record yet</p>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            A customer record is created automatically the first time a deal is closed won with
            its serial number. Existing customers who never came through the pipeline can be
            added here by hand.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-700">Nothing matches those filters</p>
          <p className="mt-1 text-xs text-slate-500">Clear the search or widen the product filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Serial number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Onboarded</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Activated</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ client, product }, i) => {
                  const health = healthOf(product);
                  const style = HEALTH_STYLE[health];
                  // Only label the customer on the first of their rows, so a
                  // customer holding four products reads as one block.
                  const firstOfClient = i === 0 || rows[i - 1].client.id !== client.id;
                  return (
                    <tr key={`${client.id}_${product.id}`}
                      className={`text-sm border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition ${
                        firstOfClient ? 'border-t border-slate-100' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs tracking-wide text-slate-900">
                        {firstOfClient ? client.serialNo : <span className="text-slate-300">↳</span>}
                      </td>
                      <td className="px-4 py-3">
                        {firstOfClient ? (
                          <>
                            <p className="font-bold text-slate-900">{client.company}</p>
                            {client.contactName && <p className="text-xs text-slate-500">{client.contactName}</p>}
                          </>
                        ) : <span className="text-slate-300 text-xs">same customer</span>}
                      </td>
                      {/* One date per customer, not per product: it is when the
                          relationship started, so it belongs with the serial. */}
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {firstOfClient ? fmt(clientOnboarded(client)) : ''}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                          <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {productLabel(product)}
                        </span>
                        {product.notes && <p className="text-xs text-slate-400 mt-0.5">{product.notes}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{fmt(product.activatedOn)}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {productExpires(product)
                          ? (product.expiresOn ? fmt(product.expiresOn)
                              : <span className="text-amber-600 font-semibold">Not captured</span>)
                          : <span className="text-slate-400">Not applicable</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${style.chip}`}>
                          {style.text(product)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {firstOfClient && (
                          <div className="inline-flex gap-1">
                            <button onClick={() => openEdit(client)} title="Edit this customer"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => removeClient(client)} title="Remove from directory"
                              className="rounded-lg border border-slate-200 p-1.5 text-red-600 hover:bg-red-50 transition">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / edit a customer and their products ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-black text-slate-900">
                {clients.some(c => c.id === editing.id) ? 'Edit customer' : 'Add customer'}
              </h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Who they are */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Tally serial number *</span>
                  <input value={editing.serialNo} inputMode="numeric" maxLength={9}
                    onChange={e => setField('serialNo', e.target.value.replace(/\D/g, ''))}
                    placeholder="9 digits"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tracking-wide outline-none focus:border-accent" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Customer / company *</span>
                  <input value={editing.company} onChange={e => setField('company', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Contact person</span>
                  <input value={editing.contactName || ''} onChange={e => setField('contactName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Phone</span>
                  <input value={editing.phone || ''} onChange={e => setField('phone', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Onboarded on</span>
                  <input type="date" value={editing.onboardedOn || clientOnboarded(editing) || ''}
                    onChange={e => setField('onboardedOn', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Email</span>
                  <input value={editing.email || ''} onChange={e => setField('email', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                </label>
              </div>

              {/* What they own */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">Products held</h4>
                  <button onClick={addProduct}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition">
                    <Plus className="h-3.5 w-3.5" /> Add product
                  </button>
                </div>

                <div className="mt-2 space-y-3">
                  {(editing.products || []).map(p => {
                    const rule = PRODUCT_RULES[p.kind];
                    const expires = productExpires(p);
                    return (
                      <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="text-[11px] font-bold text-slate-500">Product</span>
                            <select value={p.kind}
                              onChange={e => setProduct(p.id, { kind: e.target.value as ProductKind })}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent">
                              {PRODUCT_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                          </label>

                          {rule.term ? (
                            <label className="block">
                              <span className="text-[11px] font-bold text-slate-500">Term</span>
                              <select value={p.term || 'Annual'}
                                onChange={e => setProduct(p.id, { term: e.target.value as LicenceTerm })}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent">
                                <option value="Annual">Annual</option>
                                <option value="Perpetual">Perpetual</option>
                              </select>
                            </label>
                          ) : (
                            <div className="flex items-end">
                              <p className="text-[11px] text-slate-500 pb-2.5">
                                {p.kind === 'TSS'
                                  ? 'TSS is a subscription — it always carries an expiry date.'
                                  : 'Owned outright — no term, nothing to renew.'}
                              </p>
                            </div>
                          )}

                          {rule.customName && (
                            <label className="block sm:col-span-2">
                              <span className="text-[11px] font-bold text-slate-500">
                                What the customer calls it *
                              </span>
                              <input value={p.name || ''} onChange={e => setProduct(p.id, { name: e.target.value })}
                                placeholder="e.g. Branch-wise stock ageing report"
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
                            </label>
                          )}

                          <label className="block">
                            <span className="text-[11px] font-bold text-slate-500">Activation date</span>
                            <input type="date" value={p.activatedOn || ''}
                              onChange={e => setProduct(p.id, { activatedOn: e.target.value })}
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
                          </label>

                          {/* Hidden rather than disabled: a Perpetual licence has
                              no expiry, and an empty box invites one to be typed. */}
                          {expires ? (
                            <label className="block">
                              <span className="text-[11px] font-bold text-slate-500">Expiry date</span>
                              <input type="date" value={p.expiresOn || ''}
                                onChange={e => setProduct(p.id, { expiresOn: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
                            </label>
                          ) : (
                            <div className="flex items-end">
                              <p className="text-[11px] text-slate-500 pb-2.5">No expiry applies to this product.</p>
                            </div>
                          )}

                          <label className="block sm:col-span-2">
                            <span className="text-[11px] font-bold text-slate-500">Note (optional)</span>
                            <input value={p.notes || ''} onChange={e => setProduct(p.id, { notes: e.target.value })}
                              placeholder="e.g. 5 users, 3 branches"
                              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
                          </label>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <button onClick={() => removeProduct(p.id)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition">
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(editing.products || []).length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                      No products yet — add the licence, its TSS, and anything else they hold.
                    </p>
                  )}
                </div>
              </div>

              {formError && (
                <p className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs font-semibold text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                Expiry dates feed the Renewals &amp; Upgrades reminders.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={saveClient}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition">
                  Save customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
