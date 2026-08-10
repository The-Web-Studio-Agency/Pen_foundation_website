import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Crawl rules.
 *
 * `/resources` carries `noIndex: true` and still holds clone copy; it comes off
 * this list the day it gets PEN's own words.
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
      disallow: ['/applications', '/resources'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
