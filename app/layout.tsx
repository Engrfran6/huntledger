import {AnalyticsProvider} from '@/components/analytic-provider';
import {ThemeProvider} from '@/components/theme-provider';
import {AuthProvider} from '@/lib/auth-provider';
import {QueryProvider} from '@/lib/query-provider';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import type React from 'react';
import {Toaster} from 'sonner';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'HuntLedger - Track Your Remote Job Applications',
  description: 'A simple and effective way to track your remote job applications',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#ffffff',
  openGraph: {
    title: 'HuntLedger - Track Your Remote Job Applications',
    description: 'A simple and effective way to track your remote job applications',
    url: 'https://huntledger.com',
    siteName: 'HuntLedger',
    images: [
      {
        url: 'https://huntledger.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <AnalyticsProvider />
              <Toaster closeButton position="top-right" />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
