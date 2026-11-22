import { createMetadata } from '@/config/seo';
import { LandingPage } from '@/designs/v2/pages/landing/LandingPage';

/**
 * /landing-page — the destination for paid ads.
 *
 * Outside the `(site)` group: it has its own navbar and footer in the
 * site's design, linking only within the page, so visitors stay until they
 * enquire. It is not linked from the site, not in the sitemap, and marked
 * noindex so it never competes with the real pages in search.
 */
export function generateMetadata() {
  return createMetadata({
    title: 'Request a Project Assessment',
    description:
      'PEN Foundation is a patented Pre-Engineered Nail Foundation System designed for suitable low-rise construction. Zero conventional excavation. No foundation curing. Installed in hours.',
    path: '/landing-page',
    noIndex: true,
  });
}

export default function Page() {
  return <LandingPage />;
}
