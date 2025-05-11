import {updateNotificationPreferences, updateUserPreferences} from '@/lib/api';
import type {NotificationPreferences, UserPreferences, UserType} from '@/lib/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface UserState {
  userType: UserType;
  setUserType: (type: UserType) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateNotifications: (notifications: NotificationPreferences) => Promise<boolean>;
  resetPreferences: () => void;
}

const defaultNotifications: NotificationPreferences = {
  emailNotifications: true,
  weeklyDigest: true,
  applicationReminders: true,
  deadlineReminders: true,
  clientUpdates: true,
  paymentReminders: true,
  interviewReminders: true,
  offerDeadlineReminders: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userType: 'jobSeeker',
      setUserType: (type) => set({userType: type}),
      preferences: {
        userType: 'jobSeeker',
        theme: 'system',
        rememberUserType: false,
        notifications: defaultNotifications,
      },
      updatePreferences: (prefs) => {
        set((state) => {
          const newPreferences = {
            ...state.preferences,
            ...prefs,
          };

          // Update in Firebase if possible
          try {
            updateUserPreferences(newPreferences);
          } catch (error) {
            console.error('Failed to update preferences in Firebase:', error);
          }

          return {
            preferences: newPreferences,
            // Also update userType if it's included in the preferences update
            ...(prefs.userType ? {userType: prefs.userType} : {}),
          };
        });
      },
      updateNotifications: async (notifications: NotificationPreferences) => {
        try {
          // Update local state
          set((state) => ({
            preferences: {
              ...state.preferences,
              notifications,
            },
          }));

          // Save to Firebase database using the specific function
          await updateNotificationPreferences(notifications);

          return true;
        } catch (error) {
          console.error('Failed to update notification preferences:', error);
          return false;
        }
      },
      resetPreferences: () =>
        set({
          userType: 'jobSeeker',
          preferences: {
            userType: 'jobSeeker',
            theme: 'system',
            rememberUserType: false,
            notifications: defaultNotifications,
          },
        }),
    }),
    {
      name: 'user-preferences',
    }
  )
);
