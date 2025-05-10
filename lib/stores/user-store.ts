import type {UserPreferences, UserType} from '@/lib/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface UserState {
  userType: UserType;
  setUserType: (type: UserType) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
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
        rememberUserType: false,
      },
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...prefs,
          },
          // Also update userType if it's included in the preferences update
          ...(prefs.userType ? {userType: prefs.userType} : {}),
        })),
      resetPreferences: () =>
        set({
          userType: 'jobSeeker',
          preferences: {
            userType: 'jobSeeker',
            theme: 'system',
            emailNotifications: true,
            rememberUserType: false,
          },
        }),
    }),
    {
      name: 'user-preferences',
    }
  )
);
