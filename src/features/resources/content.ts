import type { CarouselSection, FaqTab, FeaturedGrid, Testimonial } from '@/types/contact';

/**
 * Content for the /resources route.
 *
 * TODO(content): every string below is clone copy for a yard-logistics product
 * called "PEN FOUNDATION" — datasheets, ROI calculators, gate-camera videos, a
 * competitive comparison against yard-management systems, and a testimonial
 * attributed to a named person at a named company. None of it describes PEN
 * Foundation and none of it may ship publicly. It was moved here verbatim,
 * unedited, so the layouts and interactions are preserved while the words are
 * rewritten. Replace before this route is linked from anywhere public.
 *
 * Moved out of content/data/contact.ts when these sections left /contact.
 */

export const videoGrid: FeaturedGrid = {
  eyebrow: 'Videos',
  title: 'See the platform in action',
  cards: [
    {
      category: 'video',
      title: 'Introducing computer vision for the yard',
      href: '#',
      image: {
        src: '/media/images/contact/resource-01.svg',
        alt: 'Placeholder video thumbnail',
      },
      actionLabel: 'Watch now',
    },
    {
      category: 'video',
      title: 'Multiple lane detection at the gate',
      excerpt: 'How one camera reads several lanes of traffic at once.',
      href: '#',
      image: {
        src: '/media/images/contact/resource-02.svg',
        alt: 'Placeholder video thumbnail',
      },
      actionLabel: 'Watch now',
    },
    {
      category: 'video',
      title: 'Gate entry, start to finish',
      excerpt: 'A full check-in captured end to end without a clipboard.',
      href: '#',
      image: {
        src: '/media/images/contact/resource-03.svg',
        alt: 'Placeholder video thumbnail',
      },
      actionLabel: 'Watch now',
    },
  ],
};

