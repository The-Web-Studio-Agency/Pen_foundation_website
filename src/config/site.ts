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
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/cdisctechnologiespvtltd/' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/cdisc_technologies_pvt.ltd/' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/cdisc.technologies' },
    { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@CDISCTechnologiesPvtLtd' },
    { id: 'x', label: 'X', href: 'https://x.com/CdiscL60792' },
  ],

  /** Site credit, shown in the footer's bottom row. */
  credit: {
    prefix: 'Designed & Developed by',
    label: 'TWS (The Web Studio)',
    href: 'https://thewebstudio.agency',
  },
} as const;

export type SiteConfig = typeof siteConfig;
