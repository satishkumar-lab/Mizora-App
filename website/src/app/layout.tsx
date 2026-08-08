import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SITE } from '@/lib/site';

import './globals.css';

const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className={`${satoshi.className} text-mizora-ink min-h-dvh bg-white antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
