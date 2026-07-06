import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { load, save, type SiteData, defaultData } from '../data/siteData';
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

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const syncData = async () => {
      try {
        const fbData = await fbGet('siteData');
        if (fbData) {
          const merged = { ...defaultData, ...fbData, leads: fbData.leads || [] };
          setData(merged);
          save(merged);
        } else {
          const localData = load();
          await fbSet('siteData', localData);
        }
        setSynced(true);

        unsubscribe = fbSubscribe('siteData', (fbData) => {
          if (fbData) {
            const merged = { ...defaultData, ...fbData, leads: fbData.leads || [] };
            setData(merged);
            save(merged);
          }
        });
      } catch (error) {
        console.log('Firebase sync failed, using local storage');
        setSynced(true);
      }
    };

    syncData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const update = useCallback((d: SiteData) => {
    setData(d);
    save(d);
    fbSet('siteData', d).catch(() => {});
  }, []);

  return <C.Provider value={{ data, update, synced }}>{children}</C.Provider>;
}

export function useSite() {
  const c = useContext(C);
  if (!c) throw new Error('wrap in SiteProvider');
  return c;
}
