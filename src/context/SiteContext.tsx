import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { load, save, type SiteData, type Lead, defaultData } from '../data/siteData';
import { fbGet, fbSet, fbSubscribe } from '../firebase/config';
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

  useEffect(() => {
    let unsubscribeSite: (() => void) | null = null;
    let unsubscribeLeads: (() => void) | null = null;
    let latestSiteData: any = null;
    let latestRawLeads: Record<string, any> | null = null;

    const applyMerge = () => {
      if (!latestSiteData) return;
      const siteLeads: Lead[] = Array.isArray(latestSiteData.leads) ? latestSiteData.leads : [];
      const { leads, incomingIds } = ingestInbox(siteLeads, latestRawLeads);
      const merged = { ...defaultData, ...latestSiteData, leads };
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
          latestSiteData = merged;
          // Only clear the inbox AFTER the ingested leads are safely persisted,
          // so a failed write can never lose a lead.
          fbSet('siteData', merged).then(clearInbox).catch(() => {});
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
        const [fbData, rawLeads] = await Promise.all([
          fbGet('siteData'),
          isAdminRoute ? fbGet('leads') : Promise.resolve(null),
        ]);
        latestSiteData = fbData || {};
        latestRawLeads = rawLeads;

        if (fbData) {
          applyMerge();
        } else {
          const localData = load();
          await fbSet('siteData', localData);
          latestSiteData = localData;
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
        }
      } catch (error) {
        console.log('Firebase sync failed, using local storage');
        setSynced(true);
      }
    };

    syncData();

    return () => {
      if (unsubscribeSite) unsubscribeSite();
      if (unsubscribeLeads) unsubscribeLeads();
    };
  }, []);

  const update = useCallback((d: SiteData) => {
    setData(d);
    save(d);
    fbSet('siteData', d).catch(() => {});
    // Note: we deliberately no longer mirror leads back into the /leads inbox.
    // siteData.leads is the single source of truth; writing to /leads here used
    // to resurrect deleted leads and make the two stores drift apart.
  }, []);

  return <C.Provider value={{ data, update, synced }}>{children}</C.Provider>;
}

export function useSite() {
  const c = useContext(C);
  if (!c) throw new Error('wrap in SiteProvider');
  return c;
}
