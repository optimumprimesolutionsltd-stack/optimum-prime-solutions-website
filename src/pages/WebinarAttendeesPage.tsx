import { useEffect, useState } from 'react';
import { Users, Mail, Phone, Building2, Lock } from 'lucide-react';
import { fbSubscribe } from '../firebase/config';
import SEO from '../components/SEO';

const PASSCODE = 'Karibu2026';
const STORAGE_KEY = 'webinar_attendees_access';

interface Registrant {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function WebinarAttendeesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === PASSCODE) setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    const unsubscribe = fbSubscribe('webinar_registrants', (raw: Record<string, any> | null) => {
      const list = raw
        ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Registrant)
        : [];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRegistrants(list);
      setLoaded(true);
    });
    return unsubscribe;
  }, [unlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, PASSCODE);
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect passcode. Please check with Optimum Prime Solutions.');
    }
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <SEO title="Webinar Attendees | Optimum Prime" description="" canonical="/webinar-attendees" noIndex />
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-teal-400 mb-4" />
          <h1 className="text-lg font-bold text-white mb-1">Webinar Attendees</h1>
          <p className="text-slate-400 text-sm mb-6">Enter the passcode shared with you to view the live registrant list.</p>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Passcode"
              autoFocus
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm text-center placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
            >
              View List
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-12">
      <SEO title="Webinar Attendees | Optimum Prime" description="" canonical="/webinar-attendees" noIndex />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-6 w-6 text-teal-400" />
          <h1 className="text-xl font-bold text-white">Inventory Management Webinar — Attendees</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Live list — updates automatically as people register. {loaded && <span className="text-teal-400 font-semibold">{registrants.length} registered</span>}
        </p>

        {!loaded ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : registrants.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm">No registrations yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {registrants.map((r) => (
              <div key={r.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{r.name}</p>
                  <span className="text-xs text-slate-500 shrink-0">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span>
                  {r.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</span>}
                  {r.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{r.company}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
