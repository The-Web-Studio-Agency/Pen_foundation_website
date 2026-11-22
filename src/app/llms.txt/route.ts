import { fileResponse, llmsFile } from '@/lib/seo/files';

/* Read on every request (the CDN caches it for 5 minutes), so an SEO change
   never waits for a redeploy. */
export const dynamic = 'force-dynamic';

/** /llms.txt — a guide to the site for AI assistants (llmstxt.org), generated or the SEO team's own. */
export async function GET() {
  return fileResponse(await llmsFile(), 'llms.txt');
}
