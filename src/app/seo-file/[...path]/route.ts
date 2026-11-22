import { extraFile, fileResponse } from '@/lib/seo/files';

/**
 * Files the SEO team added in /web-admin/seo/files (ads.txt, a Google
 * verification .html, .well-known/security.txt, …).
 *
 * Reached through a fallback rewrite in next.config.ts: `/ads.txt` lands here
 * only when no page or public file has that address, so nothing real is ever
 * shadowed.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const file = await extraFile(path);
  if (!file) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return fileResponse(file.content, file.path);
}
