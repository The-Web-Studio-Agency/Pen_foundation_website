import { siteConfig } from '@/config/site';
import { contentReady } from '@/lib/cms/server';

import { pagesWithDefaults } from './pageDefaults';
import { sitePages } from './routes';
import { FILE_TYPES, seoFiles, seoPages, seoSite } from './settings';

/**
 * The files search engines and AI tools read from the site's root.
 *
 * robots.txt, sitemap.xml and llms.txt are generated from the pages (and the
 * SEO team's settings) unless the team has written their own in
 * /web-admin/seo/files. Any other file they add there is served as typed.
 */

/** Old addresses that now redirect (next.config.ts), and the admin. */
const ALWAYS_DISALLOWED = [
  '/engineering',
  '/research',
  '/resources',
  '/home-v2',
  '/web-admin',
  '/seo-file',
];

export function generatedRobots(): string {
  const url = siteConfig.url;
  if (seoSite().hideSite) return 'User-Agent: *\nDisallow: /\n';
  const extra = seoFiles().robotsDisallow?.split('\n').filter(Boolean) ?? [];
  return [
    'User-Agent: *',
    'Allow: /',
    ...[...ALWAYS_DISALLOWED, ...extra].map((path) => `Disallow: ${path}`),
    '',
    `Host: ${url}`,
    `Sitemap: ${url}/sitemap.xml`,
    '',
  ].join('\n');
}

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Every listed page, minus any the SEO team hid from search. */
export function generatedSitemap(): string {
  const hidden = seoPages();
  const pages = seoSite().hideSite
    ? []
    : sitePages().filter((p) => p.listed && hidden[p.path]?.noIndex !== true);
  const now = new Date().toISOString();
  const urls = pages.map(
    (p) =>
      `<url>\n<loc>${xml(`${siteConfig.url}${p.path}`)}</loc>\n<lastmod>${now}</lastmod>\n<changefreq>${p.changeFrequency}</changefreq>\n<priority>${p.priority}</priority>\n</url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/**
 * llms.txt (llmstxt.org): a plain-Markdown guide for AI assistants — what the
 * organisation is and its key pages, each with the same title and summary
 * Google gets.
 */
export async function generatedLlms(): Promise<string> {
  const hidden = seoPages();
  const site = seoSite();
  const rows = (await pagesWithDefaults()).filter(
    (p) => p.listed && !site.hideSite && hidden[p.path]?.noIndex !== true,
  );
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    const own = hidden[row.path] ?? {};
    const title = (own.title || row.defaults.title).replace(/\s*\|\s*PEN Foundation$/, '');
    const description = (own.description || row.defaults.description).replace(/\s+/g, ' ').trim();
    const line = `- [${title}](${siteConfig.url}${row.path})${description ? `: ${description}` : ''}`;
    groups.set(row.group, [...(groups.get(row.group) ?? []), line]);
  }
  return [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `${siteConfig.name} (${siteConfig.tagline}). Website: ${siteConfig.url}. Phone: ${siteConfig.phone}.`,
    '',
    ...[...groups].flatMap(([group, lines]) => [`## ${group}`, '', ...lines, '']),
  ].join('\n');
}

/* ---- serving ------------------------------------------------------------------- */

export function fileResponse(content: string, path: string) {
  const ext = path.split('.').pop()?.toLowerCase() ?? 'txt';
  return new Response(content, {
    headers: {
      'Content-Type': FILE_TYPES[ext] ?? 'text/plain; charset=utf-8',
      // Short, so a change in the admin reaches crawlers within minutes.
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function robotsFile() {
  await contentReady();
  return seoFiles().robots ?? generatedRobots();
}

export async function sitemapFile() {
  await contentReady();
  return seoFiles().sitemap ?? generatedSitemap();
}

export async function llmsFile() {
  await contentReady();
  return seoFiles().llms ?? (await generatedLlms());
}

/** A file the SEO team added, or null. */
export async function extraFile(path: string) {
  await contentReady();
  const wanted = path.toLowerCase();
  return seoFiles().extra?.find((f) => f.path.toLowerCase() === wanted) ?? null;
}
