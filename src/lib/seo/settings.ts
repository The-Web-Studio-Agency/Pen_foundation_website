import { readOverride } from '@/lib/cms/store';

/**
 * What the SEO team edits in /web-admin/seo, and how it is checked.
 *
 * Stored in the CMS content store under four ids (never in the client's
 * content registry, so only the SEO account can reach them):
 *
 *   seo.pages      per-page title, description, share image, indexing
 *   seo.site       verification codes, default share image, hide-the-site
 *   seo.tracking   GA4, Tag Manager, Meta Pixel, Clarity, LinkedIn, Ads, code
 *   seo.files      robots.txt / sitemap.xml / llms.txt (auto or written by
 *                  hand) and any other file served from the site's root
 *
 * Every value is cleaned on save (`clean*`) and the tracking IDs are checked
 * again when rendered, because they are written into inline scripts.
 */

export const SEO_IDS = {
  pages: 'seo.pages',
  site: 'seo.site',
  tracking: 'seo.tracking',
  files: 'seo.files',
} as const;
export type SeoSection = keyof typeof SEO_IDS;

export interface SeoPage {
  /** The whole <title>, exactly as it should appear in Google. */
  title?: string;
  description?: string;
  /** Share image (Open Graph / WhatsApp / LinkedIn preview). */
  image?: string;
  /** true hides from search engines, false forces indexing, absent = page default. */
  noIndex?: boolean;
}
export type SeoPages = Record<string, SeoPage>;

export interface SeoSite {
  googleVerification?: string;
  bingVerification?: string;
  facebookVerification?: string;
  pinterestVerification?: string;
  yandexVerification?: string;
  /** Used by every page without its own share image. */
  defaultImage?: string;
  /** Emergency switch: ask search engines to drop the whole site. */
  hideSite?: boolean;
}

export interface SeoTracking {
  ga4?: string;
  gtm?: string;
  metaPixel?: string;
  clarity?: string;
  linkedin?: string;
  googleAds?: string;
  /** Raw HTML added to <head> (e.g. a JSON-LD block or another vendor's tag). */
  headCode?: string;
  /** Raw HTML added at the start of <body>. */
  bodyCode?: string;
}

/** A file the SEO team added, served at `/<path>`. */
export interface SeoExtraFile {
  /** e.g. "ads.txt", "google1a2b3c.html", ".well-known/security.txt" */
  path: string;
  content: string;
}

export interface SeoFiles {
  /** Written by hand; absent = generated. */
  robots?: string;
  sitemap?: string;
  llms?: string;
  /** Extra Disallow paths for the generated robots.txt, one per line. */
  robotsDisallow?: string;
  extra?: SeoExtraFile[];
}

/** The format each tracking ID must have. Anything else is refused. */
export const TRACKING_FORMATS: Record<
  Exclude<keyof SeoTracking, 'headCode' | 'bodyCode'>,
  { pattern: RegExp; example: string }
> = {
  ga4: { pattern: /^G-[A-Z0-9]{4,16}$/, example: 'G-ABC123XYZ9' },
  gtm: { pattern: /^GTM-[A-Z0-9]{4,12}$/, example: 'GTM-AB12CD3' },
  metaPixel: { pattern: /^\d{8,20}$/, example: '123456789012345' },
  clarity: { pattern: /^[a-z0-9]{6,16}$/, example: 'abcd1234ef' },
  linkedin: { pattern: /^\d{3,12}$/, example: '1234567' },
  googleAds: { pattern: /^AW-\d{6,14}$/, example: 'AW-123456789' },
};

/* ---- reading (server: from the CMS cache; never shipped to the browser) ---- */

const read = <T>(section: SeoSection): T =>
  ((readOverride(SEO_IDS[section]) as T | undefined) ?? {}) as T;

export const seoPages = () => read<SeoPages>('pages');
export const seoSite = () => read<SeoSite>('site');
export const seoTracking = () => read<SeoTracking>('tracking');
export const seoFiles = () => read<SeoFiles>('files');

/** A tracking ID, only if it is well formed. */
export function validId(key: keyof typeof TRACKING_FORMATS, value: string | undefined) {
  const v = value?.trim() ?? '';
  return TRACKING_FORMATS[key].pattern.test(v) ? v : '';
}

/* ---- cleaning (on save) ------------------------------------------------------ */

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '';

/** Drop empty values so "absent" keeps meaning "use the default". */
function compact<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined && v !== null),
  ) as T;
}

/** A path on this site, or an absolute http(s) URL. */
function imageUrl(v: unknown) {
  const s = str(v, 500);
  return /^(\/[^\s]*|https?:\/\/[^\s]+)$/.test(s) ? s : '';
}

/** Verification codes: the content value only, if someone pasted the whole tag. */
function code(v: unknown) {
  const s = str(v, 300);
  const m = s.match(/content=["']([^"']+)["']/i);
  return (m ? m[1] : s).replace(/[^A-Za-z0-9_\-.=+/:]/g, '');
}

export class SeoInputError extends Error {}

