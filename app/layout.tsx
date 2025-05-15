import {AnalyticsProvider} from '@/components/analytic-provider';
import {ThemeProvider} from '@/components/theme-provider';
import {AuthProvider} from '@/lib/auth-provider';
import {QueryProvider} from '@/lib/query-provider';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Head from 'next/head';
import type React from 'react';
import {Toaster} from 'sonner';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: {
    default: 'HuntLedger - Job Application Tracker for Remote Jobs',
    template: '%s | HuntLedger',
  },
  description:
    'Organize, track, and optimize your remote job search with HuntLedger. Free job application tracker with analytics and reminders.',
  applicationName: 'HuntLedger',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'job application tracker',
    'remote job organizer',
    'job search manager',
    'application status tracker',
    'career progress monitor',
  ],
  authors: [{name: 'HuntLedger Team', url: 'https://www.huntledger.com'}],
  creator: 'HuntLedger',
  publisher: 'HuntLedger',
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.huntledger.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  icons: {
    icon: [
      {url: '/favicon.ico', sizes: '32x32'},
      {url: '/favicon-16x16.png', sizes: '16x16'},
      {url: '/favicon-32x32.png', sizes: '32x32'},
    ],
    shortcut: ['/favicon.ico'],
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  openGraph: {
    title: 'HuntLedger - Smart Job Application Tracking',
    description:
      'Never lose track of your remote job applications again. Free dashboard for organized job searching.',
    url: 'https://www.huntledger.com',
    siteName: 'HuntLedger',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.huntledger.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HuntLedger Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HuntLedger - Job Application Tracker',
    description: 'The free tool to organize your remote job search',
    creator: '@huntledger',
    images: ['https://www.huntledger.com/twitter-card.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'HuntLedger - Job Application Tracker',
  description: 'Organize and track your remote job applications',
  url: 'https://www.huntledger.com',
  publisher: {
    '@type': 'Organization',
    name: 'HuntLedger',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.huntledger.com/logo.png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
      </Head>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <AnalyticsProvider />
              <Toaster
                closeButton
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
