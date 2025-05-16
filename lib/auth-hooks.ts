'use client';

import {auth} from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
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
  const {updatePreferences, preferences} = useUserStore();

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const success = await signInWithEmailAndPassword(auth, email, password);

      if (success) {
        // Fetch user preferences from database
        const userPrefs = await fetchUserPreferences();

        // Update local preferences with database values
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
  const {updatePreferences, preferences} = useUserStore();

  const signUp = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const success = await createUserWithEmailAndPassword(auth, email, password);

      if (success) {
        // Fetch user preferences from database
        const userPrefs = await fetchUserPreferences();

        // Update local preferences with database values
        if (userPrefs) {
          updatePreferences(userPrefs);
        }

        router.push('/choose-mode');
      }

      return true;
    } catch (err: any) {
      setError(err.message);
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
