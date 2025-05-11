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
import {useSignOut} from '@/lib/auth-hooks';
import {useUserStore} from '@/lib/stores/user-store';
import {cn} from '@/lib/utils';
import {
  BarChart3,
  BriefcaseBusiness,
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
  // {
  //   title: 'Calendar',
  //   href: '/dashboard/calendar',
  //   icon: Calendar,
  // },
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
  // {
  //   title: 'Tasks',
  //   href: '/dashboard/tasks',
  //   icon: ListTodo,
  // },
  // {
  //   title: 'Subcontractors',
  //   href: '/dashboard/subcontractors',
  //   icon: UserCog,
  // },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  // {
  //   title: 'Calendar',
  //   href: '/dashboard/calendar',
  //   icon: Calendar,
  // },
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
  const {open, setOpenMobile} = useSidebar();
  const {logout, loading: isSigningOut} = useSignOut();
  const isMobile = useIsMobile();

  const {userType} = useUserStore();
  const pathname = usePathname();

  const {theme} = useTheme();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname]);

  const navItems = userType === 'jobSeeker' ? jobSeekerNavItems : freelancerNavItems;

  return (
    <UISidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-2 font-bold -ml-6 border-b -mt-2 pb-1.5',
                !open && 'ml-0'
              )}>
              <Image src={'/logo.ico'} alt="HuntLedger Logo" width={100} height={50} />
              <span className={cn('flex flex-col -ml-9 leading-[10px]', !open && 'hidden')}>
                <span className="text-lg">
                  <span className={cn('text-white', theme === 'light' && 'text-gray-900')}>
                    Hunt
                  </span>
                  <span className="text-orange-600">Le</span>
                  <span className={cn('text-white', theme === 'light' && 'text-gray-900')}>
                    dger
                  </span>
                </span>
                <span className="text-[9px] text-orange-600">
                  Organize your job hunt, land faster
                </span>
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-3 pt-5">
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
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
          disabled={isSigningOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </Button>
      </SidebarFooter>
    </UISidebar>
  );
}
