import { SiteChrome } from '@/components/layout/SiteChrome';
import { createMetadata } from '@/config/seo';
import { NotFoundHero } from '@/designs/v2/components/page/NotFoundHero';

export const metadata = createMetadata({
  title: 'Page not found',
  description: 'The page you were looking for is not here.',
  path: '/404',
  noIndex: true,
});

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
