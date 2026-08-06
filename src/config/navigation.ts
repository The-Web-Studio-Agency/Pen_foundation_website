export interface NavMegaMenuItem {
  label: string;
  href: string;
  description: string;
}

export interface NavMegaMenu {
  label: string;
  items: NavMegaMenuItem[];
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

/** Header mega-menus, in display order. */
export const navMenus: NavMegaMenu[] = [
  {
    label: 'Engineering',
    items: [
      {
        label: 'Overview',
        href: '/engineering',
        description:
          'Understand the engineering principles behind PEN Foundation and how it redefines modern foundation systems.',
      },
      {
        label: 'Biomimetic Design',
        href: '/engineering#biomimicry',
        description:
          'Discover how nature-inspired engineering influenced the design philosophy of PEN Foundation.',
      },
      {
        label: 'Product Anatomy',
        href: '/engineering#anatomy',
        description:
          'Explore every component of the PEN Foundation system and its structural purpose.',
      },
      {
        label: 'Installation',
        href: '/engineering#installation',
        description:
          'Follow the complete installation process from site preparation to construction readiness.',
      },
      {
        label: 'Load Transfer',
        href: '/engineering#load-transfer',
        description:
          'Visualize how structural loads are transferred efficiently through the engineered foundation system.',
      },
      {
        label: 'Soil Interaction',
        href: '/engineering#soil',
        description:
          'Learn how PEN Foundation interacts with different soil conditions and distributes structural forces.',
      },
      {
        label: 'Structural Connections',
        href: '/engineering#connections',
        description:
          'Explore RCC and steel connection systems designed for multiple construction methods.',
      },
      {
        label: 'Engineering Validation',
        href: '/engineering#validation',
        description:
          'Review testing, simulations, and technical validation supporting the PEN Foundation system.',
      },
    ],
  },

  {
    label: 'Applications',
    items: [
      {
        label: 'Residential Buildings',
        href: '/applications#residential',
        description: 'Foundation solutions for independent homes and residential developments.',
      },
      {
        label: 'Commercial Buildings',
        href: '/applications#commercial',
        description:
          'Efficient foundation systems for offices, retail spaces, and mixed-use developments.',
      },
      {
        label: 'Industrial Facilities',
        href: '/applications#industrial',
        description:
          'Engineered foundation solutions for industrial and manufacturing environments.',
      },
      {
        label: 'Resorts & Hospitality',
        href: '/applications#hospitality',
        description:
          'Construction-friendly foundation systems for hospitality and eco-sensitive projects.',
      },
      {
        label: 'Infrastructure',
        href: '/applications#infrastructure',
        description: 'Applications for public infrastructure and large-scale engineering projects.',
      },
      {
        label: 'Special Projects',
        href: '/applications#special',
        description:
          'Explore additional construction scenarios where PEN Foundation provides unique advantages.',
      },
    ],
  },

  {
    label: 'Projects',
    items: [
      {
        label: 'Featured Projects',
        href: '/projects',
        description:
          'Explore completed projects demonstrating the real-world implementation of PEN Foundation.',
      },
      {
        label: 'Residential Projects',
        href: '/projects?category=residential',
        description: 'Case studies showcasing residential foundation installations.',
      },
      {
        label: 'Commercial Projects',
        href: '/projects?category=commercial',
        description: 'Commercial construction projects built using PEN Foundation.',
      },
      {
        label: 'Hospitality Projects',
        href: '/projects?category=hospitality',
        description: 'Hospitality developments utilizing innovative foundation engineering.',
      },
      {
        label: 'Construction Process',
        href: '/projects#construction',
        description: 'Visual walkthroughs documenting installation and construction progress.',
      },
      {
        label: 'Project Gallery',
        href: '/gallery',
        description: 'Images and videos from active and completed PEN Foundation installations.',
      },
    ],
  },

  {
    label: 'Research',
    items: [
      {
        label: 'Testing & Validation',
        href: '/research#testing',
        description:
          'Explore engineering tests and field validation carried out on PEN Foundation.',
      },
      {
        label: 'Technical Papers',
        href: '/research#papers',
        description: 'Engineering publications and technical documentation.',
      },
      {
        label: 'Simulation',
        href: '/research#simulation',
        description: 'Finite element analysis and engineering simulations supporting the design.',
      },
      {
        label: 'Certifications',
        href: '/research#certifications',
        description: 'Review certifications, recognition, and supporting documentation.',
      },
      {
        label: 'Downloads',
        href: '/research#downloads',
        description: 'Access brochures, datasheets, manuals, and technical resources.',
      },
      {
        label: 'Knowledge Centre',
        href: '/research/articles',
        description: 'Engineering articles and educational resources on modern foundation systems.',
      },
    ],
  },
];

/**
 * Header links that are plain destinations rather than mega-menus.
 * Rendered after the menus, in order.
 */
export const navDirectLinks = [{ label: 'About', href: '/about' }] as const;

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
