'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useSignIn} from '@/lib/auth-hooks';
import {auth} from '@/lib/firebase';
import {sendPasswordResetEmail} from 'firebase/auth';
import {useState} from 'react';
import {toast} from 'sonner';

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [needsReauth, setNeedsReauth] = useState(false);
  const [success, setSuccess] = useState(false);
  const {reauthenticate, loading} = useSignIn();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setNeedsReauth(true);
      } else {
        toast.error('Error', {description: error.message});
      }
    }
  };

  const handleReauthAndReset = async () => {
    const success = await reauthenticate(email, password);
    if (success) {
      await handleReset();
      setNeedsReauth(false);
    }
  };

  return (
    <div className="space-y-4">
      {success ? (
        <p className="text-green-500">Password reset email sent! Check your inbox.</p>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {needsReauth && (
            <div className="space-y-2">
              <Label htmlFor="password">Current Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                For security, please re-enter your password
              </p>
            </div>
          )}

          <Button onClick={needsReauth ? handleReauthAndReset : handleReset} disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </Button>
        </>
      )}
    </div>
  );
}
