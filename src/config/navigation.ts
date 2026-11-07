import { applications } from '@/content/data/homepage';

export interface NavMegaMenuItem {
  label: string;
  href: string;
  /** One line under the label in a dropdown. Optional: an item may be name-only. */
  description?: string;
  /** Thumbnail shown beside the label in a dropdown (path under /public). */
  image?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Present when the item opens a dropdown rather than navigating directly. */
  items?: NavMegaMenuItem[];
}

export interface FooterLinkColumn {
  heading: string;
  links: { label: string; href: string }[];
}

/**
 * THE navigation source. There is exactly one, and `arch:check` enforces that.
 *
 * Before this file, the same links existed in four incompatible shapes:
 * `LINKS` in SiteNav, `COLUMNS` in ContactPageFooter, `footerColumns` in
 * lib/data/content.ts, and the mega menus here. They had already drifted —
 * /contact was missing from the header entirely. Adding a route is now one edit.
 */

/**
 * Where each application's page lives, and the photo its menu entry and card
 * show. Keyed by slug from `applications.items` in content/data/homepage.ts —
 * the six applications are listed there once and every surface (menu, homepage
 * cards, the /applications/[slug] pages) is built from that list.
 */
export const applicationHref = (slug: string) => `/applications/${slug}`;

export const applicationImages: Record<string, { src: string; alt: string }> = {
  residential: {
    src: '/media/images/storysection3.png',
    alt: 'A timber-framed house raised on PEN nodes, their nails splayed into the ground beneath it',
  },
  commercial: {
    src: '/media/images/homepage/devagiri-library.png',
    alt: 'A library at night, its cylindrical reading tower lit from within',
  },
  'eco-resorts-and-farmstays': {
    src: '/media/images/homepage/pen-installed_image.png',
    alt: 'A PEN node installed at ground level, its nails driven into leaf-covered soil',
  },
  'modular-and-prefab': {
    src: '/media/images/homepage/startup-ecoashram.png',
    alt: 'A curved-roof pavilion raised on a light frame among trees',
  },
  'low-span-industrial': {
    src: '/media/images/brick-house.png',
    alt: 'A steel and masonry structure standing on completed PEN foundations at a Kerala site',
  },
  'ground-mounted-solar': {
    src: '/media/images/storysection2.png',
    alt: 'Aerial view of a cleared plot set out with string lines, paddy fields either side',
  },
};

/**
 * Primary navigation, in display order. An item is a dropdown when it has
 * `items`, and a plain link otherwise.
 *
 * Home · About · Technology · Applications ▾ · Projects · Resources ▾ · Contact.
 * Applications lists the six applications, each to its own page; Resources
 * holds Blogs, Docs, Certifications and Gallery.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Technology', href: '/technology' },
  {
    label: 'Applications',
    href: '/#applications',
    items: applications.items.map((item) => ({
      label: item.title,
      href: applicationHref(item.slug),
      image: applicationImages[item.slug]?.src,
    })),
  },
  { label: 'Projects', href: '/projects' },
  {
    label: 'Resources',
    href: '/blogs',
    items: [
      { label: 'Blogs', href: '/blogs', description: 'Notes from the engineering journal' },
      { label: 'Docs', href: '/docs', description: 'Technical documentation and downloads' },
      {
        label: 'Certifications',
        href: '/certifications',
        description: 'Listed in the GRIHA Product Catalogue',
      },
      { label: 'Gallery', href: '/gallery', description: 'Projects, installs and testing on site' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

/**
 * Call-to-action buttons in the header pill.
 *
 * HANDOFF, header CTA: "Request Assessment. On smaller screens, retain a clear
 * Call button and the project-assessment CTA." The phone button beside these in
 * `SiteHeader` is that Call control, so the pill now carries the one CTA the
 * handoff names rather than the previous Demo / Contact pair — Contact has its
 * own primary-nav entry now, and "Demo" was never language this document uses.
 */
export const navActions = [
  { label: 'Request Assessment', href: '/contact#contact-form', emphasis: 'primary' },
] as const;

/**
 * Footer link columns. Moved out of lib/data/content.ts, where the contact
 * page's author never found them and hardcoded a second set instead.
 *
 * HANDOFF specifies three groups — "Explore: Home / About / Engineering /
 * Applications. Evidence: Projects / Research / Gallery. Connect: Contact /
 * Phone / Email / LinkedIn / YouTube." Only the first two are link columns
 * here: the footer renders this array into a two-column grid, and its Connect
 * group already exists as `footerContact` plus the social row below it. Adding
 * a third column would have put one item on its own row under the other two.
 */
export const footerColumns: FooterLinkColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Technology', href: '/technology' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Applications',
    links: applications.items.map((item) => ({
      label: item.title,
      href: applicationHref(item.slug),
    })),
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blogs', href: '/blogs' },
      { label: 'Docs', href: '/docs' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
];

/** Direct-contact block in the footer. */
export const footerContact = {
  heading: 'Reach Us',
  prompt: 'Ready to build? Let’s talk about your next project.',
  /** The prompt is a link in the footer — this is where it goes. */
  promptHref: '/contact',
  phone: '+91 7356177577',
  phoneNote: 'Give us a call today.',
} as const;

/**
 * Closing call to action, now owned by the site footer.
 *
 * HANDOFF's footer headline and support line, replacing copy carried over from
 * the About page's old `FooterCta` banner. The headline is one of the phrases
 * that document asks to be repeated deliberately across the site to build
 * memory — it also closes the hero scrub, which is the point: the visitor meets
 * it at the top of the page and again at the bottom of every route.
 */
export const footerCta = {
  title: 'From soil we rise. Faster. Stronger. Greener.',
  /** HANDOFF footer support line, verbatim. Sits under the headline. */
  support:
    'Patented foundation technology for suitable low-rise construction, engineered to install faster and disturb the land less.',
  label: 'Request a Project Assessment',
  href: '/contact#contact-form',
} as const;

/** Recognition block beside the footer logo. */
export const footerBadge = {
  title: 'Engineering Recognition',
  lines: ['Patented System', 'Pre-Engineered Foundations', 'Research Validated'],
} as const;

/** Secondary link under the copyright line. */
export const footerSecondaryLink = {
  label: 'Research & Documentation',
  href: '/blogs',
} as const;