export function cleanPages(value: unknown): SeoPages {
  if (!value || typeof value !== 'object') return {};
  const out: SeoPages = {};
  for (const [path, raw] of Object.entries(value as Record<string, unknown>).slice(0, 2000)) {
    if (!/^\/[^\s]{0,300}$/.test(path) || !raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const page = compact<SeoPage>({
      title: str(r.title, 200),
      description: str(r.description, 400),
      image: imageUrl(r.image),
      noIndex: typeof r.noIndex === 'boolean' ? r.noIndex : undefined,
    });
    if (Object.keys(page).length) out[path] = page;
  }
  return out;
}

export function cleanSite(value: unknown): SeoSite {
  const r = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return compact<SeoSite>({
    googleVerification: code(r.googleVerification),
    bingVerification: code(r.bingVerification),
    facebookVerification: code(r.facebookVerification),
    pinterestVerification: code(r.pinterestVerification),
    yandexVerification: code(r.yandexVerification),
    defaultImage: imageUrl(r.defaultImage),
    hideSite: r.hideSite === true ? true : undefined,
  });
}

export function cleanTracking(value: unknown): SeoTracking {
  const r = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const out: SeoTracking = {
    headCode: str(r.headCode, 20000),
    bodyCode: str(r.bodyCode, 20000),
  };
  for (const key of Object.keys(TRACKING_FORMATS) as (keyof typeof TRACKING_FORMATS)[]) {
    const v = str(r[key], 40);
    if (!v) continue;
    const normalised = key === 'clarity' ? v.toLowerCase() : v.toUpperCase();
    if (!TRACKING_FORMATS[key].pattern.test(normalised)) {
      throw new SeoInputError(
        `"${v}" does not look like a valid ${LABELS[key]} ID (expected something like ${TRACKING_FORMATS[key].example}).`,
      );
    }
    out[key] = normalised;
  }
  return compact(out);
}

export const LABELS: Record<keyof typeof TRACKING_FORMATS, string> = {
  ga4: 'Google Analytics 4',
  gtm: 'Google Tag Manager',
  metaPixel: 'Meta Pixel',
  clarity: 'Microsoft Clarity',
  linkedin: 'LinkedIn Insight Tag',
  googleAds: 'Google Ads',
};

/** The tags the site renders: each ID re-checked, since it goes into a script. */
export function trackingTags(): SeoTracking {
  const t = seoTracking();
  return compact<SeoTracking>({
    ga4: validId('ga4', t.ga4),
    gtm: validId('gtm', t.gtm),
    metaPixel: validId('metaPixel', t.metaPixel),
    clarity: validId('clarity', t.clarity),
    linkedin: validId('linkedin', t.linkedin),
    googleAds: validId('googleAds', t.googleAds),
    headCode: t.headCode || '',
    bodyCode: t.bodyCode || '',
  });
}

/* ---- files ------------------------------------------------------------------ */

/** Served by their own routes, so not addable as extra files. */
export const RESERVED_FILES = ['robots.txt', 'sitemap.xml', 'llms.txt'];

/** Root-level names, or under .well-known/, with an extension we can serve. */
export const FILE_PATH =
  /^(\.well-known\/)?[A-Za-z0-9][A-Za-z0-9._-]{0,120}\.(txt|xml|html|json|webmanifest)$/;

export const FILE_TYPES: Record<string, string> = {
  txt: 'text/plain; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  html: 'text/html; charset=utf-8',
  json: 'application/json; charset=utf-8',
  webmanifest: 'application/manifest+json; charset=utf-8',
};

const MAX_FILE = 500_000;

export function cleanFiles(value: unknown): SeoFiles {
  const r = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const text = (v: unknown) =>
    typeof v === 'string' && v.trim() ? v.replace(/\r\n/g, '\n').slice(0, MAX_FILE) : undefined;

  const sitemap = text(r.sitemap);
  if (
    sitemap &&
    !/^\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<(urlset|sitemapindex)\b/.test(sitemap)
  ) {
    throw new SeoInputError(
      'The custom sitemap.xml must be a sitemap: it should start with <?xml …?> and a <urlset> or <sitemapindex>.',
    );
  }

  const robotsDisallow = str(r.robotsDisallow, 4000)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^\/[^\s]*$/.test(l))
    .slice(0, 100)
    .join('\n');

  const seen = new Set<string>();
  const extra: SeoExtraFile[] = [];
  for (const raw of Array.isArray(r.extra) ? r.extra.slice(0, 50) : []) {
    const f = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const path = str(f.path, 140).replace(/^\/+/, '');
    const content = text(f.content) ?? '';
    if (!path && !content) continue;
    if (!FILE_PATH.test(path)) {
      throw new SeoInputError(
        `"${path || '(no name)'}" is not a file name the site can serve. Use letters, numbers, dots, dashes or underscores, ending in .txt, .xml, .html, .json or .webmanifest (optionally inside .well-known/).`,
      );
    }
    if (RESERVED_FILES.includes(path.toLowerCase())) {
      throw new SeoInputError(`${path} has its own box at the top of this page.`);
    }
    if (seen.has(path.toLowerCase()))
      throw new SeoInputError(`There are two files called ${path}.`);
    seen.add(path.toLowerCase());
    extra.push({ path, content });
  }

  return compact<SeoFiles>({
    robots: text(r.robots),
    sitemap,
    llms: text(r.llms),
    robotsDisallow,
    extra: extra.length ? extra : undefined,
  });
}
