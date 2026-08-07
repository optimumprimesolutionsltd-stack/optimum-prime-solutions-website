import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, Mail, Download, Upload, Plus, UserCheck, UserX, Users as UsersIcon, Send, Loader, CheckCircle, AlertCircle, Megaphone } from 'lucide-react';
import { fbSubscribe, fbSet } from '../../firebase/config';
import ImportSubscribersDialog from './ImportSubscribersDialog';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKEND_URL = 'https://optimum-prime-lead-notifier.onrender.com';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Send Broadcast panel
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [bSubject, setBSubject] = useState('');
  const [bBody, setBBody] = useState('');
  const [bState, setBState] = useState<SendState>('idle');
  const [bMessage, setBMessage] = useState('');

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
    const name = newName.trim();
    const id = Date.now().toString();
    fbSet(`newsletter_subscribers/${id}`, {
      email,
      ...(name ? { name } : {}),
      status: 'active',
      subscribedAt: new Date().toISOString(),
    });
    setNewName('');
    setNewEmail('');
  };

  const sendBroadcast = async () => {
    const subject = bSubject.trim();
    const body = bBody.trim();
    if (!subject) { setBState('error'); setBMessage('Add a subject line'); return; }
    if (!body) { setBState('error'); setBMessage('Write the email body'); return; }
    if (!confirm(`Send this to all ${activeCount} active subscriber${activeCount === 1 ? '' : 's'}? This can't be undone.`)) return;

    setBState('sending');
    setBMessage('');
    try {
      const res = await fetch(`${BACKEND_URL}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      const result = await res.json();
      if (res.ok && result.success !== false) {
        setBState('sent');
        setBMessage(`Sent to ${result.sent ?? 0} of ${result.total_subscribers ?? 0} subscribers`);
        setBSubject('');
        setBBody('');
      } else {
        setBState('error');
        setBMessage(result.error || (result.errors && result.errors[0]) || 'Send failed');
      }
    } catch {
      setBState('error');
      setBMessage('Could not reach the notification service');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Subscribed At'];
    const rows = deduped.map(s => [s.name || '', s.email, s.status, s.subscribedAt]);
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
          <h2 className="text-xl font-bold text-slate-900">Newsletter Subscribers</h2>
          <p className="text-sm text-slate-500 mt-0.5">Everyone who gets "Notify Subscribers" blog emails via Resend</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBroadcast(v => !v)}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#C0392B' }}>
            <Megaphone className="h-4 w-4" /> Send Broadcast
          </button>
          <button onClick={exportCSV} disabled={deduped.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-40">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => setShowImport(true)}
            title="Add subscribers in bulk from a CSV file"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
        </div>
      </div>

      {/* Import dialog — bulk-add a mailing list, the reverse of Export CSV.
          The list itself refreshes on its own: the Firebase subscription picks
          up the new records as they are written. */}
      {showImport && (
        <ImportSubscribersDialog
          existing={deduped}
          onClose={() => setShowImport(false)}
          onImported={() => { setFilter('all'); setSearch(''); }}
        />
      )}

      {/* Send Broadcast panel */}
      {showBroadcast && (
        <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: '#C0392B4D', backgroundColor: '#C0392B0D' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Send a custom email to subscribers</p>
            <span className="text-xs text-slate-500">{activeCount} active recipient{activeCount === 1 ? '' : 's'}</span>
          </div>
          <input
            value={bSubject}
            onChange={e => { setBSubject(e.target.value); if (bState === 'error') setBState('idle'); }}
            placeholder="Subject line"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <textarea
            value={bBody}
            onChange={e => { setBBody(e.target.value); if (bState === 'error') setBState('idle'); }}
            placeholder="Write your message... Leave a blank line between paragraphs."
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent resize-y"
          />
          <div className="flex items-center gap-3">
            <button onClick={sendBroadcast} disabled={bState === 'sending' || activeCount === 0}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {bState === 'sending' ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {bState === 'sending' ? 'Sending...' : `Send to ${activeCount} subscriber${activeCount === 1 ? '' : 's'}`}
            </button>
            {bState === 'sent' && (
              <span className="flex items-center gap-1.5 text-xs text-green-700"><CheckCircle className="h-3.5 w-3.5" />{bMessage}</span>
            )}
            {bState === 'error' && (
              <span className="flex items-center gap-1.5 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" />{bMessage}</span>
            )}
          </div>
          {activeCount === 0 && (
            <p className="text-xs text-slate-500">No active subscribers to send to.</p>
          )}
        </div>
      )}

      {/* Add subscriber */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Add subscriber manually</p>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addSubscriber(); }}
            placeholder="Name (optional)"
            className="w-40 shrink-0 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <input
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setAddError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') addSubscriber(); }}
            placeholder="someone@company.com"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button onClick={addSubscriber}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition shrink-0">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {addError && <p className="mt-1.5 text-xs text-red-600">{addError}</p>}
        <p className="mt-1.5 text-xs text-slate-500">They won't get a welcome email — this just adds them to future blog-post broadcasts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center">
          <p className="text-xl font-bold text-slate-700">{deduped.length}</p>
          <p className="text-[10px] font-medium text-slate-700">Total</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-xl font-bold text-green-700">{activeCount}</p>
          <p className="text-[10px] font-medium text-green-700">Active</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center">
          <p className="text-xl font-bold text-slate-500">{unsubCount}</p>
          <p className="text-[10px] font-medium text-slate-500">Unsubscribed</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(['active', 'unsubscribed', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition ${filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {!loaded ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-500">Loading subscribers…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <UsersIcon className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {deduped.length === 0 ? 'No subscribers yet' : 'No subscribers match your search'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {deduped.length === 0
              ? 'Newsletter signups from the website will appear here.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${s.status === 'unsubscribed' ? 'bg-slate-100' : 'bg-green-100'}`}>
                <Mail className={`h-4 w-4 ${s.status === 'unsubscribed' ? 'text-slate-400' : 'text-green-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                {s.name
                  ? <>
                      <p className="text-sm font-medium text-slate-900 truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 truncate">{s.email}</p>
                    </>
                  : <p className="text-sm font-medium text-slate-900 truncate">{s.email}</p>
                }
                <p className="text-[10px] text-slate-400">{new Date(s.subscribedAt).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${
                s.status === 'unsubscribed' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
              }`}>
                {s.status === 'unsubscribed' ? 'Unsubscribed' : 'Active'}
              </span>
              <button onClick={() => toggleStatus(s)}
                title={s.status === 'unsubscribed' ? 'Reactivate' : 'Mark unsubscribed'}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 transition shrink-0">
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
