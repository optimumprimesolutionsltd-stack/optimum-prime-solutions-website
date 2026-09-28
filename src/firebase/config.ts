import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Database } from 'firebase/database';

// ── Why Firebase is loaded on demand ────────────────────────────────────────
// The SDK is the single biggest thing this site ships: ~467KB raw, ~142KB
// gzipped, about 42% of the JavaScript on every public page. This file used to
// call initializeApp() at module scope, so anything importing it — the footer's
// workshop banner and the site-data context, both on every page — dragged the
// whole SDK into the entry chunk, and index.html modulepreloaded it at top
// priority. A visitor reading a blog post on a phone downloaded, parsed and
// executed the entire SDK, then signed in anonymously, before the page settled.
//
// None of that is needed to paint. The site is prerendered, so the HTML already
// carries its content; Firebase only matters for live updates, form writes and
// the admin panel, all of which can wait until after first paint.
//
// So the SDK sits behind a dynamic import() and every export below keeps the
// signature it had. The two that used to return synchronously — fbSubscribe and
// fbOnAuthStateChanged — still hand back an unsubscribe function immediately; it
// wires itself up once the SDK lands, and cancels a load still in flight.
//
// Firestore is deliberately not loaded here. Only the admin access-request flow
// uses it, so it lives in accessRequests.ts and stays off the public path.

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

interface Fb {
  app: FirebaseApp | null;
  database: Database | null;
  auth: Auth | null;
  dbMod: typeof import('firebase/database') | null;
  authMod: typeof import('firebase/auth') | null;
}

const EMPTY: Fb = { app: null, database: null, auth: null, dbMod: null, authMod: null };

let loading: Promise<Fb> | null = null;
// A synchronous peek at the loaded SDK, for the admin call sites that read the
// current user during render and so cannot await.
let loaded: Fb | null = null;

// Loads the SDK once and starts the visitor's auth session. Safe to call from
// anywhere, as often as you like — the work happens on the first call only.
export const fbReady = (): Promise<Fb> => {
  if (!loading) {
    loading = (async (): Promise<Fb> => {
      try {
        const [appMod, dbMod, authMod] = await Promise.all([
          import('firebase/app'),
          import('firebase/database'),
          import('firebase/auth'),
        ]);

        const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
        const auth = authMod.getAuth(app);

        // The RTDB rules require auth != null for the contact-form inbox and the
        // chatbot history, so ordinary visitors need an anonymous session. But
        // this must not call signInAnonymously() unconditionally: currentUser is
        // null synchronously here even when a signed-in admin's session is about
        // to be restored from persistence. The anonymous user then replaced the
        // admin, App.tsx gates /admin on !isAnonymous, and the panel logged
        // itself out mid-session — taking any unsaved editor changes with it.
        //
        // Waiting for onAuthStateChanged means the decision is made with the real
        // answer in hand. The listener is deliberately left subscribed rather than
        // unsubscribed after the first emission, so signing out of /admin drops
        // the visitor back to an anonymous session instead of no session at all.
        authMod.onAuthStateChanged(auth, (user) => {
          if (!user) authMod.signInAnonymously(auth).catch(() => {});
        });

        loaded = { app, database: dbMod.getDatabase(app), auth, dbMod, authMod };
        return loaded;
      } catch (error) {
        console.error('Firebase failed to load:', error);
        loaded = EMPTY;
        return EMPTY;
      }
    })();
  }
  return loading;
};

// The initialised app, for the Firestore code that brings its own SDK import.
export const fbApp = async (): Promise<FirebaseApp | null> => (await fbReady()).app;

export type FbUser = User;

export const fbAuth = () => {
  if (!loaded?.auth) throw new Error('Firebase auth not initialized');
  return loaded.auth;
};

// The signed-in email without waiting, for admin components that need it during
// render. Empty until the SDK has loaded, which is the same answer those call
// sites already had to handle for a visitor who is not signed in.
export const fbCurrentUserEmail = (): string => loaded?.auth?.currentUser?.email || '';

export const fbLogin = async (email: string, password: string) => {
  const { auth, authMod } = await fbReady();
  if (!auth || !authMod) throw new Error('Firebase auth not initialized');
  return authMod.signInWithEmailAndPassword(auth, email, password);
};

export const fbLogout = async () => {
  const { auth, authMod } = await fbReady();
  if (!auth || !authMod) throw new Error('Firebase auth not initialized');
  return authMod.signOut(auth);
};

export const fbOnAuthStateChanged = (callback: (user: User | null) => void) => {
  let stop: (() => void) | null = null;
  let cancelled = false;
  fbReady().then(({ auth, authMod }) => {
    if (cancelled || !auth || !authMod) return;
    stop = authMod.onAuthStateChanged(auth, callback);
  });
  return () => { cancelled = true; stop?.(); stop = null; };
};

export const fbGet = async (path: string) => {
  try {
    const { database, dbMod } = await fbReady();
    if (!database || !dbMod) return null;
    const snapshot = await dbMod.get(dbMod.ref(database, path));
    return snapshot.val();
  } catch (error) {
    console.error('Firebase get error:', error);
    return null;
  }
};

export const fbSet = async (path: string, data: any): Promise<boolean> => {
  try {
    const { database, dbMod } = await fbReady();
    if (!database || !dbMod) return false;
    await dbMod.set(dbMod.ref(database, path), data);
    console.log('Firebase data saved:', path);
    return true;
  } catch (error) {
    console.error('Firebase set error:', error);
    return false;
  }
};

export const fbSubscribe = (
  path: string,
  callback: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  let stop: (() => void) | null = null;
  let cancelled = false;

  fbReady().then(({ database, dbMod }) => {
    if (cancelled || !database || !dbMod) return;
    // Without an error callback a rules rejection is silent: onValue simply
    // never fires, so a caller gated on the first payload waits on "Loading…"
    // forever instead of reporting that it lacks permission.
    stop = dbMod.onValue(
      dbMod.ref(database, path),
      (snapshot) => {
        callback(snapshot.val());
      },
      (error) => {
        console.error('Firebase subscribe error on ' + path + ':', error);
        onError?.(error);
      },
    );
  }).catch((error) => {
    console.error('Firebase subscribe error:', error);
  });

  return () => { cancelled = true; stop?.(); stop = null; };
};

export const fbHasAdminClaim = async (user: User | null, forceRefresh = false): Promise<boolean> => {
  if (!user || user.isAnonymous) return false;
  try {
    const tokenResult = await user.getIdTokenResult(forceRefresh);
    return tokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error checking admin claim:', error);
    return false;
  }
};
