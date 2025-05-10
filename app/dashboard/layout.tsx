'use client';

import type React from 'react';

import {Header} from '@/components/dashboard/header';
import {Sidebar} from '@/components/dashboard/sidebar';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {useAuthState} from '@/lib/auth-hooks';
import {useUserStore} from '@/lib/stores/user-store';
import {Loader2} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const {userType} = useUserStore();

  // Define routes specific to each user type
  // const freelancerRoutes = [
  //   '/dashboard/clients',
  //   '/dashboard/clients/new',
  //   '/dashboard/projects',
  //   '/dashboard/tasks',
  //   '/dashboard/tasks/new',
  //   '/dashboard/subcontractors',
  //   '/dashboard/subcontractors/new',
  // ];

  // const jobSeekerRoutes = ['/dashboard/applications', '/dashboard/jobs/new'];

  // // Check if current route is specific to a user type
  // const isFreelancerRoute = freelancerRoutes.some(
  //   (route) =>
  //     pathname.startsWith(route) ||
  //     (pathname.includes('/clients/') && !pathname.endsWith('/new')) ||
  //     (pathname.includes('/tasks/') && !pathname.endsWith('/new')) ||
  //     (pathname.includes('/subcontractors/') && !pathname.endsWith('/new'))
  // );

  // const isJobSeekerRoute = jobSeekerRoutes.some(
  //   (route) =>
  //     pathname.startsWith(route) || (pathname.includes('/jobs/') && !pathname.endsWith('/new'))
  // );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, mounted, router]);

  // // Redirect if user is on a page not valid for their user type
  // useEffect(() => {
  //   if (mounted && !loading && user) {
  //     if (userType === 'jobSeeker' && isFreelancerRoute) {
  //       router.push('/dashboard');
  //     } else if (userType === 'freelancer' && isJobSeekerRoute) {
  //       router.push('/dashboard');
  //     }
  //   }
  // }, [userType, pathname, mounted, loading, user, router, isFreelancerRoute, isJobSeekerRoute]);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />

      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-1 pt-3 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
