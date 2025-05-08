'use client';

import {ModeToggle} from '@/components/mode-toggle';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {useAuthState} from '@/lib/auth-hooks';
import {auth} from '@/lib/firebase';
import {signOut} from 'firebase/auth';
import {Bell, User} from 'lucide-react';
import {useState} from 'react';
import {UserTypeSwitcher} from '../user-type-switcher';

export function Header() {
  const {user} = useAuthState();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      {/* <div className="w-full md:w-auto">
        <span className="text-sm  md:text-xl text-orange-600 font-semibold">
          Welcome to HuntLedger!
        </span>
      </div> */}

      <div className="hidden md:block">
        <UserTypeSwitcher />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
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
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// 'use client';

// import {ModeToggle} from '@/components/mode-toggle';
// import {Avatar, AvatarFallback} from '@/components/ui/avatar';
// import {Button} from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {useAuthState} from '@/lib/auth-hooks';
// import {auth} from '@/lib/firebase';
// import {signOut} from 'firebase/auth';
// import {Bell, User} from 'lucide-react';

// export function Header() {
//   const {user} = useAuthState();
//   // const [searchQuery, setSearchQuery] = useState('');

//   const handleSignOut = async () => {
//     await signOut(auth);
//   };

//   const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

//   return (
//     <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
//       <div className="hidden md:block md:w-64">
//         {/* <form>
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search jobs..."
//               className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </form> */}
//         <span className="text-xl text-orange-600 font-semibold">Welcome to HuntLedger!</span>
//       </div>
//       <div className="ml-auto flex items-center gap-2">
//         <ModeToggle />
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <Bell className="h-5 w-5" />
//           <span className="sr-only">Notifications</span>
//         </Button>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="rounded-full">
//               <Avatar className="h-8 w-8">
//                 <AvatarFallback className="bg-orange-100 text-orange-800">
//                   {userInitials}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="sr-only">User menu</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               Profile
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }
