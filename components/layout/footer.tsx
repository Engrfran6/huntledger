'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} HuntLedger. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          {/* Optional CCPA compliance link - uncomment if needed */}
          {/* <Link
            href="/do-not-sell"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Do Not Sell My Data
          </Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
