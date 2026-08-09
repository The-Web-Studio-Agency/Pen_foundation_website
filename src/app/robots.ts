import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Crawl rules. The two disallowed paths are the same two the sitemap omits and
 * that carry `noIndex: true` — `/applications` is an empty placeholder and
 * `/resources` still holds clone copy. Both should come off this list the day
 * they get real content.
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
