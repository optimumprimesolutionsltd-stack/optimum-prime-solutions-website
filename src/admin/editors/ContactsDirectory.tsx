import { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { fbSubscribe } from '../../firebase/config';
import type { Lead } from '../../data/siteData';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

interface WhatsAppContact {
  id: string;
  phone: string;
  name?: string;
  addedAt: string;
}

interface Registrant {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

type Source = 'lead' | 'subscriber' | 'whatsapp' | 'workshop' | 'webinar';

interface UnifiedContact {
  id: string;
  name: string;
  // How trustworthy the current name is, so a merge doesn't let a WhatsApp
  // push-name overwrite the real name captured on a lead form.
  namePriority: number;
  // Every address/number this person is known by — a merged contact with two
  // emails must show both, otherwise the second one is invisible in the panel.
  emails: string[];
  phones: string[];
  company?: string;
  sources: Set<Source>;
  lastInteraction: string;
  status: 'active' | 'unsubscribed';
}

interface Props {
  leads: Lead[];
  // Optional overrides — normally the directory subscribes to Firebase itself so
  // subscribers and WhatsApp contacts show up without the parent wiring them in.
  subscribers?: Subscriber[];
  whatsappContacts?: WhatsAppContact[];
}

const normEmail = (e?: string) => (e || '').trim().toLowerCase();

// Match the same person across sources despite formatting: 0722123456,
// +254722123456 and 254722123456 all reduce to the same 9 significant digits.
const normPhone = (p?: string) => {
  const digits = (p || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length > 9 ? digits.slice(-9) : digits;
};

const newer = (a: string, b: string) => new Date(a).getTime() > new Date(b).getTime();

interface RawRecord {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  at?: string;
  source: Source;
  status?: 'active' | 'unsubscribed';
}

const SOURCE_NAME_RANK: Record<Source, number> = {
  lead: 5, workshop: 4, webinar: 4, subscriber: 2, whatsapp: 1,
};

// A "name" that is really just the email or phone repeated carries no
// information, so it must never win over a genuine name from another source.
const nameRank = (rec: RawRecord) => {
  const n = (rec.name || '').trim();
  if (!n) return 0;
  if (n === normEmail(rec.email) || normPhone(n) === normPhone(rec.phone)) return 0;
  return SOURCE_NAME_RANK[rec.source];
};

const addValue = (list: string[], value: string | undefined, norm: (v?: string) => string) => {
  const v = (value || '').trim();
  if (!v) return;
  const key = norm(v);
  if (!key) return;
  if (!list.some(existing => norm(existing) === key)) list.push(v);
};

function unify(records: RawRecord[]): UnifiedContact[] {
  const byEmail = new Map<string, UnifiedContact>();
  const byPhone = new Map<string, UnifiedContact>();
  const all: UnifiedContact[] = [];
  const merged = new Set<UnifiedContact>();

  const absorb = (target: UnifiedContact, other: UnifiedContact) => {
    other.sources.forEach(s => target.sources.add(s));
    other.emails.forEach(e => addValue(target.emails, e, normEmail));
    other.phones.forEach(p => addValue(target.phones, p, normPhone));
    target.company = target.company || other.company;
    if (other.namePriority > target.namePriority) {
      target.name = other.name;
      target.namePriority = other.namePriority;
    }
    if (newer(other.lastInteraction, target.lastInteraction)) {
      target.lastInteraction = other.lastInteraction;
    }
    if (other.status === 'unsubscribed') target.status = 'unsubscribed';
    byEmail.forEach((v, k) => { if (v === other) byEmail.set(k, target); });
    byPhone.forEach((v, k) => { if (v === other) byPhone.set(k, target); });
    merged.add(other);
  };

  for (const rec of records) {
    const email = normEmail(rec.email);
    const phone = normPhone(rec.phone);
    const viaEmail = email ? byEmail.get(email) : undefined;
    const viaPhone = phone ? byPhone.get(phone) : undefined;

    // A record carrying both identifiers can bridge two entries that were
    // previously only known by one each — fold them together.
    let entry = viaEmail || viaPhone;
    if (viaEmail && viaPhone && viaEmail !== viaPhone) {
      absorb(viaEmail, viaPhone);
      entry = viaEmail;
    }

    const rank = nameRank(rec);

    if (!entry) {
      // No identifiers at all still gets its own row rather than collapsing
      // every contactless record into a single entry.
      entry = {
        id: rec.id,
        name: (rec.name || '').trim() || rec.email || rec.phone || 'Unknown',
        namePriority: rank,
        emails: [],
        phones: [],
        company: rec.company || undefined,
        sources: new Set<Source>([rec.source]),
        lastInteraction: rec.at || '',
        status: rec.status || 'active',
      };
      all.push(entry);
    } else {
      entry.sources.add(rec.source);
      entry.company = entry.company || rec.company || undefined;
      if (rank > entry.namePriority) {
        entry.name = (rec.name || '').trim();
        entry.namePriority = rank;
      }
      if (rec.at && (!entry.lastInteraction || newer(rec.at, entry.lastInteraction))) {
        entry.lastInteraction = rec.at;
      }
      if (rec.status === 'unsubscribed') entry.status = 'unsubscribed';
    }

    addValue(entry.emails, rec.email, normEmail);
    addValue(entry.phones, rec.phone, normPhone);

    if (email) byEmail.set(email, entry);
    if (phone) byPhone.set(phone, entry);
  }

  return all.filter(c => !merged.has(c));
}

export default function ContactsDirectory({ leads, subscribers, whatsappContacts }: Props) {
  const [search, setSearch] = useState('');
  const [liveSubscribers, setLiveSubscribers] = useState<Subscriber[]>([]);
  const [liveWhatsApp, setLiveWhatsApp] = useState<WhatsAppContact[]>([]);
  const [workshopRegs, setWorkshopRegs] = useState<Registrant[]>([]);
  const [webinarRegs, setWebinarRegs] = useState<Registrant[]>([]);

  useEffect(() => {
    if (subscribers) return;
    return fbSubscribe('newsletter_subscribers', (raw: Record<string, any> | null) => {
      setLiveSubscribers(
        raw ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Subscriber) : [],
      );
    });
  }, [subscribers]);

  useEffect(() => {
    if (whatsappContacts) return;
    return fbSubscribe('whatsapp_conversations', (raw: Record<string, any> | null) => {
      setLiveWhatsApp(
        raw
          ? Object.entries(raw).map(([digits, node]: [string, any]) => ({
              id: digits,
              phone: node?.meta?.phone || `+${digits}`,
              name: node?.meta?.name,
              addedAt: node?.meta?.lastMessageAt || '',
            }))
          : [],
      );
    });
  }, [whatsappContacts]);

  useEffect(() => {
    const parse = (raw: Record<string, any> | null): Registrant[] =>
      raw ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Registrant) : [];
    const unsubWorkshop = fbSubscribe('workshop_registrants', raw => setWorkshopRegs(parse(raw)));
    const unsubWebinar = fbSubscribe('webinar_registrants', raw => setWebinarRegs(parse(raw)));
    return () => { unsubWorkshop(); unsubWebinar(); };
  }, []);

  const subs = subscribers ?? liveSubscribers;
  const waContacts = whatsappContacts ?? liveWhatsApp;

  const unifiedContacts = useMemo(() => {
    const records: RawRecord[] = [
      ...leads.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        at: l.createdAt,
        source: 'lead' as const,
      })),
      ...subs.map(s => ({
        id: s.id,
        name: s.name || s.email,
        email: s.email,
        at: s.subscribedAt,
        source: 'subscriber' as const,
        status: s.status,
      })),
      ...waContacts.map(w => ({
        id: w.id,
        name: w.name || w.phone,
        phone: w.phone,
        at: w.addedAt,
        source: 'whatsapp' as const,
      })),
      ...workshopRegs.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        company: r.company,
        at: r.createdAt,
        source: 'workshop' as const,
      })),
      ...webinarRegs.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        company: r.company,
        at: r.createdAt,
        source: 'webinar' as const,
      })),
    ];
    return unify(records).sort((a, b) =>
      new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime(),
    );
  }, [leads, subs, waContacts, workshopRegs, webinarRegs]);

  const counts = useMemo(() => ({
    lead: unifiedContacts.filter(c => c.sources.has('lead')).length,
    subscriber: unifiedContacts.filter(c => c.sources.has('subscriber')).length,
    whatsapp: unifiedContacts.filter(c => c.sources.has('whatsapp')).length,
    workshop: unifiedContacts.filter(c => c.sources.has('workshop')).length,
    webinar: unifiedContacts.filter(c => c.sources.has('webinar')).length,
  }), [unifiedContacts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return unifiedContacts;
    const q = search.trim().toLowerCase();
    const qDigits = normPhone(q);
    return unifiedContacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      c.emails.some(e => e.toLowerCase().includes(q)) ||
      (!!qDigits && c.phones.some(p => normPhone(p).includes(qDigits)))
    );
  }, [unifiedContacts, search]);

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Sources', 'Status', 'Last Interaction'];
    const rows = filtered.map(c => [
      c.name,
      c.company || '',
      c.emails.join(' / '),
      c.phones.join(' / '),
      Array.from(c.sources).join(' + '),
      c.status,
      c.lastInteraction ? new Date(c.lastInteraction).toLocaleDateString('en-GB') : '',
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unified-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Unified Contacts Directory</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {unifiedContacts.length} unique contacts — {counts.lead} leads, {counts.subscriber} subscribers,{' '}
            {counts.whatsapp} WhatsApp, {counts.workshop} workshop, {counts.webinar} webinar
            <span className="block text-xs text-slate-400 mt-0.5">
              One row per person: the same email or phone across sources is merged into a single contact.
            </span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Sources</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Last Interaction</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(contact => (
              <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{contact.company || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {contact.emails.length === 0 ? '—' : contact.emails.map(e => <div key={e}>{e}</div>)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {contact.phones.length === 0 ? '—' : contact.phones.map(p => <div key={p}>{p}</div>)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-1.5 flex-wrap">
                    {contact.sources.has('lead') && (
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Lead</span>
                    )}
                    {contact.sources.has('subscriber') && (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Sub</span>
                    )}
                    {contact.sources.has('whatsapp') && (
                      <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">WA</span>
                    )}
                    {contact.sources.has('workshop') && (
                      <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Workshop</span>
                    )}
                    {contact.sources.has('webinar') && (
                      <span className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">Webinar</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {contact.status === 'active' ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Unsubscribed</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {contact.lastInteraction
                    ? new Date(contact.lastInteraction).toLocaleDateString('en-GB')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-600">No contacts match your search.</p>
        </div>
      )}
    </div>
  );
}
