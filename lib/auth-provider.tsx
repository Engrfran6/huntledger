'use client';

import type React from 'react';

import {GithubAuthProvider, GoogleAuthProvider, type User, signInWithPopup} from 'firebase/auth';
import {createContext} from 'react';

import {auth, db} from '@/lib/firebase';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {useAuthState} from './auth-hooks';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuthState();

  return <AuthContext.Provider value={{user, loading}}>{children}</AuthContext.Provider>;
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Check if user document exists first to avoid overwriting
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: 'google',
        createdAt: new Date(),
        lastLogin: new Date(),
        userId: auth.currentUser!.uid,
      });
    } else {
      // Update last login time
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date(),
      });
    }

    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);

    const userDoc = await getDoc(doc(db, 'users', result.user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: 'github',
        createdAt: new Date(),
        lastLogin: new Date(),
        userId: auth.currentUser!.uid,
      });
    } else {
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date(),
      });
    }

    return result.user;
  } catch (error) {
    console.error('GitHub sign-in error:', error);
    throw error;
  }
};
