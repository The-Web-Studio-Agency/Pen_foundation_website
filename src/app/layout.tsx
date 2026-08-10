import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { fontVariables } from '@/config/fonts';
import { rootMetadata } from '@/config/seo';
import { AppProviders } from '@/providers/AppProviders';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PENPreloader } from '@/components/preloader/PENPreloader';
import './globals.css';

export const metadata: Metadata = rootMetadata;

/**
 * Runs before the first paint, ahead of hydration.
 *
 * The entry overlay is in the server HTML so that a first-time visitor never
 * sees the page before the curtain — and so its CSS entrance can start on the
 * first paint rather than waiting for hydration. That would mean a returning
 * visitor sees a frame of the panel before React could remove it — the flash
 * the overlay exists to avoid, just moved. This sets an attribute the overlay's
 * stylesheet keys off, so on a second entry it is display:none before anything
 * is painted.
 */
const ENTRY_FLAG_SCRIPT = `try{if(sessionStorage.getItem('pen-entered')==='1'){document.documentElement.setAttribute('data-pen-entered','')}}catch(e){}`;

/**
 * The curtain is raised by React, so without React it never goes up.
 *
 * The overlay is deliberately part of the server HTML, which means a visitor
 * with scripting disabled gets a fixed, full-screen cream panel over a page
 * that is otherwise complete and readable — and because it is `position:
 * fixed`, scrolling does not get out from under it. The whole site reads as a
 * blank screen. Hiding it here costs those visitors the entry animation, which
 * they were never going to see, and gives them the site.
 *
 * Scoped to `[data-preloader]` rather than the module's own class because that
 * class name is hashed at build time and cannot be named from here.
 */
const NO_SCRIPT_STYLES = `[data-preloader]{display:none!important}`;

/**
 * Application shell. Deliberately thin: fonts come from config, cross-cutting
 * context from AppProviders, and chrome from the layout components. Nothing
 * page-specific belongs here.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    /* `suppressHydrationWarning`: ENTRY_FLAG_SCRIPT below stamps
       `data-pen-entered` on this element before React hydrates, so on a return
       visit the client tree carries an attribute the server tree does not.
       React cannot patch that up and logs a mismatch on every such visit. The
       flag is scoped to this element's own attributes — children are still
       fully checked — which is exactly the case it exists for. */
    <html lang="en" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ENTRY_FLAG_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLES }} />
        </noscript>
      </head>
      <body>
        <AppProviders>
          <PENPreloader />
          {/*
           * Skip link. The header carries seven navigation items, a call
           * control and a CTA, so reaching the page content by keyboard meant
           * nine tab stops on every route — and the same nine again on the next
           * one. It is the first thing in the tab order and invisible until it
           * takes focus, which is the whole convention: `sr-only` until
           * `focus-visible`, then a real button over the header.
           *
           * `z-[60]` clears the header's `z-50`, or it would land underneath the
           * pill it is trying to skip.
           */}
          <a
            href="#main"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
          >
            Skip to content
          </a>
          <SiteHeader />
          {/* `tabIndex={-1}`: the skip link moves focus here, and without it the
              jump would move the viewport but leave focus in the header, so the
              next Tab would go straight back into the nav that was skipped. */}
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
