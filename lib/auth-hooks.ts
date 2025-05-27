'use client';

import {auth, db} from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {fetchUserPreferences} from './api';
import {useUserStore} from './stores/user-store';

export function useAuthState() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {user, loading};
}

export function useSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {updatePreferences} = useUserStore();

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const success = await signInWithEmailAndPassword(auth, email, password);

      if (success) {
        const userPrefs = await fetchUserPreferences();

        if (userPrefs) {
          updatePreferences(userPrefs);
        }

        router.push('/choose-mode');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Sign in error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reauthenticate = async (email: string, password: string) => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  return {signIn, reauthenticate, error, loading};
}

export function useSignUp() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {updatePreferences} = useUserStore();

  const signUp = async (email: string, password: string, userData = {}) => {
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        provider: 'email',
        createdAt: new Date(),
        lastLogin: new Date(),
        userId: auth.currentUser!.uid,
        ...userData,
      });

      // Fetch preferences after account creation
      const userPrefs = await fetchUserPreferences();
      if (userPrefs) {
        updatePreferences(userPrefs);
      }

      router.push('/choose-mode');
      return true;
    } catch (err: any) {
      let errorMessage = err.message;

      // More user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }

      setError(errorMessage);
      console.error('Sign up error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {signUp, error, loading};
}

export function useSignOut() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setError(null);
    setLoading(true);

    try {
      await signOut(auth);

      router.push('/auth/signin');

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Sign out error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {logout, error, loading};
}
