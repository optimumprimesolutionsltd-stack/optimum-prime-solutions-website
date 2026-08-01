import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

let database: ReturnType<typeof getDatabase> | null = null;
let auth: Auth | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.log('Firebase initialization deferred - config needed');
}

export const fbRef = (path: string) => {
  if (!database) throw new Error('Firebase not initialized');
  return ref(database, path);
};

export const fbAuth = () => {
  if (!auth) throw new Error('Firebase auth not initialized');
  return auth;
};

export type FbUser = User;

export const fbLogin = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase auth not initialized');
  return signInWithEmailAndPassword(auth, email, password);
};

export const fbLogout = async () => {
  if (!auth) throw new Error('Firebase auth not initialized');
  return signOut(auth);
};

export const fbOnAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const fbGet = async (path: string) => {
  try {
    if (!database) return null;
    const snapshot = await get(fbRef(path));
    return snapshot.val();
  } catch (error) {
    console.error('Firebase get error:', error);
    return null;
  }
};

export const fbSet = async (path: string, data: any): Promise<boolean> => {
  try {
    if (!database) return false;
    await set(fbRef(path), data);
    console.log('Firebase data saved:', path);
    return true;
  } catch (error) {
    console.error('Firebase set error:', error);
    return false;
  }
};

export const fbSubscribe = (path: string, callback: (data: any) => void) => {
  try {
    if (!database) return () => {};
    const dataRef = fbRef(path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      callback(snapshot.val());
    });
    return unsubscribe;
  } catch (error) {
    console.error('Firebase subscribe error:', error);
    return () => {};
  }
};

export const getDb = () => {
  if (!db) throw new Error('Firestore not initialized');
  return db;
};

// For direct Firestore access
export { db };
