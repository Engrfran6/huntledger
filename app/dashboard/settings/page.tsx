'use client';

import type React from 'react';

import {FieldLabel} from '@/components/dashboard/shared/custom-label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Switch} from '@/components/ui/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {fetchUserPreferences} from '@/lib/api';
import {useAuthState} from '@/lib/auth-hooks';
import {useUserStore} from '@/lib/stores/user-store';
import {LaptopIcon, MoonIcon, SunIcon} from '@phosphor-icons/react/dist/ssr';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import {Eye, EyeOff} from 'lucide-react';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';

export default function SettingsPage() {
  const {user} = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [reauthLoading, setReauthLoading] = useState(false);
  const [reauthDialogOpen, setReauthDialogOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'email' | 'password' | null>(null);

  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [applicationReminders, setApplicationReminders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const {preferences, updatePreferences, updateNotifications, userType} = useUserStore();
  const [notificationSettings, setNotificationSettings] = useState(preferences.notifications);
  const [theme, setTheme] = useState(preferences.theme || 'system');

  // Load user preferences from Firebase on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        try {
          const prefs = await fetchUserPreferences();
          if (prefs && prefs.notifications) {
            setNotificationSettings(prefs.notifications);
          }
        } catch (error) {
          console.error('Failed to load user preferences:', error);
        }
      }
    };

    loadPreferences();
  }, [user]);

  const handleReauthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setReauthError(null);
    setReauthLoading(true);

    try {
      if (!user || !user.email) {
        throw new Error('User not found');
      }

      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);

      setReauthDialogOpen(false);
      setReauthPassword('');

      // Continue with the pending action
      if (pendingAction === 'email') {
        await handleUpdateEmail(null, true);
      } else if (pendingAction === 'password') {
        await handleUpdatePassword(null, true);
      }
    } catch (error: any) {
      setReauthError(error.message);
      toast.error('Authentication failed', {description: error.message});
    } finally {
      setReauthLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent | null, isReauthenticated = false) => {
    if (e) e.preventDefault();
    if (!user) return;

    if (!isReauthenticated) {
      setPendingAction('email');
      setReauthDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await updateEmail(user, email);
      toast.success('Email updated', {description: 'Your email has been updated successfully.'});
    } catch (error: any) {
      toast.error('Error updating email', {description: error.message});
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent | null, isReauthenticated = false) => {
    if (e) e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: 'New password and confirm password must match.',
      });
      return;
    }

    if (!isReauthenticated) {
      setPendingAction('password');
      setReauthDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(user, newPassword);
      toast.success('Password updated', {
        description: 'Your password has been updated successfully.',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.success('Error updating password', {description: error.message});
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await deleteUser(user);
      toast.success('Account deleted', {
        description: 'Your account has been deleted successfully.',
      });
    } catch (error: any) {
      toast.error('Error deleting account', {description: error.message});
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = (key: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveNotificationPreferences = async () => {
    setIsSaving(true);
    try {
      await updateNotifications(notificationSettings);
      toast.success('Preferences saved', {
        description: 'Your notification preferences have been updated.',
      });
    } catch (error: any) {
      toast.error('Error saving preferences', {
        description: error.message || 'Failed to save notification preferences',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    // Apply theme immediately (optional)
    document.documentElement.setAttribute('data-theme', value);
  };

  const saveAppearancePreferences = async () => {
    setIsSaving(true);
    try {
      await updatePreferences({...preferences, theme});
      toast.success('Appearance saved', {
        description: 'Your theme preferences have been updated.',
      });
    } catch (error: any) {
      toast.error('Error saving preferences', {
        description: error.message || 'Failed to save appearance preferences',
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        try {
          const prefs = await fetchUserPreferences();
          if (prefs) {
            if (prefs.notifications) {
              setNotificationSettings(prefs.notifications);
            }
            if (prefs.theme) {
              setTheme(prefs.theme);
              document.documentElement.setAttribute('data-theme', prefs.theme);
            }
          }
        } catch (error) {
          console.error('Failed to load user preferences:', error);
        }
      }
    };

    loadPreferences();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>Update your email address</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleUpdateEmail(e)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FieldLabel htmlFor="email" required>
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Email'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => handleUpdatePassword(e)}>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <FieldLabel htmlFor="new-password" required>
                    New Password
                  </FieldLabel>
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[27px] text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <FieldLabel htmlFor="confirm-password" required>
                    Confirm New Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[27px] text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and
                      remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleToggleNotification('emailNotifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="weekly-digest" className="flex flex-col space-y-1">
                  <span>Weekly Digest</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    {userType === 'jobSeeker'
                      ? 'Receive a weekly summary of your job search progress'
                      : 'Receive a weekly summary of your freelance projects and tasks'}
                  </span>
                </Label>
                <Switch
                  id="weekly-digest"
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) => handleToggleNotification('weeklyDigest', checked)}
                />
              </div>

              {userType === 'jobSeeker' && (
                <>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="application-reminders" className="flex flex-col space-y-1">
                      <span>Application Reminders</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get reminders for follow-ups and upcoming applications
                      </span>
                    </Label>
                    <Switch
                      id="application-reminders"
                      checked={notificationSettings.applicationReminders}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('applicationReminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="interview-reminders" className="flex flex-col space-y-1">
                      <span>Interview Reminders</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get reminders 24 hours before scheduled interviews
                      </span>
                    </Label>
                    <Switch
                      id="interview-reminders"
                      checked={notificationSettings.interviewReminders}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('interviewReminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="offer-deadline-reminders" className="flex flex-col space-y-1">
                      <span>Offer Deadline Reminders</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get reminders about upcoming job offer deadlines and start dates
                      </span>
                    </Label>
                    <Switch
                      id="offer-deadline-reminders"
                      checked={notificationSettings.offerDeadlineReminders}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('offerDeadlineReminders', checked)
                      }
                    />
                  </div>
                </>
              )}

              {userType === 'freelancer' && (
                <>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="deadline-reminders" className="flex flex-col space-y-1">
                      <span>Deadline Reminders</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get reminders for upcoming project and task deadlines
                      </span>
                    </Label>
                    <Switch
                      id="deadline-reminders"
                      checked={notificationSettings.deadlineReminders}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('deadlineReminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="client-updates" className="flex flex-col space-y-1">
                      <span>Client Updates</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive notifications about client activity and updates
                      </span>
                    </Label>
                    <Switch
                      id="client-updates"
                      checked={notificationSettings.clientUpdates}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('clientUpdates', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="payment-reminders" className="flex flex-col space-y-1">
                      <span>Payment Reminders</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get reminders about upcoming and overdue payments
                      </span>
                    </Label>
                    <Switch
                      id="payment-reminders"
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) =>
                        handleToggleNotification('paymentReminders', checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationPreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        {/* <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <SunIcon className="mb-2 h-6 w-6" />
                      Light
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <MoonIcon className="mb-2 h-6 w-6" />
                      Dark
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <LaptopIcon className="mb-2 h-6 w-6" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAppearancePreferences} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Review our legal terms and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Legal Documents</h3>
                <div className="flex flex-col space-y-2">
                  <Link href="/terms" className="text-sm underline">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-sm underline">
                    Privacy Policy
                  </Link>
                  <Link href="/dpa" className="text-sm underline">
                    Data Processing Agreement
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reauthentication Dialog */}
      <Dialog open={reauthDialogOpen} onOpenChange={setReauthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Identity</DialogTitle>
            <DialogDescription>
              For security reasons, please enter your current password to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReauthenticate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FieldLabel htmlFor="current-password" required>
                  Current Password
                </FieldLabel>
                <Input
                  id="current-password"
                  type="password"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  required
                />
                {reauthError && <p className="text-sm text-red-500">{reauthError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReauthDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={reauthLoading}>
                {reauthLoading ? 'Verifying...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
