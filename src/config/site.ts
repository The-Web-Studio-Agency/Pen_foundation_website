/**
 * Single source of truth for who this site is.
 *
 * Anything that describes the organisation rather than a page belongs here:
 * the name used in <title>, the canonical origin used to build absolute URLs
 * for Open Graph, contact details, social handles.
 */

export const siteConfig = {
  name: 'PEN Foundation',
  shortName: 'PEN',
  tagline: 'Pre-Engineered Nail Foundation System',

  /** PEN's own description, from the footer copy in homepage.odt. */
  description:
    'PEN Foundation is a patented pre-engineered foundation system inspired by nature and developed through engineering research to help redefine modern foundation construction.',

  /** Direct contact. Mirrored in the footer via config/navigation.ts. */
  phone: '+91 7356177577',

  /**
   * Canonical origin, no trailing slash. Absolute URLs in metadata are built
   * from this, so it must be correct in production or Open Graph breaks.
   * Override per environment with NEXT_PUBLIC_SITE_URL.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://penfoundation.com',

  locale: 'en_IN',
  language: 'en',

  /** Default social share image, relative to /public. */
  ogImage: '/media/images/shared/og-default.png',

  /** Order here is the order rendered in the footer. */
  social: [
    { label: 'LinkedIn', href: '#' },
    { label: 'X', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
