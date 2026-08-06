import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { fontVariables } from '@/config/fonts';
import { rootMetadata } from '@/config/seo';
import { AppProviders } from '@/providers/AppProviders';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

export const metadata: Metadata = rootMetadata;

/**
 * Application shell. Deliberately thin: fonts come from config, cross-cutting
 * context from AppProviders, and chrome from the layout components. Nothing
 * page-specific belongs here.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body>
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
