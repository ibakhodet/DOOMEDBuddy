import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

// Player email allow-list: email -> player name
export const PLAYERS: Record<string, string> = {
  'marteri9@gmail.com': 'MARTIN',
  'sigvelangfeldt@outlook.com': 'SIGVE',
  // Tord's email will be added here
  'tord@placeholder.com': 'TORD',
};

// Admin emails: can view/edit all warbands
export const ADMINS: string[] = ['marteri9@gmail.com'];

export const ALL_PLAYER_NAMES = ['MARTIN', 'SIGVE', 'TORD'] as const;
