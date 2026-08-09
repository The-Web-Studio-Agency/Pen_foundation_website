export interface NavMegaMenuItem {
  label: string;
  href: string;
  description: string;
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
 * Primary navigation, in display order.
 *
 * One ordered list rather than separate "menus" and "links" arrays: the header
 * used to render every mega-menu first and every plain link after, so ordering
 * was a property of which array an item sat in. An item is a dropdown when it
 * has `items`, and a plain link otherwise.
 *
 * Engineering, Applications, Projects and Research were dropped from the header
 * on request. Their routes still exist and stay reachable from the footer —
 * `footerColumns` below is the same single source, so nothing became orphaned.
 */
export const primaryNav: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    // The homepage now carries the whole sales argument, and a visitor who
    // lands mid-funnel should be able to jump to the part they came for. These
    // are the section anchors on `/` — same `NavItem` shape and the same
    // dropdown the Resources item already uses, so the header is unchanged
    // visually and no new component was needed.
    items: [
      {
        label: 'Technology',
        href: '/#technology',
        description:
          'What the system is: one precast node, four driven nails, and the specification behind them.',
      },
      {
        label: 'Applications',
        href: '/#applications',
        description: 'The project types PEN is engineered and sold for today.',
      },
      {
        label: 'Projects',
        href: '/#projects',
        description: 'Deployments already in the ground, with the challenge and the outcome.',
      },
      {
        label: 'Validation',
        href: '/#validation',
        description: 'The institutes and bodies that tested, mentored and listed the system.',
      },
      {
        label: 'Calculator',
        href: '/#calculator',
        description: 'Estimate the programme time and site cost PEN removes from your project.',
      },
    ],
  },
  { label: 'Works', href: '/projects' },
  {
    label: 'Resources',
    href: '/resources',
    items: [
      {
        label: 'Certificate',
        href: '/resources#certificate',
        description:
          'GRIHA Council certification listing the pre-engineered nail foundation in the GRIHA Product Catalogue.',
      },
      {
        label: 'FAQs',
        href: '/resources#faqs',
        description:
          'Answers to the questions engineers ask most about specification, installation and soil conditions.',
      },
      {
        label: 'Documents',
        href: '/resources#documents',
        description: 'Datasheets, certificates and technical documentation available to download.',
      },
      {
        label: 'Blogs',
        href: '/research',
        description: 'Engineering articles and research notes on modern foundation systems.',
      },
    ],
  },
  { label: 'About', href: '/about' },
];

/** Call-to-action buttons in the header pill. */
export const navActions = [
  { label: 'Demo', href: '/contact#contact-form', emphasis: 'secondary' },
  { label: 'Contact', href: '/contact', emphasis: 'primary' },
] as const;

/** Footer link columns. Moved out of lib/data/content.ts, where the contact
 *  page's author never found them and hardcoded a second set instead. */
export const footerColumns: FooterLinkColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Engineering', href: '/engineering' },
      { label: 'Applications', href: '/applications' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Projects', href: '/projects' },
      { label: 'Research', href: '/research' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
      // TODO(content): /resources still carries clone copy and is noIndex'd.
      // Uncomment once it has PEN's own words.
      // { label: 'Resources', href: '/resources' },
    ],
  },
];

/** Direct-contact block in the footer. */
export const footerContact = {
  heading: 'Reach Us',
  prompt: 'Ready to build? Let’s talk about your next project.',
  /** The prompt is a link in the footer — this is where it goes. */
  promptHref: '/contact',
  phone: '+91 9847434848',
  phoneNote: 'Give us a call today.',
} as const;

/**
 * Closing call to action, now owned by the site footer.
 *
 * This copy comes from the About page's old `FooterCta` banner, which the
 * shared footer replaced — every route ends on this CTA instead of only /about
 * having one.
 */
export const footerCta = {
  title: 'Every great structure begins with a better foundation.',
  label: 'Talk to an Engineer',
  href: '/contact',
} as const;

/** Recognition block beside the footer logo. */
export const footerBadge = {
  title: 'Engineering Recognition',
  lines: ['Patented System', 'Pre-Engineered Foundations', 'Research Validated'],
} as const;

/** Secondary link under the copyright line. */
export const footerSecondaryLink = {
  label: 'Research & Documentation',
  href: '/research',
} as const;
