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
 * Every item is a plain link. The dropdown branch is deliberately kept in
 * `NavItem`, `SiteHeader` and `MobileNavPanel` — it is data-driven, so adding
 * `items` back to any entry restores it with no component change.
 *
 * SET BY HANDOFF, replacing the four-item flat nav: "Home / Engineering /
 * Applications / Projects / Research / About / Contact. Gallery may sit under
 * Resources. Use 'Projects' as the visible term instead of the vague label
 * 'Works'." Applications and Projects point at homepage sections rather than
 * routes — `/applications` is still an empty `noIndex` stub, and the homepage
 * section is the real content — so the header never lands on a blank page.
 *
 * `/resources` is NO LONGER in the header. It was linked here on request, but
 * the handoff's nav does not include it and its sections still carry the
 * Terminal Industries clone copy they were ported with (computer vision, gate
 * lanes — see `features/resources/content.ts`). Leaving it out of the header
 * while it is still `noIndex`'d is the consistent position. Give it PEN's own
 * words, then relink it, drop the `noIndex` in `app/resources/page.tsx` and the
 * `Disallow` in `app/robots.ts`, and hang Gallery under it as the handoff
 * suggests.
 */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Engineering', href: '/engineering' },
  { label: 'Applications', href: '/#applications' },
  // The homepage `Proof` section, not the `/projects` route — asked for: the
  // header should move you down the page rather than navigate away from it.
  // `SectionShell` renders that section with `id="projects"` and
  // `scroll-mt-nav`, so the anchor lands it below the fixed pill.
  //
  // `/projects` is NOT dead: it is still routed, still in the sitemap, still
  // linked from the footer and from this section's own "See all projects" CTA.
  // Only the header stopped pointing at it.
  { label: 'Projects', href: '/#projects' },
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
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
      { label: 'Engineering', href: '/engineering' },
      // Points at the homepage section, not `/applications`: that route renders
      // an empty `<section aria-hidden />` placeholder, so the footer was
      // sending visitors to a blank white page. The homepage section is the
      // real content, and it is where the header's Applications item goes too.
      { label: 'Applications', href: '/#applications' },
    ],
  },
  {
    // Renamed from "Resources" on HANDOFF's grouping. These three routes are
    // the evidence trail — deployments, testing and the visual record — and
    // calling the group that says what it is for.
    heading: 'Evidence',
    links: [
      { label: 'Projects', href: '/projects' },
      { label: 'Research', href: '/research' },
      { label: 'Gallery', href: '/gallery' },
      // TODO(content): /resources stays out of the header AND the footer while
      // it still carries clone copy and is noIndex'd. HANDOFF suggests hanging
      // Gallery under it once it is real. Uncomment then.
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
  href: '/research',
} as const;
