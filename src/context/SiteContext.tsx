import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { load, save, type SiteData, type Lead, type WipJob, type Client, defaultData } from '../data/siteData';
import { fbGet, fbSet, fbSubscribe, fbOnAuthStateChanged } from '../firebase/config';
import { signInAnonymously, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// New Firebase project: optimum-prime-website (migrated July 2026)
const firebaseConfig = {
  apiKey: "AIzaSyAY8O5LRWxcJgkYhNn1SstAylc-q959vv0",
  authDomain: "optimum-prime-website.firebaseapp.com",
  databaseURL: "https://optimum-prime-website-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "optimum-prime-website",
  storageBucket: "optimum-prime-website.firebasestorage.app",
  messagingSenderId: "784083256897",
  appId: "1:784083256897:web:3edc73fa438f5faa2f68c0",
  measurementId: "G-H1Y0KTGKG6"
};

try {
  initializeApp(firebaseConfig);
  const auth = getAuth();
  signInAnonymously(auth).catch(() => {});
} catch (e) {
  console.log('Firebase not configured yet');
}

interface Ctx { data: SiteData; update: (d: SiteData) => void; synced: boolean }
const C = createContext<Ctx | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => load());
  const [synced, setSynced] = useState(false);
  // Whether /crm/leads has ever been read successfully in this session. Saves
  // write the WHOLE leads array, so until we know we can read the node we can't
  // tell an empty CRM from one we simply weren't allowed to see — and writing
  // the empty in-memory list would destroy every lead. See `update` below.
  const crmReadable = useRef(false);

  // siteData.leads is the single source of truth for leads. The public contact
  // form drops NEW leads into the /leads "inbox" node (it can't safely write the
  // whole siteData). The admin ingests those, then clears them from /leads.
  // This returns the combined list plus the ids that were newly ingested, so the
  // caller can move them into siteData.leads and drain the inbox.
  const ingestInbox = (
    siteleads: Lead[],
    rawLeads: Record<string, any> | null,
  ): { leads: Lead[]; incomingIds: string[] } => {
    const existingIds = new Set(siteleads.map((l: Lead) => l.id));
    const incoming: Lead[] = rawLeads
      ? Object.entries(rawLeads)
          .filter(([id]) => !existingIds.has(id))
          .map(([id, v]: [string, any]) => ({
            id,
            name: v.name || 'Unknown',
            company: v.company || '',
            phone: v.phone || '',
            email: v.email || '',
            businessType: v.businessType || '',
            demoDate: v.demoDate || '',
            demoTime: v.demoTime || '',
            currentSoftware: v.currentSoftware || '',
            message: v.message || '',
            createdAt: v.createdAt || v.timestamp || new Date().toISOString(),
            status: v.status || 'New',
            source: v.source === 'Zawadi Chatbot Handoff' ? 'website' : (v.source || 'website'),
            industry: v.industry || v.businessType || '',
          } as Lead))
      : [];
    return { leads: [...incoming, ...siteleads], incomingIds: incoming.map(l => l.id) };
  };

  // Firebase rejects `undefined` anywhere in the payload and fbSet swallows the
  // error, so a single stray undefined would silently drop the whole save —
  // the change would look applied locally and be gone on the next reload.
  // Strip them before writing.
  const stripUndefined = (value: any): any => {
    if (Array.isArray(value)) return value.map(stripUndefined);
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      const out: Record<string, any> = {};
      Object.entries(value).forEach(([k, v]) => {
        if (v !== undefined) out[k] = stripUndefined(v);
      });
      return out;
    }
    return value;
  };

  useEffect(() => {
    let unsubscribeSite: (() => void) | null = null;
    let unsubscribeLeads: (() => void) | null = null;
    let unsubscribeCrm: (() => void) | null = null;
    let unsubscribeJobs: (() => void) | null = null;
    let unsubscribeClients: (() => void) | null = null;
    let latestSiteData: any = null;
    let latestRawLeads: Record<string, any> | null = null;
    let latestCrmLeads: Lead[] | null = null;
    // Delivery jobs and the won-customer register live under /crm too. They
    // were being written there and never read back, so every save round-tripped
    // them into nothing: a job created by "Start work" survived only until the
    // next /siteData snapshot arrived, which is why the hand-off to Work in
    // Progress opened an empty tab.
    let latestCrmJobs: WipJob[] | null = null;
    let latestCrmClients: Client[] | null = null;

    const applyMerge = () => {
      if (!latestSiteData) return;
      // Leads now live in /crm/leads. latestSiteData.leads is only consulted as
      // a fallback for data written before the split, and disappears from
      // /siteData on the first admin save.
      const storedLeads: Lead[] = Array.isArray(latestCrmLeads)
        ? latestCrmLeads
        : Array.isArray(latestSiteData.leads)
          ? latestSiteData.leads
          : [];
      const { leads, incomingIds } = ingestInbox(storedLeads, latestRawLeads);
      // Same fallback shape as leads: read /crm first, and only fall back to
      // whatever an older build left in /siteData. Customer records used to be
      // written to the public node — see `update` — so the fallback is also the
      // migration path for the ones already sitting there.
      const storedJobs: WipJob[] = Array.isArray(latestCrmJobs)
        ? latestCrmJobs
        : Array.isArray(latestSiteData.wipJobs)
          ? latestSiteData.wipJobs
          : [];
      const storedClients: Client[] = Array.isArray(latestCrmClients)
        ? latestCrmClients
        : Array.isArray(latestSiteData.clients)
          ? latestSiteData.clients
          : [];
      const merged = {
        ...defaultData, ...latestSiteData,
        leads, wipJobs: storedJobs, clients: storedClients,
      };
      setData(merged);
      save(merged);
      // Drain the inbox: every inbox lead is now represented in siteData.leads
      // (the single source of truth) — either ingested just now or already
      // present — so clear the whole /leads inbox once it is safe. This means a
      // lead can never be merged twice or resurrected after it is deleted.
      // Admin-only: public pages never write siteData and don't read /leads.
      if (isAdminRoute && latestRawLeads && Object.keys(latestRawLeads).length > 0) {
        const inboxIds = Object.keys(latestRawLeads);
        const clearInbox = () => inboxIds.forEach(id => fbSet(`leads/${id}`, null).catch(() => {}));
        if (incomingIds.length > 0) {
          latestCrmLeads = leads;
          // Only clear the inbox AFTER the ingested leads are safely persisted,
          // so a failed write can never lose a lead.
          fbSet('crm/leads', stripUndefined(leads)).then(clearInbox).catch(() => {});
        } else {
          // Inbox holds only duplicates already in siteData.leads — safe to clear.
          clearInbox();
        }
      }
    };

    // /leads holds every customer's name, phone, email and message — only the
    // authenticated admin panel needs it. Public pages only ever write a new
    // lead (see Contact.tsx); they never read the list.
    const isAdminRoute = window.location.pathname.startsWith('/admin');

    const syncData = async () => {
      try {
        const [fbData, rawLeads, crmLeads, crmJobs, crmClients] = await Promise.all([
          fbGet('siteData'),
          isAdminRoute ? fbGet('leads') : Promise.resolve(null),
          isAdminRoute ? fbGet('crm/leads') : Promise.resolve(null),
          isAdminRoute ? fbGet('crm/wipJobs') : Promise.resolve(null),
          isAdminRoute ? fbGet('crm/clients') : Promise.resolve(null),
        ]);
        latestSiteData = fbData || {};
        latestRawLeads = rawLeads;
        latestCrmLeads = Array.isArray(crmLeads) ? crmLeads : null;
        latestCrmJobs = Array.isArray(crmJobs) ? crmJobs : null;
        latestCrmClients = Array.isArray(crmClients) ? crmClients : null;

        if (fbData) {
          applyMerge();
        } else {
          const localData = load();
          const { leads: _seedLeads, wipJobs: _seedJobs, clients: _seedClients, ...seedContent } = localData;
          await fbSet('siteData', stripUndefined(seedContent));
          latestSiteData = seedContent;
          applyMerge();
        }
        setSynced(true);

        // Subscribe to siteData changes (admin saves)
        unsubscribeSite = fbSubscribe('siteData', (fbData) => {
          if (fbData) {
            latestSiteData = fbData;
            applyMerge();
          }
        });

        // Subscribe to /leads changes (new website submissions) — admin only
        if (isAdminRoute) {
          unsubscribeLeads = fbSubscribe('leads', (rawLeads) => {
            latestRawLeads = rawLeads;
            applyMerge();
          });
          unsubscribeJobs = fbSubscribe('crm/wipJobs', (crmJobs) => {
            latestCrmJobs = Array.isArray(crmJobs) ? crmJobs : null;
            applyMerge();
          });
          unsubscribeClients = fbSubscribe('crm/clients', (crmClients) => {
            latestCrmClients = Array.isArray(crmClients) ? crmClients : null;
            applyMerge();
          });
          unsubscribeCrm = fbSubscribe('crm/leads', (crmLeads) => {
            // Only fires when the read is actually permitted, so it's the one
            // trustworthy signal that the CRM node is readable — fbGet returns
            // null for "denied" and "empty" alike and can't tell them apart.
            crmReadable.current = true;
            latestCrmLeads = Array.isArray(crmLeads) ? crmLeads : null;
            applyMerge();
          });
        }
      } catch (error) {
        console.log('Firebase sync failed, using local storage');
        setSynced(true);
      }
    };

    const teardown = () => {
      if (unsubscribeSite) { unsubscribeSite(); unsubscribeSite = null; }
      if (unsubscribeLeads) { unsubscribeLeads(); unsubscribeLeads = null; }
      if (unsubscribeCrm) { unsubscribeCrm(); unsubscribeCrm = null; }
      if (unsubscribeJobs) { unsubscribeJobs(); unsubscribeJobs = null; }
      if (unsubscribeClients) { unsubscribeClients(); unsubscribeClients = null; }
    };

    // Sync is driven by auth, not by mount. Two things happen after this
    // provider first renders: Firebase restores a persisted session from
    // IndexedDB asynchronously, and — on /admin — the user signs in a while
    // later, which is a client-side route change, not a remount.
    //
    // Syncing once on mount therefore read /crm and /leads while still
    // unauthenticated. The rules correctly rejected it, onValue cancelled the
    // cancelled listeners for good, and the panel sat on an empty list until
    // the operator pressed refresh — which is exactly the "starts at zero,
    // shows the figures after a reload" behaviour. Re-syncing whenever the
    // signed-in account changes makes the data appear on login instead.
    let currentUid: string | null | undefined;
    let started = false;
    const unsubscribeAuth = fbOnAuthStateChanged((user) => {
      const uid = user?.uid ?? null;
      if (started && uid === currentUid) return; // same account — nothing to redo
      currentUid = uid;
      started = true;
      teardown();
      syncData();
    });

    return () => {
      unsubscribeAuth();
      teardown();
    };
  }, []);

  const update = useCallback((d: SiteData) => {
    setData(d);
    save(d);
    // Split the write. /siteData is world-readable (the whole public site
    // renders from it) so customer data must never land there — leads and WIP
    // jobs go to /crm, which is gated on the admin claim. See
    // database.rules.json: RTDB cannot revoke read on a child once the parent
    // is readable, so separating the nodes is the only way to make the public
    // read rule safe.
    // `clients` is customer data — company, contact, phone, email, and the
    // licence serial — so it belongs with the leads under /crm, not in the
    // world-readable /siteData the public site renders from.
    const { leads, wipJobs, clients, ...content } = d;
    fbSet('siteData', stripUndefined(content)).catch(() => {});

    // These writes replace the WHOLE array rather than a delta, so saving while
    // the CRM was never readable would replace every lead with the empty list
    // this session happens to be holding. Refuse that specific case: no
    // successful read, and nothing to write. Any real edit — which necessarily
    // has leads in it — still saves normally.
    if (crmReadable.current || (leads && leads.length > 0)) {
      fbSet('crm/leads', stripUndefined(leads || [])).catch(() => {});
      // Same whole-array replacement, so the same care: only write these when
      // there is something to write, or when the CRM was genuinely read this
      // session. A save driven purely by a leads edit must not blank the
      // delivery board or the customer register.
      if (wipJobs && (crmReadable.current || wipJobs.length > 0)) {
        fbSet('crm/wipJobs', stripUndefined(wipJobs)).catch(() => {});
      }
      if (clients && (crmReadable.current || clients.length > 0)) {
        fbSet('crm/clients', stripUndefined(clients)).catch(() => {});
      }
    } else {
      console.warn(
        '[SiteContext] Skipped writing crm/leads: the CRM was never read successfully ' +
        'this session, so the empty in-memory list is not trustworthy. Reload once ' +
        'the leads are visible, then save again.',
      );
    }
    // Note: we deliberately no longer mirror leads back into the /leads inbox.
    // /crm/leads is the single source of truth; writing to /leads here used
    // to resurrect deleted leads and make the two stores drift apart.
  }, []);

  return <C.Provider value={{ data, update, synced }}>{children}</C.Provider>;
}

export function useSite() {
  const c = useContext(C);
  if (!c) throw new Error('wrap in SiteProvider');
  return c;
}
