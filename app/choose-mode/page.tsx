'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {updateUserPreferences} from '@/lib/api';
import {useAuthState} from '@/lib/auth-hooks';
import {useUserStore} from '@/lib/stores/user-store';
import {Briefcase, FileSearch, Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function ChooseModePage() {
  const {user, loading} = useAuthState();
  const router = useRouter();
  const {setUserType, preferences, updatePreferences} = useUserStore();
  const [rememberChoice, setRememberChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [preferences]);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/signin');
    }

    // If user has a remembered preference, redirect to dashboard
    if (mounted && !loading && user && preferences.rememberUserType === true) {
      console.log('User has remembered preference, redirecting to dashboard');
      setUserType(preferences.userType);
      router.push('/dashboard');
    }
  }, [user, loading, router, preferences, setUserType, mounted]);

  const handleModeSelection = async (mode: 'jobSeeker' | 'freelancer') => {
    setIsSubmitting(true);

    try {
      console.log(`Selected mode: ${mode}, remember choice: ${rememberChoice}`);

      // Update local state
      setUserType(mode);

      // Update preferences if remember choice is selected
      if (rememberChoice) {
        updatePreferences({
          userType: mode,
          rememberUserType: true,
        });

        // Also update in database for persistence across devices
        await updateUserPreferences({
          userType: mode,
          rememberUserType: true,
        });
      } else {
        // If not remembering, still set the userType but don't set rememberUserType
        updatePreferences({
          userType: mode,
          rememberUserType: false,
        });

        // Also update in database
        await updateUserPreferences({
          userType: mode,
          rememberUserType: false,
        });
      }

      // Redirect to dashboard
      console.log('Redirecting to dashboard after mode selection');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting user mode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // Don't show loading if we're redirecting due to remembered preference
  if (preferences.rememberUserType === true) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 dark:bg-gray-900 px-4 pb-24 md:pb-4 relative">
      <div className="md:mt-[10%] h-full justify-center w-full max-w-4xl flex flex-col items-center py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to HuntLedger</h1>
          <p className="text-muted-foreground mt-2">Choose how you want to use HuntLedger today</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-center">
          {/* Job Seeker Card */}
          <Card className="relative overflow-hidden border-2 hover:border-orange-600 transition-all cursor-pointer group">
            <div
              className="absolute inset-0 w-full h-full"
              onClick={() => !isSubmitting && handleModeSelection('jobSeeker')}></div>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <FileSearch className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Job Seeker
              </CardTitle>
              <CardDescription>Track your job applications and interviews</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2 list-disc pl-5">
                <li>Track job applications</li>
                <li>Manage interview schedules</li>
                <li>Monitor application statuses</li>
                <li>Analyze your job search progress</li>
                <li>Set reminders for follow-ups</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => handleModeSelection('jobSeeker')}
                disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue as Job Seeker
              </Button>
            </CardFooter>
          </Card>

          {/* Freelancer Card */}
          <Card className="relative overflow-hidden border-2 hover:border-orange-600 transition-all cursor-pointer group">
            <div
              className="absolute inset-0 w-full h-full"
              onClick={() => !isSubmitting && handleModeSelection('freelancer')}></div>
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Freelancer
              </CardTitle>
              <CardDescription>Manage clients, projects and subcontractors</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2 list-disc pl-5">
                <li>Track client projects</li>
                <li>Manage subcontractors</li>
                <li>Assign and monitor tasks</li>
                <li>Track project timelines</li>
                <li>Analyze revenue and performance</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => handleModeSelection('freelancer')}
                disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue as Freelancer
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Checkbox - visible on desktop */}
        <div className="mt-6  items-center space-x-2 justify-center md:flex hidden">
          <Checkbox
            id="remember"
            checked={rememberChoice}
            onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
            Remember my choice for next time
          </Label>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 md:relative md:border-t-0 md:bg-transparent md:dark:bg-transparent md:p-0">
          <div className="max-w-4xl mx-auto flex items-center space-x-2 justify-center">
            <Checkbox
              id="remember"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Remember my choice for next time
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
