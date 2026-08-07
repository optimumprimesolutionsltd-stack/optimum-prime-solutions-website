import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, Building2, Lock, ShieldAlert } from 'lucide-react';
import { fbSubscribe, fbOnAuthStateChanged, type FbUser } from '../firebase/config';
import SEO from '../components/SEO';

interface Registrant {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function WorkshopAttendeesPage() {
  const [user, setUser] = useState<FbUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [denied, setDenied] = useState(false);

  // This list holds attendees' names, phone numbers and email addresses, so
  // reading it needs a signed-in staff account — see database.rules.json.
  // This page used to gate on a passcode compared in the browser, which was
  // never protection: the constant shipped in the JS bundle and the read
  // behind it was unauthenticated. Note that SiteContext signs every visitor
  // in anonymously, so "has an auth user" is not access — the anonymous ones
  // have to be filtered out here, and the rules reject them regardless.
  useEffect(
    () =>
      fbOnAuthStateChanged((u) => {
        setUser(u && !u.isAnonymous ? u : null);
        setAuthReady(true);
      }),
    [],
  );

  useEffect(() => {
    if (!user) return;
    setDenied(false);
    return fbSubscribe(
      'workshop_registrants',
      (raw: Record<string, any> | null) => {
        const list = raw
          ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) }) as Registrant)
          : [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRegistrants(list);
        setLoaded(true);
      },
      () => {
        // Signed in, but not as one of the accounts the rules allow.
        setDenied(true);
        setLoaded(true);
      },
    );
  }, [user]);

  if (!authReady) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <SEO title="Workshop Attendees | Optimum Prime" description="" canonical="/workshop-attendees" noIndex />
        <p className="text-slate-500 text-sm">Checking access…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <SEO title="Workshop Attendees | Optimum Prime" description="" canonical="/workshop-attendees" noIndex />
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-teal-400 mb-4" />
          <h1 className="text-lg font-bold text-white mb-1">Workshop Attendees</h1>
          <p className="text-slate-400 text-sm mb-6">
            This list contains attendees' personal contact details, so it is only visible to signed-in
            Optimum Prime staff. The shared passcode no longer applies.
          </p>
          <Link
            to="/admin"
            className="block w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
          >
            Sign in to view
          </Link>
        </div>
      </main>
    );
  }

  if (denied) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <SEO title="Workshop Attendees | Optimum Prime" description="" canonical="/workshop-attendees" noIndex />
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-amber-400 mb-4" />
          <h1 className="text-lg font-bold text-white mb-1">No access to this list</h1>
          <p className="text-slate-400 text-sm">
            You are signed in as {user.email || 'this account'}, which is not authorised to view workshop
            registrants. Ask an administrator to grant your account access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-12">
      <SEO title="Workshop Attendees | Optimum Prime" description="" canonical="/workshop-attendees" noIndex />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-6 w-6 text-teal-400" />
          <h1 className="text-xl font-bold text-white">Inventory Management Workshop — Attendees</h1>
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
