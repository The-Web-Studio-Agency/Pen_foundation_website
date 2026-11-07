import type { ReactNode } from 'react';

import { SiteChrome } from '@/components/layout/SiteChrome';

/**
 * Layout for every live route: /, /about, /contact, /projects, …
 *
 * `(site)` is a route group — the parentheses keep it out of the URL, so every
 * path is exactly what it was before the group existed. Its only job is to put
 * the site chrome around these routes and nowhere else, which is what lets a
 * design concept such as /home-v2 render without the live header and footer.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
