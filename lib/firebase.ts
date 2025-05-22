import {initializeApp} from 'firebase/app';
import {browserSessionPersistence, getAuth, setPersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'job-tracker.firebaseapp.com', // Hardcoded trusted domain
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize with security settings
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Critical security settings
auth.useDeviceLanguage();
setPersistence(auth, browserSessionPersistence);

const db = getFirestore(app);

export {app, auth, db};
