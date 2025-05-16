'use client';

import {signInWithGitHub, signInWithGoogle} from '@/lib/auth-provider';
import {GithubLogoIcon, GoogleLogoIcon} from '@phosphor-icons/react/dist/ssr';
import {Eye, EyeOff} from 'lucide-react';

import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

import {FieldLabel} from '@/components/dashboard/shared/custom-label';
import {fetchUserPreferences} from '@/lib/api';
import {useSignUp} from '@/lib/auth-hooks';
import {useUserStore} from '@/lib/stores/user-store';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {toast} from 'sonner';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {signUp, loading: isLoading, error} = useSignUp();
  const {resetPreferences} = useUserStore();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      resetPreferences();
      const success = await signUp(data.email, data.password);

      if (success) {
        toast.success('Account created successfully!', {
          description: 'You can now sign in with your credentials.',
        });
      }
    } catch (err) {
      console.log(error);
    }
  };

  const {updatePreferences, preferences} = useUserStore();
  const router = useRouter();
  const handleGoogleSignUp = async () => {
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

  const handleGitHubSignUp = async () => {
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
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-4 space-y-3">
          <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignUp}>
            <GoogleLogoIcon className="h-4 w-4" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={handleGitHubSignUp}>
            <GithubLogoIcon className="h-4 w-4" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with email
              </span>
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
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-2 relative">
              <FieldLabel htmlFor="password" required>
                Password
              </FieldLabel>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="pr-10"
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute hover:bg-transparent right-0 top-[55%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-xs text-muted-foreground mt-4">
              By registering, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary">
                Terms
              </Link>
              ,{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              , and{' '}
              <Link href="/dpa" className="underline hover:text-primary">
                DPA
              </Link>
              .
            </p>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-orange-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
