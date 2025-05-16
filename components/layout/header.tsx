'use client';

import {cn} from '@/lib/utils';
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
        {/* <Link href="/dashboard" className="-ml-[67px] md:-ml-24 pb-1">
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
        </Link> */}

        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold -ml-[3.7rem] md:-ml-12 ">
          <Image src={'/logo.ico'} alt="HuntLedger Logo" width={100} height={50} />
          <span className="flex flex-col -ml-9 ]">
            <span className="flex text-[16px] md:text-lg ">
              <span className={cn('text-white', theme === 'light' && 'text-gray-900')}>Hunt</span>
              <span className="text-orange-600">Le</span>
              <span className={cn('text-white', theme === 'light' && 'text-gray-900')}>dger</span>
            </span>
            <span className="text-[8px] md:text-[9px] hidden md:block md:-mt-1.5 text-orange-600">
              Organize your job hunt, land faster
            </span>
          </span>
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
