import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

/**
 * The one place page metadata is built.
 *
 * Before this existed, five of nine routes shipped with the root layout's
 * title because a `'use client'` page cannot export `metadata` at all. Routing
 * every page through one factory means title formatting, Open Graph and
 * canonical URLs can never drift per-page again.
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

export function createMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  noIndex = false,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const absoluteImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    // Next applies `title.template` to CHILD segments only, never to the segment
    // that declares it — so the homepage (same segment as the root layout) would
    // otherwise render a bare title with no brand. Make it absolute there.
    title: path === '/' ? { absolute: `${siteConfig.name} | ${title}` } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [absoluteImage],
    },
  };
}

/** Root metadata. Its title template is what lets pages pass a bare title. */
export const rootMetadata: Metadata = {
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
