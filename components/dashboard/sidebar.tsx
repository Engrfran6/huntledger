'use client';

import {Button} from '@/components/ui/button';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UISidebar,
} from '@/components/ui/sidebar';
import {auth} from '@/lib/firebase';
import {signOut} from 'firebase/auth';
import {
  BarChart3,
  BriefcaseBusiness,
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import {useTheme} from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Applications',
    href: '/dashboard/applications',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const {theme} = useTheme();

  return (
    <UISidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center border-b  -ml-10 pb-1">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Image
              src={
                theme === 'dark'
                  ? '/logo-dark.png'
                  : theme === 'light'
                  ? '/logo-light.png'
                  : '/logo-dark.png'
              }
              alt="HuntLedger Logo"
              width={400}
              height={32}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="pl-6 pt-5">
          {navItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </UISidebar>
  );
}

// 'use client';

// import {Button} from '@/components/ui/button';
// import {auth} from '@/lib/firebase';
// import {cn} from '@/lib/utils';
// import {signOut} from 'firebase/auth';
// import {
//   BarChart3,
//   BriefcaseBusiness,
//   Calendar,
//   LayoutDashboard,
//   LogOut,
//   Settings,
// } from 'lucide-react';
// import {useTheme} from 'next-themes';
// import Image from 'next/image';
// import Link from 'next/link';
// import {usePathname} from 'next/navigation';

// const navItems = [
//   {
//     title: 'Dashboard',
//     href: '/dashboard',
//     icon: LayoutDashboard,
//   },
//   {
//     title: 'Applications',
//     href: '/dashboard/applications',
//     icon: BriefcaseBusiness,
//   },
//   {
//     title: 'Analytics',
//     href: '/dashboard/analytics',
//     icon: BarChart3,
//   },
//   {
//     title: 'Calendar',
//     href: '/dashboard/calendar',
//     icon: Calendar,
//   },
//   {
//     title: 'Settings',
//     href: '/dashboard/settings',
//     icon: Settings,
//   },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   const handleSignOut = async () => {
//     await signOut(auth);
//   };

//   const {theme} = useTheme();

//   return (
//     <div className="flex h-full w-64 flex-col border-r bg-background">
//       <div className="flex h-14 items-center border-b  -ml-10 pb-1">
//         <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
//           <Image
//             src={
//               theme === 'dark'
//                 ? '/logo-dark.png'
//                 : theme === 'light'
//                 ? '/logo-light.png'
//                 : '/logo-dark.png'
//             }
//             alt="HuntLedger Logo"
//             width={400}
//             height={32}
//           />
//         </Link>
//       </div>
//       <div className="flex-1 overflow-auto py-2">
//         <nav className="grid items-start px-2 text-sm">
//           {navItems.map((item, index) => (
//             <Link
//               key={index}
//               href={item.href}
//               className={cn(
//                 'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
//                 pathname === item.href && 'bg-muted font-medium text-foreground'
//               )}>
//               <item.icon className="h-4 w-4" />
//               {item.title}
//             </Link>
//           ))}
//         </nav>
//       </div>
//       <div className="mt-auto p-4">
//         <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
//           <LogOut className="mr-2 h-4 w-4" />
//           Sign out
//         </Button>
//       </div>
//     </div>
//   );
// }
