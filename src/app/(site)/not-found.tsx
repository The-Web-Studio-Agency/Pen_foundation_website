import { NotFoundHero } from '@/designs/v2/components/page/NotFoundHero';

/**
 * 404 for `notFound()` inside the `(site)` group (unknown project, article or
 * application slugs). The group layout already renders the header and footer,
 * so this is the body only — the global `app/not-found.tsx` wraps itself in
 * SiteChrome and would otherwise draw the chrome twice.
 */
export default function SiteNotFound() {
  return <NotFoundHero />;
}
