'use client';

import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/use-toast';
import {updateUserPreferences} from '@/lib/api';
import {useUserStore} from '@/lib/stores/user-store';
import {BriefcaseBusiness, Users} from 'lucide-react';
import {useEffect} from 'react';

export function UserTypeSwitcher() {
  const {userType, setUserType, preferences, updatePreferences} = useUserStore();
  const {toast} = useToast();

  // Update local storage and Firebase when user type changes
  const handleUserTypeChange = async (type: 'jobSeeker' | 'freelancer') => {
    setUserType(type);
    updatePreferences({userType: type});

    try {
      await updateUserPreferences({userType: type});
    } catch (error) {
      // If Firebase update fails, just continue with local storage update
      console.error('Failed to update user preferences in Firebase', error);
    }

    toast({
      title: `Switched to ${type === 'jobSeeker' ? 'Job Seeker' : 'Freelancer'} mode`,
      description: `You are now tracking ${
        type === 'jobSeeker' ? 'job applications' : 'client projects'
      }.`,
    });
  };

  // Sync user type with preferences on mount
  useEffect(() => {
    if (preferences.userType !== userType) {
      setUserType(preferences.userType);
    }
  }, [preferences.userType, userType, setUserType]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userType === 'jobSeeker' ? 'default' : 'outline'}
        size="sm"
        className={userType === 'jobSeeker' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        onClick={() => handleUserTypeChange('jobSeeker')}>
        <BriefcaseBusiness className="mr-2 h-4 w-4" />
        Job Seeker
      </Button>
      <Button
        variant={userType === 'freelancer' ? 'default' : 'outline'}
        size="sm"
        className={userType === 'freelancer' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        onClick={() => handleUserTypeChange('freelancer')}>
        <Users className="mr-2 h-4 w-4" />
        Freelancer
      </Button>
    </div>
  );
}
