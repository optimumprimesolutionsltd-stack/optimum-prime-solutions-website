import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Mail, Download, Plus, UserCheck, UserX, Users as UsersIcon } from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';

interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    const unsubscribe = fbSubscribe('newsletter_subscribers', (raw: Record<string, any> | null) => {
      const list = raw
        ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Subscriber)
        : [];
      list.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
      setSubscribers(list);
      setLoaded(true);
    });
    return unsubscribe;
  }, []);

  // De-duplicate by lowercased email — keep the most recent record per address,
  // same rule the notify-subscribers backend uses when picking who to email.
  const deduped = useMemo(() => {
    const seen = new Map<string, Subscriber>();
    for (const s of subscribers) {
      const key = s.email.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, s);
    }
    return Array.from(seen.values());
  }, [subscribers]);

  const activeCount = deduped.filter(s => s.status !== 'unsubscribed').length;
  const unsubCount = deduped.length - activeCount;

  const filtered = useMemo(() => {
    let list = deduped;
    if (filter === 'active') list = list.filter(s => s.status !== 'unsubscribed');
    if (filter === 'unsubscribed') list = list.filter(s => s.status === 'unsubscribed');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.email.toLowerCase().includes(q));
    }
    return list;
  }, [deduped, filter, search]);

  const toggleStatus = (s: Subscriber) => {
    const next = s.status === 'unsubscribed' ? 'active' : 'unsubscribed';
    fbSet(`newsletter_subscribers/${s.id}/status`, next);
  };

  const removeSubscriber = (id: string) => {
    if (confirm('Delete this subscriber record permanently? This cannot be undone.')) {
      fbSet(`newsletter_subscribers/${id}`, null);
    }
  };

  const addSubscriber = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email) { setAddError('Enter an email address'); return; }
    if (!emailPattern.test(email)) { setAddError('That doesn\'t look like a valid email'); return; }
    if (deduped.some(s => s.email.trim().toLowerCase() === email && s.status !== 'unsubscribed')) {
      setAddError('Already an active subscriber');
      return;
    }
    setAddError('');
    const id = Date.now().toString();
    fbSet(`newsletter_subscribers/${id}`, {
      email,
      status: 'active',
      subscribedAt: new Date().toISOString(),
    });
    setNewEmail('');
  };

  const exportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed At'];
    const rows = deduped.map(s => [s.email, s.status, s.subscribedAt]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Newsletter Subscribers</h2>
          <p className="text-sm text-navy-500 mt-0.5">Everyone who gets "Notify Subscribers" blog emails via Resend</p>
        </div>
        <button onClick={exportCSV} disabled={deduped.length === 0}
          className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition disabled:opacity-40">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Add subscriber */}
      <div className="rounded-2xl border border-navy-200 bg-white p-4">
        <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Add subscriber manually</p>
        <div className="flex gap-2">
          <input
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setAddError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') addSubscriber(); }}
            placeholder="someone@company.com"
            className="flex-1 rounded-lg border border-navy-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button onClick={addSubscriber}
            className="flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800 transition shrink-0">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {addError && <p className="mt-1.5 text-xs text-red-600">{addError}</p>}
        <p className="mt-1.5 text-xs text-navy-500">They won't get a welcome email — this just adds them to future blog-post broadcasts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-navy-50 p-3 text-center">
          <p className="text-xl font-bold text-navy-700">{deduped.length}</p>
          <p className="text-[10px] font-medium text-navy-700">Total</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-xl font-bold text-green-700">{activeCount}</p>
          <p className="text-[10px] font-medium text-green-700">Active</p>
        </div>
        <div className="rounded-xl bg-navy-50 p-3 text-center">
          <p className="text-xl font-bold text-navy-500">{unsubCount}</p>
          <p className="text-[10px] font-medium text-navy-500">Unsubscribed</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full rounded-lg border border-navy-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
        </div>
        <div className="flex rounded-lg border border-navy-200 overflow-hidden">
          {(['active', 'unsubscribed', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${filter === f ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 hover:bg-navy-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {!loaded ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-navy-500">Loading subscribers…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm font-medium text-navy-500">
            {deduped.length === 0 ? 'No subscribers yet' : 'No subscribers match your search'}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            {deduped.length === 0
              ? 'Newsletter signups from the website will appear here.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-navy-200 bg-white p-3.5">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${s.status === 'unsubscribed' ? 'bg-navy-100' : 'bg-green-100'}`}>
                <Mail className={`h-4 w-4 ${s.status === 'unsubscribed' ? 'text-navy-400' : 'text-green-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900 truncate">{s.email}</p>
                <p className="text-[10px] text-navy-400">{new Date(s.subscribedAt).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${
                s.status === 'unsubscribed' ? 'bg-navy-100 text-navy-500' : 'bg-green-100 text-green-700'
              }`}>
                {s.status === 'unsubscribed' ? 'Unsubscribed' : 'Active'}
              </span>
              <button onClick={() => toggleStatus(s)}
                title={s.status === 'unsubscribed' ? 'Reactivate' : 'Mark unsubscribed'}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 transition shrink-0">
                {s.status === 'unsubscribed' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
              </button>
              <button onClick={() => removeSubscriber(s.id)}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
