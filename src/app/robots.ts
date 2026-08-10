import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Crawl rules.
 *
 * `/resources` carries `noIndex: true` and still holds clone copy; it comes off
 * this list the day it gets PEN's own words. `/engineering` and `/research` are
 * here for a related reason: both are unlinked from the header and the footer
 * until they are ready, and the header sends those labels to the homepage
 * sections covering the same ground instead.
 *
 * `/applications` is disallowed for a different reason: it is a 307 to
 * `/#applications` (see next.config.ts), so there is no document at that URL to
 * index. Keeping it listed stops a crawler spending requests rediscovering the
 * redirect, and it is still absent from the sitemap for the same reason.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/applications', '/engineering', '/research', '/resources'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
