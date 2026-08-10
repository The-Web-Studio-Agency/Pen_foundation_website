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
 * Every item is currently a plain link. Home used to open a mega menu of `/#`
 * section anchors; it was removed on request, so the header now goes to four
 * whole pages and nothing expands. The dropdown branch is deliberately kept in
 * `NavItem`, `SiteHeader` and `MobileNavPanel` — it is data-driven, so adding
 * `items` back to any entry restores it with no component change.
 *
 * The routes not listed here — Engineering, Research, Gallery, Contact —
 * stay reachable from `footerColumns` below, which is this same single source.
 *
 * NOTE(content): `/resources` is linked from the header on request, but it is
 * still `noIndex`'d and its sections still carry the Terminal Industries clone
 * copy they were ported with (computer vision, gate lanes — see
 * `features/resources/content.ts`). It is the one header destination that is
 * not yet about PEN. Give it PEN's own words, then drop the `noIndex` in
 * `app/resources/page.tsx` and the `Disallow` in `app/robots.ts`.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources', href: '/resources' },
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
      // Points at the homepage section, not `/applications`: that route renders
      // an empty `<section aria-hidden />` placeholder, so the footer was
      // sending visitors to a blank white page. The homepage section is the
      // real content, and it is where the header's Applications item goes too.
      { label: 'Applications', href: '/#applications' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Projects', href: '/projects' },
      { label: 'Research', href: '/research' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
      // TODO(content): /resources is reachable from the header (see primaryNav)
      // but stays out of the footer while it still carries clone copy and is
      // noIndex'd. Uncomment once it has PEN's own words.
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
  phone: '+91 7356177577',
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
