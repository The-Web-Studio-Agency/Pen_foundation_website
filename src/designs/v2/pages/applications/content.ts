/**
 * Copy for /applications/[slug].
 *
 * Each application has only a title and one paragraph of its own
 * (`applications.items` in content/data/homepage.ts). The rest of each page is
 * existing, sourced copy shared by all six — the product highlights, the
 * four-step process and the suitability note — plus the case studies whose
 * industry matches. Nothing here is new copy except UI labels.
 */

import { applicationHref, applicationImages } from '@/config/navigation';
import { applicationAudiences } from '@/content/data/application-audiences';
import { applications, faq, howItWorks, product } from '@/content/data/homepage';

import { cms } from '@/lib/cms/store';

import { assets } from '../../assets';
import { ASSESSMENT, projectsForApplication } from '../projects/content';

export type ApplicationItem = (typeof applications.items)[number];

export const applicationSlugs = applications.items.map((item) => item.slug);

export function findApplication(slug: string): ApplicationItem | undefined {
  return applications.items.find((item) => item.slug === slug);
}

/** A homepage FAQ entry by its question, so these never drift from it. */
function homeFaq(question: string) {
  for (const tab of faq.tabs) {
    const hit = tab.entries.find((entry) => entry.question === question);
    if (hit) return hit;
  }
  throw new Error(`FAQ entry not found: ${question}`);
}

/**
 * FAQs for the applications whose V3 audience page brings none. The first
 * question is answered with the application's own paragraph; the rest are
 * homepage FAQ entries chosen for the application, verbatim. ("How do I get
 * a price?" is left out: its answer points to a form these pages do not have.)
 */
const APPLICATION_FAQ: Record<string, { heading: string; opener: string; picks: string[] }> = cms(
  'applications.faq',
  {
    commercial: {
      heading: 'Questions about commercial projects',
      opener: 'Why use PEN on a commercial project?',
      picks: [
        'How long does installation take?',
        'Is it suitable for permanent structures?',
        'What code governs the design?',
        'Does it count towards green building credit?',
      ],
    },
    'eco-resorts-and-farmstays': {
      heading: 'Questions about eco-resorts and farmstays',
      opener: 'Why use PEN for an eco-resort or farmstay?',
      picks: [
        'Is excavation required?',
        'Does the site need water or heavy plant?',
        'What soil conditions is it suitable for?',
        'Does it count towards green building credit?',
      ],
    },
    'modular-and-prefab': {
      heading: 'Questions about modular and prefab',
      opener: 'Why use PEN under modular and prefab buildings?',
      picks: [
        'Why is it called “pre-engineered”?',
        'Is it suitable for permanent structures?',
        'How long does installation take?',
        'How many units will my project need?',
      ],
    },
    'low-span-industrial': {
      heading: 'Questions about industrial sheds',
      opener: 'Why use PEN for sheds and light industrial buildings?',
      picks: [
        'What loads can it carry, and how is that verified?',
        'What code governs the design?',
        'How long does installation take?',
        'What soil conditions is it suitable for?',
      ],
    },
    'ground-mounted-solar': {
      heading: 'Questions about ground-mounted solar',
      opener: 'Is PEN available for ground-mounted solar today?',
      picks: [
        'What is PEN Foundation?',
        'Is excavation required?',
        'Does the site need water or heavy plant?',
        'What soil conditions is it suitable for?',
      ],
    },
  },
);

function applicationFaq(item: ApplicationItem) {
  const audience = applicationAudiences[item.slug];
  const hasOwn = audience
    ? [...audience.before, ...audience.after].some((block) => block.kind === 'faq')
    : false;
  const plan = APPLICATION_FAQ[item.slug];
  if (hasOwn || !plan) return null;
  return {
    chip: 'FAQ',
    heading: plan.heading,
    cta: { label: 'Ask an engineer directly', href: ASSESSMENT.href },
    entries: [
      { question: plan.opener, answer: item.body },
      ...plan.picks.map((question) => homeFaq(question)),
    ],
  };
}

/** Ground-mounted solar is published as an application under development. */
const UNDER_DEVELOPMENT = new Set(['ground-mounted-solar']);

export function applicationPage(item: ApplicationItem) {
  const underDevelopment = UNDER_DEVELOPMENT.has(item.slug);
  return {
    hero: {
      kicker: underDevelopment ? 'Application under development' : 'Applications',
      title: item.title,
      lead: item.body,
      image: applicationImages[item.slug] ?? assets.installedCloseUp,
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Applications', href: '/#applications' },
        { label: item.title },
      ],
      actions: [ASSESSMENT],
    },
    suitability: {
      chip: 'Suitability',
      // HANDOFF claims-control: repeat near specifications and forms.
      note: applications.note,
    },
    highlights: {
      chip: 'Why PEN',
      heading: product.heading,
      lead: product.lead,
      items: product.highlights,
    },
    process: {
      chip: 'Process',
      heading: howItWorks.heading,
      lead: howItWorks.lead,
      steps: howItWorks.steps,
    },
    /** Null where the page already carries its V3 audience FAQ. */
    faq: applicationFaq(item),
    related: {
      chip: 'Case studies',
      heading: 'Related projects',
      items: projectsForApplication(item.slug),
      all: { label: 'All projects', href: '/projects' },
    },
    others: {
      chip: 'Applications',
      heading: 'Other applications',
      items: applications.items
        .filter((other) => other.slug !== item.slug)
        .map((other) => ({
          title: other.title,
          body: other.body,
          href: applicationHref(other.slug),
          image: applicationImages[other.slug] ?? assets.installedCloseUp,
        })),
    },
  };
}