export const exploreGrid: FeaturedGrid = {
  title: 'Explore more ways to get started',
  body: "Choose the path that fits your timeline — learn, explore, or connect when you're ready.",
  titleFirst: true,
  cards: [
    {
      category: 'blog',
      title:
        "Explore insights from 2000+ operations leaders on what's working and where teams are investing",
      href: '#',
      image: {
        src: '/media/images/contact/resource-04.svg',
        alt: 'Placeholder report cover',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'case-study',
      title: 'A distribution network cut average trailer dwell time by a third in one quarter',
      excerpt: 'What changed operationally, and which numbers moved first.',
      href: '#',
      image: {
        src: '/media/images/contact/resource-05.svg',
        alt: 'Placeholder case study cover',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'webinar',
      title: 'Lights-Out Yard, Episode 4 — cameras, action',
      excerpt: 'A live walkthrough of an unattended gate, recorded on site.',
      href: '#',
      image: {
        src: '/media/images/contact/resource-06.svg',
        alt: 'Placeholder webinar cover',
      },
      actionLabel: 'Watch now',
    },
  ],
};

export const comparisonCarousel: CarouselSection = {
  eyebrow: 'Competitive comparison',
  title: 'Check out how PEN FOUNDATION stacks up vs. the competition',
  cards: [
    {
      category: 'blog',
      title: 'PEN FOUNDATION vs. legacy yard management',
      excerpt:
        'PEN FOUNDATION is a purpose-built, AI-native operating layer that provides end-to-end…',
      href: '#',
      image: {
        src: '/media/images/contact/carousel-01.svg',
        alt: 'Placeholder aerial photograph of a road',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'blog',
      title: 'PEN FOUNDATION vs. bolt-on ERP modules',
      excerpt: 'PEN FOUNDATION is a purpose-built, AI-native operating layer that provides…',
      href: '#',
      image: {
        src: '/media/images/contact/carousel-02.svg',
        alt: 'Placeholder aerial photograph of a road',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'blog',
      title: 'PEN FOUNDATION vs. manual gate processes',
      excerpt: 'PEN FOUNDATION is a purpose-built, AI-native operating layer that provides…',
      href: '#',
      image: {
        src: '/media/images/contact/carousel-03.svg',
        alt: 'Placeholder aerial photograph of a road',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'blog',
      title: 'PEN FOUNDATION vs. camera-only deployments',
      excerpt: 'PEN FOUNDATION is a purpose-built, AI-native operating layer that provides…',
      href: '#',
      image: {
        src: '/media/images/contact/carousel-04.svg',
        alt: 'Placeholder aerial photograph of a road',
      },
      actionLabel: 'Read more',
    },
    {
      category: 'blog',
      title: 'PEN FOUNDATION vs. in-house tooling',
      excerpt: 'PEN FOUNDATION is a purpose-built, AI-native operating layer that provides…',
      href: '#',
      image: {
        src: '/media/images/contact/carousel-05.svg',
        alt: 'Placeholder aerial photograph of a road',
      },
      actionLabel: 'Read more',
    },
  ],
};

export const faqIntro = {
  title: 'FAQs',
  body: 'Here are the most common questions teams have before getting started with PEN FOUNDATION.',
};

export const faqTabs: FaqTab[] = [
  {
    id: 'core-technology',
    label: 'Core Technology',
    entries: [
      {
        question: 'What does PEN FOUNDATION actually do?',
        answer:
          'PEN FOUNDATION is an operating layer for the yard. It uses computer vision to watch what is happening from gate to dock, then decides and executes the next move instead of waiting for someone to type it in.',
      },
      {
        question: 'How is this different from a traditional yard management system?',
        answer:
          'Traditional systems are digital clipboards that record what already happened. PEN FOUNDATION is an operating system that sees what is happening now and orchestrates what needs to happen next.',
      },
      {
        question: 'What does autonomous decision-making mean here?',
        answer:
          'Routine calls — which door a trailer goes to, which spotter takes the move, when a gate can release — are made automatically against your rules. Your team only sees the exceptions.',
      },
      {
        question: 'How accurate is the data captured by the system?',
        answer:
          'Identification accuracy sits in the high nineties on standard installs, and every reading is timestamped with the frame it came from so anything unusual can be checked by a person.',
      },
      {
        question: 'Can we manage multiple sites from a single login?',
        answer:
          'Yes. Sites roll up into one view with shared rules and per-site overrides, so a network operations team and a single yard manager can work from the same system.',
      },
    ],
  },
  {
    id: 'value',
    label: 'Value',
    entries: [
      {
        question: 'How is PEN FOUNDATION priced?',
        answer:
          'Pricing is per site and scales with the number of gates and doors you cover. There is no per-seat charge, so everyone who needs visibility can have it.',
      },
      {
        question: 'What kind of return can I expect?',
        answer:
          'Most teams see the first measurable change in detention and dwell time within a quarter. We size the opportunity with your own numbers before you commit to anything.',
      },
      {
        question: 'How does it reduce carrier and facility costs?',
        answer:
          'Shorter gate queues and fewer misplaced trailers cut detention charges directly, and better dock sequencing reduces the overtime spent recovering a bad afternoon.',
      },
      {
        question: 'Can it help with regulatory compliance?',
        answer:
          'Every gate event is captured with imagery and a timestamp, which gives you a defensible record without anyone maintaining a separate log.',
      },
      {
        question: 'Who is it best suited for?',
        answer:
          'Operations that move enough volume for yard decisions to matter — typically sites handling a few hundred trailer moves a week or more.',
      },
      {
        question: 'Is this a stable long-term partner?',
        answer:
          'The platform is backed by long-term investors and deployed across multi-year contracts with enterprise networks.',
      },
    ],
  },
  {
    id: 'implementation',
    label: 'Implementation',
    entries: [
      {
        question: 'How fast can we go live?',
        answer:
          'A single site typically goes from kickoff to live in weeks, not quarters. The gate usually comes online first because it delivers the clearest early signal.',
      },
      {
        question: 'Does it integrate with our existing systems?',
        answer:
          'Yes. PEN FOUNDATION reads from and writes back to the systems you already run, so it adds a layer rather than replacing what works.',
      },
      {
        question: 'Do we need to buy proprietary cameras?',
        answer:
          'No. Standard IP cameras work. If you already have coverage at the gate, that hardware is usually enough to start.',
      },
      {
        question: 'Is the platform modular or all-or-nothing?',
        answer:
          'Modular. Teams commonly start with gate management and add dock and yard modules once the first workflow is running.',
      },
      {
        question: "What happens if a site's internet goes down?",
        answer:
          'Edge processing continues locally and buffers events, then reconciles automatically once the connection returns. Nothing is lost.',
      },
      {
        question: 'How is our data protected?',
        answer:
          'Data is encrypted in transit and at rest, access is role-scoped, and imagery retention is configurable per site to match your own policy.',
      },
    ],
  },
  {
    id: 'site-operations',
    label: 'Site Operations',
    entries: [
      {
        question: 'What changes for the team on the ground?',
        answer:
          'Drivers stop waiting for a manual check-in and spotters stop guessing which move is next. Most of the change is work that quietly disappears.',
      },
      {
        question: 'How much training does it take?',
        answer:
          'The gate and spotter workflows are designed to be learned in a single shift. Supervisors typically need a half day on the reporting views.',
      },
      {
        question: 'Does it work at night or in bad weather?',
        answer:
          'Yes. Models are trained on low-light and adverse-weather footage, and confidence scores flag anything the system is unsure about.',
      },
      {
        question: 'What if a reading is wrong?',
        answer:
          'Low-confidence events are routed to a person with the source frame attached, so a correction takes seconds and feeds back into the model.',
      },
      {
        question: 'Can we keep our existing yard rules?',
        answer:
          'Your rules are the configuration. PEN FOUNDATION enforces the process you already run, consistently, instead of imposing a new one.',
      },
      {
        question: 'How do we measure whether it is working?',
        answer:
          'Dwell time, gate throughput and trailer location accuracy are tracked from day one, with a baseline captured before go-live.',
      },
    ],
  },
];

export const testimonial: Testimonial = {
  logo: {
    src: '/media/images/contact/review-logo.svg',
    alt: 'Placeholder peer review platform logo',
  },
  rating: 5,
  headline: '“Immediate efficiency gains and consistent long-term platform value”',
  body: 'Our overall experience has been excellent. The solution is intuitive, dependable, and well-suited to complex, real world use …',
  ctaLabel: 'See review',
  ctaHref: '#',
};
