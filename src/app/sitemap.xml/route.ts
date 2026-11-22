import { fileResponse, sitemapFile } from '@/lib/seo/files';

/* Read on every request (the CDN caches it for 5 minutes), so an SEO change
   never waits for a redeploy. */
export const dynamic = 'force-dynamic';

/** /sitemap.xml — generated from the pages, or the SEO team's own (lib/seo/files.ts). */
export async function GET() {
  return fileResponse(await sitemapFile(), 'sitemap.xml');
}
