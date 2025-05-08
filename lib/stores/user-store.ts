import type {UserPreferences, UserType} from '@/lib/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface UserState {
  userType: UserType;
  setUserType: (type: UserType) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userType: 'jobSeeker',
      setUserType: (type) => set({userType: type}),
      preferences: {
        userType: 'jobSeeker',
        theme: 'system',
        emailNotifications: true,
      },
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...prefs,
          },
        })),
    }),
    {
      name: 'user-preferences',
    }
  )
);
