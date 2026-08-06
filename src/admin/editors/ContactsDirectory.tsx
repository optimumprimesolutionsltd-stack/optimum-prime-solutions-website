import { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import type { Lead } from '../../data/siteData';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  source: 'subscriber';
}

interface WhatsAppContact {
  id: string;
  phone: string;
  name?: string;
  lastMessage?: string;
  messageCount: number;
  addedAt: string;
  source: 'whatsapp';
}

interface UnifiedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  sources: Set<'lead' | 'subscriber' | 'whatsapp'>;
  lastInteraction: string;
  status: 'active' | 'unsubscribed';
}

interface Props {
  leads: Lead[];
  subscribers: Subscriber[];
  whatsappContacts: WhatsAppContact[];
}

export default function ContactsDirectory({ leads, subscribers, whatsappContacts }: Props) {
  const [search, setSearch] = useState('');

  const unifiedContacts = useMemo(() => {
    const contactMap = new Map<string, UnifiedContact>();

    leads.forEach(l => {
      const key = `${l.email || ''}|${l.phone || ''}`.toLowerCase();
      if (!contactMap.has(key)) {
        contactMap.set(key, {
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          company: l.company,
          sources: new Set(['lead']),
          lastInteraction: l.createdAt,
          status: 'active',
        });
      } else {
        const existing = contactMap.get(key)!;
        existing.sources.add('lead');
        if (!existing.company && l.company) {
          existing.company = l.company;
        }
        if (new Date(l.createdAt).getTime() > new Date(existing.lastInteraction).getTime()) {
          existing.lastInteraction = l.createdAt;
        }
      }
    });

    subscribers.forEach(s => {
      const key = `${s.email}|`.toLowerCase();
      if (!contactMap.has(key)) {
        contactMap.set(key, {
          id: s.id,
          name: s.name || s.email,
          email: s.email,
          sources: new Set(['subscriber']),
          lastInteraction: s.subscribedAt,
          status: s.status,
        });
      } else {
        const existing = contactMap.get(key)!;
        existing.sources.add('subscriber');
        if (!existing.name || existing.name === existing.email) {
          existing.name = s.name || s.email;
        }
        existing.status = s.status;
      }
    });

    whatsappContacts.forEach(w => {
      const key = `|${w.phone}`.toLowerCase();
      if (!contactMap.has(key)) {
        contactMap.set(key, {
          id: w.id,
          name: w.name || w.phone,
          phone: w.phone,
          sources: new Set(['whatsapp']),
          lastInteraction: w.addedAt,
          status: 'active',
        });
      } else {
        const existing = contactMap.get(key)!;
        existing.sources.add('whatsapp');
        if (!existing.name || existing.name === existing.phone) {
          existing.name = w.name || w.phone;
        }
      }
    });

    return Array.from(contactMap.values());
  }, [leads, subscribers, whatsappContacts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return unifiedContacts;
    const q = search.toLowerCase();
    return unifiedContacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  }, [unifiedContacts, search]);

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Sources', 'Status', 'Last Interaction'];
    const rows = filtered.map(c => [
      c.name,
      c.company || '',
      c.email || '',
      c.phone || '',
      Array.from(c.sources).join(' + '),
      c.status,
      new Date(c.lastInteraction).toLocaleDateString('en-GB'),
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
            {unifiedContacts.length} unique contacts merged from leads, subscribers & WhatsApp
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
            {filtered.map((contact, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{contact.company || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{contact.email || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{contact.phone || '—'}</td>
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
                  {new Date(contact.lastInteraction).toLocaleDateString('en-GB')}
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
