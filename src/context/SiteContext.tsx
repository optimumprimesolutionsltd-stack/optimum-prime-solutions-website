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

  // Merge leads from /leads (website form) and siteData.leads (admin bookings)
  // /leads uses Firebase push keys or timestamp IDs; siteData.leads uses timestamp IDs
  const mergeLeads = (siteleads: Lead[], rawLeads: Record<string, any> | null): Lead[] => {
    const existingIds = new Set(siteleads.map((l: Lead) => l.id));
    const websiteLeads: Lead[] = rawLeads
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
    return [...siteleads, ...websiteLeads];
  };

  useEffect(() => {
    let unsubscribeSite: (() => void) | null = null;
    let unsubscribeLeads: (() => void) | null = null;
    let latestSiteData: any = null;
    let latestRawLeads: Record<string, any> | null = null;

    const applyMerge = () => {
      if (!latestSiteData) return;
      const siteLeads: Lead[] = Array.isArray(latestSiteData.leads) ? latestSiteData.leads : [];
      const merged = { ...defaultData, ...latestSiteData, leads: mergeLeads(siteLeads, latestRawLeads) };
      setData(merged);
      save(merged);
    };

    const syncData = async () => {
      try {
        const [fbData, rawLeads] = await Promise.all([
          fbGet('siteData'),
          fbGet('leads'),
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

        // Subscribe to /leads changes (new website submissions)
        unsubscribeLeads = fbSubscribe('leads', (rawLeads) => {
          latestRawLeads = rawLeads;
          applyMerge();
        });
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
    // Also sync status/schedule changes back to individual /leads entries
    // so the source node stays up to date
    d.leads.forEach((lead: Lead) => {
      if (lead.status && lead.status !== 'New') {
        fbSet(`leads/${lead.id}`, {
          name: lead.name,
          company: lead.company,
          phone: lead.phone,
          email: lead.email,
          businessType: lead.businessType,
          demoDate: lead.demoDate,
          demoTime: lead.demoTime,
          currentSoftware: lead.currentSoftware,
          message: lead.message,
          createdAt: lead.createdAt,
          status: lead.status,
          source: lead.source || 'website',
          scheduledDate: lead.scheduledDate,
          scheduledTime: lead.scheduledTime,
          demoType: lead.demoType,
          demoLocation: lead.demoLocation,
          teamMemberName: lead.teamMemberName,
          meetSent: lead.meetSent,
        }).catch(() => {});
      }
    });
  }, []);

  return <C.Provider value={{ data, update, synced }}>{children}</C.Provider>;
}

export function useSite() {
  const c = useContext(C);
  if (!c) throw new Error('wrap in SiteProvider');
  return c;
}
