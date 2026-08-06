import { siteConfig } from '@/config/site';
import type {
  Benefit,
  CapabilityStep,
  HeroContent,
  HomeFormContent,
  HomeTestimonial,
  LogoWallContent,
  MonogramContent,
  SectionHeading,
  StatementContent,
} from '@/types/homepage';

/** The clone carried its own BRAND constant; this project already has one name. */
const BRAND = siteConfig.name;

/**
 * Home page copy. Every string here is placeholder content: it keeps the
 * reference page's information hierarchy, line breaks and roughly its character
 * counts — so the type scale, wrapping and section heights land in the same
 * place — without reusing any of the original's proprietary wording, names or
 * imagery. The company name comes from the shared `BRAND` constant so renaming
 * the site is a one-line change.
 */

export const hero: HeroContent = {
  sequence: [
    { lines: ['We have reimagined the', 'future of logistics'] },
    { lines: ['through the yard.'] },
    {
      lines: [
        'AI-native technology that',
        'turns manual work into',
        'connected, self-driving',
        'missions.',
      ],
    },
    { lines: ['Moving the world by', 'making goods flow.'] },
  ],
  scrollLabel: 'Scroll to explore',
};

/**
 * Twenty cells, each cycling through a pair of marks so the wall keeps swapping
 * the way the original's reels do. Eight generated logos are dealt round-robin.
 */
export const logoWall: LogoWallContent = {
  heading: 'Powering the yards behind the brands you know',
  cells: Array.from({ length: 20 }, (_, index) => ({
    reel: [
      {
        src: `/media/images/homepage/logo-${String((index % 8) + 1).padStart(2, '0')}.svg`,
        alt: 'Placeholder customer logo',
      },
      {
        src: `/media/images/homepage/logo-${String(((index + 3) % 8) + 1).padStart(2, '0')}.svg`,
        alt: 'Placeholder customer logo',
      },
    ],
  })),
};

export const statement: StatementContent = {
  before: 'Imagine the yard as an ',
  emphasis: 'intelligent bridge',
  after: ' seamlessly connecting highway to warehouse.',
};

export const capabilitySteps: CapabilityStep[] = [
  {
    title: 'Autonomous, agentic AI-driven workflows from gate to dock',
    media: {
      src: '/media/images/homepage/capability-01.svg',
      alt: 'Placeholder view of an automated gate lane',
    },
  },
  {
    title: 'Single pane of glass visibility of all yard operations',
    media: {
      src: '/media/images/homepage/capability-02.svg',
      alt: 'Placeholder yard overview dashboard',
    },
  },
  {
    title: 'Managed by a unified platform with AI computer vision',
    media: {
      src: '/media/images/homepage/capability-03.svg',
      alt: 'Placeholder computer-vision detection overlay',
    },
  },
  {
    title: 'Highly configurable to all yards in your network',
    media: {
      src: '/media/images/homepage/capability-04.svg',
      alt: 'Placeholder network configuration map',
    },
  },
  {
    title: 'Unlocked value of your existing WMS/TMS',
    media: {
      src: '/media/images/homepage/capability-05.svg',
      alt: 'Placeholder systems integration diagram',
    },
  },
  {
    title: 'Digitally transformed, data rich, and predictive',
    media: {
      src: '/media/images/homepage/capability-06.svg',
      alt: 'Placeholder predictive analytics panel',
    },
  },
];

/**
 * "Yard Control System" — the Y, C and S break out of the sentence and converge
 * into the YCS monogram. Indexes point at those characters in `sentence`.
 *          0123456789...
 * sentence: "Yard Control System."
 *            ^    ^       ^
 *            0    5      13
 */
export const monogram: MonogramContent = {
  subTitle: "That's the",
  sentence: 'Yard Control System.',
  anchorIndexes: [0, 5, 13],
  monogram: 'YCS',
  trademark: '™',
};

export const benefits: Benefit[] = [
  {
    eyebrow: 'Benefit 01',
    title: 'A single ',
    emphasis: 'solution',
    titleAfter: ' for maximum, automated ',
    underline: 'throughput',
    body: 'Deep integrations anticipate incoming loads, enabling our AI computer vision technology to automate gate check-ins and all critical yard operations: from assigning locations and maintaining real-time visibility to coordinating spotters for efficient load movement. It then closes the loop by validating assets before exit, providing comprehensive performance supervision across your entire yard network',
    media: {
      src: '/media/images/homepage/benefit-01.svg',
      alt: 'Placeholder gate automation visual',
    },
  },
  {
    eyebrow: 'Benefit 02',
    title: 'Easy, scalable ',
    underline: 'operation',
    body: `${BRAND} was designed from the ground up for disruption-free operations. Easy to deploy and support, the system has a low IT lift with no 3rd party devices to support, and a modern UI/UX that's super-easy for operators to use from day one. Configurable to your yard, it integrates seamlessly with most TMS and WMS systems.`,
    media: {
      src: '/media/images/homepage/benefit-02.svg',
      alt: 'Placeholder deployment and scaling visual',
    },
  },
  {
    eyebrow: 'Benefit 03',
    title: 'Rapid, repeatable ',
    underline: 'ROI',
    body: "We know that yard operations run on lean budgets, which is why we price our all-inclusive solution as a service with terms that won't bust the bank. Ready to deploy right away, and rapid to scale over time.",
    media: {
      src: '/media/images/homepage/benefit-03.svg',
      alt: 'Placeholder return-on-investment visual',
    },
  },
];

export const builtBy: SectionHeading = {
  label: 'Built by the Industry',
  heading: 'Built by logistics leaders who want a new industry standard in the yard',
};

export const investorLogos = Array.from({ length: 5 }, (_, index) => ({
  src: `/media/images/homepage/investor-${String(index + 1).padStart(2, '0')}.svg`,
  alt: 'Placeholder investor logo',
}));

export const testimonial: HomeTestimonial = {
  quote:
    '“We have not seen this level of accuracy from computer-vision technology before — it is a genuine milestone in the effort to modernise the yard.”',
  name: 'Alex Moreau',
  role: 'Head of New Product',
  company: 'Placeholder Logistics Group',
  image: {
    src: '/media/images/homepage/testimonial-bg.svg',
    alt: 'Placeholder photograph of a freight vehicle at dusk',
  },
};

export const howItWorks: SectionHeading = {
  label: 'How it Works',
  heading: 'Revolutionary technology that transforms your yard from gate to dock',
  linkLabel: 'Take a closer look',
  linkHref: '#',
};

export const homeForm: HomeFormContent = {
  titleLines: ['Contact us and we will be in touch', 'same day, your way'],
  intro: `Fill out the form, and we'll be happy to discuss how ${BRAND} can help you with your yard of the future:`,
  bullets: ['30-minute demo', 'Needs discovery call', 'Yard ROI assessment'],
  trustLabel: 'Trusted by those in the know.',
  logos: Array.from({ length: 6 }, (_, index) => ({
    src: `/media/images/homepage/logo-${String((index % 8) + 1).padStart(2, '0')}.svg`,
    alt: 'Placeholder customer logo',
  })),
};
