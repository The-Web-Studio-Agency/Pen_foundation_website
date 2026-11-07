import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * Crawl rules. Every page the navigation reaches is crawlable; the only
 * disallowed paths are addresses that now redirect (see next.config.ts), so a
 * crawler does not spend requests rediscovering them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/engineering', '/research', '/resources', '/home-v2'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
