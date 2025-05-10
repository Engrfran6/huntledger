'use client';

import {ModeToggle} from '@/components/mode-toggle';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useAuthState, useSignOut} from '@/lib/auth-hooks';
import {Bell, LogOut, User} from 'lucide-react';
import {SidebarTrigger} from '../ui/sidebar';
import {UserTypeSwitcher} from '../user-type-switcher';

export function Header() {
  const {user} = useAuthState();
  const {logout, loading: isSigningOut} = useSignOut();

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-10 flex h-20 md:h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="-ml-1.5" />

      <div className="block">
        <UserTypeSwitcher />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-16 w-16" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="avatar.png" />
                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className=" h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logout} disabled={isSigningOut}>
              <LogOut className=" h-4 w-4" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
