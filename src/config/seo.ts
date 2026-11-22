import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { contentReady } from '@/lib/cms/server';
import { seoPages, seoSite } from '@/lib/seo/settings';

/**
 * The one place page metadata is built.
 *
 * Before this existed, five of nine routes shipped with the root layout's
 * title because a `'use client'` page cannot export `metadata` at all. Routing
 * every page through one factory means title formatting, Open Graph and
 * canonical URLs can never drift per-page again.
 *
 * The SEO team can override any page's title, description, share image and
 * indexing in /web-admin/seo (lib/seo/settings.ts); the values passed in here
 * are the defaults they override. An overridden title is used exactly as
 * typed, with no " | PEN Foundation" added.
 */

interface PageMetadataInput {
  /** Page title WITHOUT the site name — the template appends it. */
  title: string;
  description: string;
  /** Route path, e.g. '/about' or '/projects/kerala-hillside-residence'. */
  path: string;
  /** Share image relative to /public. Falls back to the site default. */
  image?: string;
  /** Set for pages that should not be indexed (thank-you pages, previews). */
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
}

/** What each page would show without the SEO team's overrides. */
export interface PageDefaults {
  title: string;
  description: string;
  image: string;
  noIndex: boolean;
}

const g = globalThis as unknown as { __penSeoDefaults?: Map<string, PageDefaults> };
/** Filled as pages build their metadata; read by the SEO admin. */
export const pageDefaults = (g.__penSeoDefaults ??= new Map());

/** The full <title> a page gets by default. */
const fullTitle = (title: string) => `${title} | ${siteConfig.name}`;

export async function createMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Promise<Metadata> {
  // A cold start: let the saved overrides load before the first page uses them.
  await contentReady();
  const site = seoSite();
  const fallbackImage = site.defaultImage || siteConfig.ogImage;
  pageDefaults.set(path, {
    title: path === '/' ? `${siteConfig.name} | ${title}` : fullTitle(title),
    description,
    image: image ?? fallbackImage,
    noIndex,
  });

  const seo = seoPages()[path] ?? {};
  const shareTitle = seo.title || fullTitle(title);
  const desc = seo.description || description;
  const img = seo.image || image || fallbackImage;
  const hidden = site.hideSite || (seo.noIndex ?? noIndex);

  const url = `${siteConfig.url}${path}`;
  const absoluteImage = img.startsWith('http') ? img : `${siteConfig.url}${img}`;

  return {
    // Next applies `title.template` to CHILD segments only, never to the segment
    // that declares it — so the homepage (same segment as the root layout) would
    // otherwise render a bare title with no brand. Make it absolute there.
    title: seo.title
      ? { absolute: seo.title }
      : path === '/'
        ? { absolute: `${siteConfig.name} | ${title}` }
        : title,
    description: desc,
    alternates: { canonical: url },
    robots: hidden ? { index: false, follow: false } : undefined,
    openGraph: {
      title: shareTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: shareTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: desc,
      images: [absoluteImage],
    },
  };
}

/** Root metadata. Its title template is what lets pages pass a bare title. */
const rootDefaults: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
  },
};

/** Root metadata plus the SEO team's verification codes and site-wide switch. */
export async function rootMetadata(): Promise<Metadata> {
  await contentReady();
  const site = seoSite();
  const other: Record<string, string> = {};
  if (site.bingVerification) other['msvalidate.01'] = site.bingVerification;
  if (site.facebookVerification) other['facebook-domain-verification'] = site.facebookVerification;
  if (site.pinterestVerification) other['p:domain_verify'] = site.pinterestVerification;
  return {
    ...rootDefaults,
    robots: site.hideSite ? { index: false, follow: false } : undefined,
    verification: {
      google: site.googleVerification || undefined,
      yandex: site.yandexVerification || undefined,
      other,
    },
  };
}
