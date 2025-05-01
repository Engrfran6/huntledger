'use client';

import type React from 'react';

import {Header} from '@/components/dashboard/header';
import {Sidebar} from '@/components/dashboard/sidebar';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {useAuthState} from '@/lib/auth-hooks';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuthState();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, mounted, router]);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarProvider defaultOpen>
        <Sidebar />
        <SidebarInset>
          <Header />
          <main className=" overflow-y-auto w-full bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// 'use client';

// import type React from 'react';

// import {Header} from '@/components/dashboard/header';
// import {Sidebar} from '@/components/dashboard/sidebar';
// import {useAuthState} from '@/lib/auth-hooks';
// import {Loader2} from 'lucide-react';
// import {useRouter} from 'next/navigation';
// import {useEffect, useState} from 'react';

// export default function DashboardLayout({children}: {children: React.ReactNode}) {
//   const {user, loading} = useAuthState();
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (mounted && !loading && !user) {
//       router.push('/auth/signin');
//     }
//   }, [user, loading, mounted, router]);

//   if (loading || !mounted) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
