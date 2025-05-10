'use client';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {updateUserPreferences} from '@/lib/api';
import {useUserStore} from '@/lib/stores/user-store';
import {Briefcase, FileSearch, Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export function UserTypeSwitcher() {
  const {userType, setUserType, preferences, updatePreferences} = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUserTypeChange = async (type: 'jobSeeker' | 'freelancer') => {
    if (type === userType) return;

    setIsLoading(true);
    try {
      // Update local state
      setUserType(type);

      // Update preferences
      updatePreferences({
        userType: type,
      });

      // Update in database if remember preference is enabled
      if (preferences.rememberUserType) {
        await updateUserPreferences({
          userType: type,
        });
      }

      // Redirect to dashboard to ensure proper context
      router.push('/dashboard');
    } catch (error) {
      console.error('Error changing user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : userType === 'jobSeeker' ? (
            <FileSearch className="h-4 w-4" />
          ) : (
            <Briefcase className="h-4 w-4" />
          )}
          {userType === 'jobSeeker' ? 'Job Seeker' : 'Freelancer'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2"
          onClick={() => handleUserTypeChange('jobSeeker')}
          disabled={userType === 'jobSeeker' || isLoading}>
          <FileSearch className="h-4 w-4" />
          <span>Switch to Job Seeker</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => handleUserTypeChange('freelancer')}
          disabled={userType === 'freelancer' || isLoading}>
          <Briefcase className="h-4 w-4" />
          <span>Switch to Freelancer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
