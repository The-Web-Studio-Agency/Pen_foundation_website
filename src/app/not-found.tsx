import type { Metadata } from 'next';

import { SiteChrome } from '@/components/layout/SiteChrome';
import { NotFoundHero } from '@/designs/v2/components/page/NotFoundHero';

/* A fixed object rather than createMetadata (which reads the SEO team's
   overrides and so is async): a missing page is never indexed anyway. */
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for is not here.',
  robots: { index: false, follow: false },
};

/**
 * 404 for URLs that match no route. It renders under the root layout only —
 * outside the `(site)` group — so it brings the site chrome itself.
 * A `notFound()` thrown inside the group (an unknown project, article or
 * application slug) uses `app/(site)/not-found.tsx` instead, which already
 * sits inside the chrome.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundHero />
    </SiteChrome>
  );
}
