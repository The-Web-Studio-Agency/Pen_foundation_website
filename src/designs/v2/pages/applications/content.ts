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
import { applications, howItWorks, product } from '@/content/data/homepage';

import { assets } from '../../assets';
import { ASSESSMENT, projectsForApplication } from '../projects/content';

export type ApplicationItem = (typeof applications.items)[number];

export const applicationSlugs = applications.items.map((item) => item.slug);

export function findApplication(slug: string): ApplicationItem | undefined {
  return applications.items.find((item) => item.slug === slug);
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
