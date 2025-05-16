'use client';

import {signInWithGitHub, signInWithGoogle} from '@/lib/auth-provider';
import {GithubLogoIcon, GoogleLogoIcon} from '@phosphor-icons/react/dist/ssr';
import {Eye, EyeOff, Loader2} from 'lucide-react';

import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

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
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import {useState} from 'react';

import {FieldLabel} from '@/components/dashboard/shared/custom-label';
import {fetchUserPreferences} from '@/lib/api';
import {useSignIn} from '@/lib/auth-hooks';
import {auth} from '@/lib/firebase';
import {useUserStore} from '@/lib/stores/user-store';
import {sendPasswordResetEmail} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {signIn, error, loading} = useSignIn();

  const onSubmit = async (data: FormData) => {
    const success = await signIn(data.email, data.password);

    if (success)
      return toast('Signed in successfully!', {description: 'Welcome back to HuntLedger.'});
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent', {
        description: 'Check your email for a link to reset your password.',
      });
      setResetDialogOpen(false);
    } catch (error: any) {
      toast.error('Error sending reset email', {description: error.message});
    } finally {
      setIsResetting(false);
    }
  };

  const {updatePreferences, preferences} = useUserStore();
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const success = await signInWithGoogle();
      toast.success('Signed in with Google');

      if (success) {
        // Fetch user preferences from database
        const userPrefs = await fetchUserPreferences();

        // Update local preferences with database values
        if (userPrefs) {
          updatePreferences(userPrefs);
        }

        router.push('/choose-mode');
      }
    } catch (error: any) {
      toast.error('Google sign-in failed', {description: error.message});
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const success = await signInWithGitHub();
      toast.success('Signed in with GitHub');

      if (success) {
        // Fetch user preferences from database
        const userPrefs = await fetchUserPreferences();

        // Update local preferences with database values
        if (userPrefs) {
          updatePreferences(userPrefs);
        }

        router.push('/choose-mode');
      }
    } catch (error: any) {
      toast.error('GitHub sign-in failed', {description: error.message});
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        {/* Add OAuth buttons before the form */}
        <div className="px-6 pb-4 space-y-3">
          <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn}>
            <GoogleLogoIcon className="h-4 w-4" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={handleGitHubSignIn}>
            <GithubLogoIcon className="h-4 w-4" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FieldLabel htmlFor="email" required>
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                disabled={loading || isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-2 relative">
              <FieldLabel htmlFor="password" required>
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="pr-10"
                  disabled={loading || isSubmitting}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute hover:bg-transparent right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-8 w-8" /> : <Eye className="h-8 w-8" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading || isSubmitting}>
              {loading || isSubmitting ? (
                <>
                  <Loader2 className="animate-spin size-5 mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <div className="flex flex-col md:flex-row items-center gap-2 md:justify-between w-full text-sm px-4 ">
              <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-orange-600 hover:underline p-0 h-auto">
                    Forgot password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleResetPassword}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <FieldLabel htmlFor="reset-email" required>
                          Email
                        </FieldLabel>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="name@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isResetting}>
                        {isResetting ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <div>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-orange-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
