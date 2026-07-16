import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Mail, Phone, Building2, Calendar, Download, Users as UsersIcon } from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';

interface Registrant {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  createdAt: string;
  status?: string;
}

export default function WorkshopRegistrationsManager() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = fbSubscribe('workshop_registrants', (raw: Record<string, any> | null) => {
      const list = raw
        ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Registrant)
        : [];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRegistrants(list);
      setLoaded(true);
    });
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return registrants;
    const q = search.toLowerCase();
    return registrants.filter(r =>
      r.name.toLowerCase().includes(q)
      || r.email.toLowerCase().includes(q)
      || (r.company || '').toLowerCase().includes(q)
      || r.phone.includes(q)
    );
  }, [registrants, search]);

  const removeRegistrant = (id: string) => {
    if (confirm('Remove this registration permanently?')) {
      fbSet(`workshop_registrants/${id}`, null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Registered At'];
    const rows = registrants.map(r => [r.name, r.email, r.phone, r.company || '', r.createdAt]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'workshop-registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Workshop RSVPs</h2>
          <p className="text-sm text-navy-500 mt-0.5">Registrations from the Inventory Management Breakfast Workshop invite link</p>
        </div>
        <button onClick={exportCSV} disabled={registrants.length === 0}
          className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition disabled:opacity-40">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-navy-50 p-3 text-center">
          <p className="text-xl font-bold text-navy-700">{registrants.length}</p>
          <p className="text-[10px] font-medium text-navy-700">Total RSVPs</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, company..."
          className="w-full rounded-lg border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
      </div>

      {!loaded ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-navy-500">Loading registrations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm font-medium text-navy-500">
            {registrants.length === 0 ? 'No registrations yet' : 'No registrations match your search'}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {registrants.length === 0
              ? 'Share the invite link — signups will appear here.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-2xl border border-navy-200 bg-white p-4 space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-navy-900 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {r.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy-900 truncate">{r.name}</p>
                  <p className="text-xs text-navy-500 truncate">{r.phone} · {r.company || 'No company'}</p>
                </div>
                <span className="text-[10px] text-navy-400 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                <button onClick={() => removeRegistrant(r.id)}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-14 text-xs text-navy-600">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">{r.email || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Building2 className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">{r.company || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Calendar className="h-3.5 w-3.5 text-navy-400 shrink-0" /><span className="truncate">Fri 24 Jul, 7:00 AM</span>
                </div>
              </div>
              <div className="pl-14 flex items-center gap-2 pt-1">
                {r.email && (
                  <a href={`mailto:${r.email}`}
                    className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition">
                    Send Email
                  </a>
                )}
                <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
                  <Phone className="h-3 w-3 inline mr-1" />WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
