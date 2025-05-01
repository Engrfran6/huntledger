'use client';

import {useTheme} from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import {ModeToggle} from '../mode-toggle';
import {Button} from '../ui/button';

const Header = () => {
  const {theme} = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="-ml-[67px] md:-ml-24 pb-1">
          <Image
            src={
              theme === 'dark'
                ? '/logo-dark.png'
                : theme === 'light'
                ? '/logo-light.png'
                : '/logo-dark.png'
            }
            alt="HuntLedger Logo"
            width={300}
            height={32}
          />
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4 -mr-4 md:-mr-0">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
