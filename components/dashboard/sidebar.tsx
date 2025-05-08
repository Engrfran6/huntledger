'use client';

import {Button} from '@/components/ui/button';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Sidebar as UISidebar,
  useSidebar,
} from '@/components/ui/sidebar';
import {useIsMobile} from '@/hooks/use-mobile';
import {auth} from '@/lib/firebase';
import {useUserStore} from '@/lib/stores/user-store';
import {signOut} from 'firebase/auth';
import {
  BarChart3,
  BriefcaseBusiness,
  Calendar,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import {useTheme} from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

// Define navigation items based on user type
const jobSeekerNavItems = [
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
];

const freelancerNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
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
];

// Common navigation items
const commonNavItems = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const {setOpen, setOpenMobile} = useSidebar();
  const isMobile = useIsMobile();

  const {userType} = useUserStore();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const {theme} = useTheme();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname]);

  const navItems = userType === 'jobSeeker' ? jobSeekerNavItems : freelancerNavItems;

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
                <Link
                  href={item.href}
                  onClick={() => {
                    if (isMobile) {
                      setOpenMobile(false);
                    } else {
                      setOpen(false);
                    }
                  }}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
          {commonNavItems.map((item, index) => (
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
