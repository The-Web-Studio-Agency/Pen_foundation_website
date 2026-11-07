import type { ReactNode } from 'react';

import { cx } from '@/designs/v2/components/primitives';
import { RevealController } from '@/designs/v2/components/RevealController';
import { geistSans } from '@/designs/v2/fonts';
import t from '@/designs/v2/styles/theme.module.css';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

const ROOT_ID = 'top';

/**
 * Runs during parsing, before first paint: marks the root so reveal styles
 * may hide content until it scrolls in. Without script the mark never lands
 * and every element simply renders visible.
 */
const JS_FLAG = `document.getElementById('${ROOT_ID}').setAttribute('data-js','')`;

/**
 * The site's chrome: skip link, header, <main>, footer — inside one `.root`
 * element that owns the v2 design tokens and the Geist face (see
 * src/designs/v2). Rendered by `app/(site)/layout.tsx` for every route, and by
 * the global `not-found.tsx`, which sits outside that group.
 *
 * Every page opens on a dark ground (the homepage's 3D opening, or the shared
 * `PageHero`), which is what the transparent top state of the header expects.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div id={ROOT_ID} className={cx(t.root, geistSans.variable)} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <a href="#main" className={t.skip}>
        Skip to content
      </a>
      <SiteHeader />
      {/* `tabIndex={-1}`: the skip link moves focus here, so the next Tab does
          not go straight back into the nav that was skipped. */}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <RevealController rootId={ROOT_ID} />
    </div>
  );
}
