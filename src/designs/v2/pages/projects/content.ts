/**
 * Copy for /projects and /projects/[slug].
 *
 * Nothing factual is written here — the same rule as `designs/v2/content.ts`.
 * Projects come from two existing sources:
 *
 *   proof     `content/data/homepage.ts` — the named deployments the homepage
 *             carousel shows, sourced from BRIEF and DECK. No pages of their own.
 *   PROJECTS  `content/data/projects.ts` — the case studies with a slug and a
 *             page under /projects/[slug].
 *
 * This file adds only UI labels and the helpers that keep unfilled
 * placeholders ("[Year]", "[Region]", …) off the page.
 */

import { applicationHref } from '@/config/navigation';
import { applications, proof } from '@/content/data/homepage';
import { PROJECTS, type Project } from '@/content/data/projects';

import { assets } from '../../assets';

export const ASSESSMENT = { label: 'Request Assessment', href: '/contact#contact-form' };

/** True for a source value that is still a bracketed placeholder. */
export function isPlaceholder(value: string | undefined): boolean {
  return !value || /^\s*\[.*\]\s*$/.test(value);
}

/** The value, or undefined while it is still a placeholder. */
export function filled(value: string | undefined): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}

export const projectHref = (slug: string) => `/projects/${slug}`;

/**
 * The application page each case-study industry belongs to. Keys are
 * `Project['industry']`, values are slugs in `applications.items`.
 */
const industryToApplication: Record<Project['industry'], string> = {
  Residential: 'residential',
  Commercial: 'commercial',
  'Eco Resort': 'eco-resorts-and-farmstays',
  Solar: 'ground-mounted-solar',
};

export function applicationForProject(project: Project) {
  const slug = industryToApplication[project.industry];
  const item = applications.items.find((a) => a.slug === slug);
  return item ? { title: item.title, href: applicationHref(item.slug) } : undefined;
}

export function projectsForApplication(slug: string): Project[] {
  return PROJECTS.filter((p) => industryToApplication[p.industry] === slug);
}

/* ---- /projects ----------------------------------------------------------- */

export const projectsIndex = {
  hero: {
    kicker: 'Projects',
    title: proof.heading,
    image: assets.brickHouse,
    actions: [ASSESSMENT, { label: 'Case studies', href: '#case-studies', tone: 'ghost' as const }],
  },
  deployments: {
    chip: 'Deployments',
    // The proof section's own title in homepage.ts.
    heading: 'Projects already in the ground',
    resultLabel: 'Result',
    /** Shown on images whose alt text says they are renders, not site photos. */
    visualisation: 'Visualisation',
    items: proof.projects.map((p) => ({
      ...p,
      image: p.image,
    })),
  },
  caseStudies: {
    chip: 'Deployment explorer',
    heading: 'Case studies',
    items: PROJECTS,
  },
  applications: {
    chip: 'Applications',
    heading: applications.heading,
    lead: applications.lead,
    items: applications.items.map((a) => ({ title: a.title, href: applicationHref(a.slug) })),
    note: applications.note,
  },
};

/* ---- /projects/[slug] ---------------------------------------------------- */

export const caseStudyLabels = {
  crumbs: { home: 'Home', projects: 'Projects' },
  challenge: 'The challenge',
  siteConditions: 'Site conditions',
  approach: 'Engineering approach',
  installation: 'Installation',
  /** "Installed in …" is the sentence the previous case-study page set. */
  installed: (duration: string) => `Installed in ${duration}.`,
  performance: 'Performance',
  lessons: 'Lessons learned',
  downloads: 'Downloads',
  /** Not in the repo, so each row requests the document instead of linking to it. */
  documents: ['Site drawings (PDF)', 'Load report (PDF)'],
  request: 'Request',
  related: 'Related projects',
  application: 'Application',
  allProjects: 'All projects',
  facts: {
    industry: 'Industry',
    location: 'Location',
    foundation: 'Foundation',
    soil: 'Soil',
    year: 'Year',
  },
  figures: {
    duration: 'Install duration',
    capacity: 'Bearing capacity achieved',
    concrete: 'Concrete saved',
    // The previous case study's fourth figure; zero excavation is a sourced
    // product property (homepage `product.highlights`).
    excavated: { label: 'Soil excavated', value: '0 m³' },
  },
};
