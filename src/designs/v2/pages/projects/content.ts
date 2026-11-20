/**
 * Copy for /projects and /projects/[slug].
 *
 * Nothing factual is written here — the same rule as `designs/v2/content.ts`.
 * Projects and case studies are the same thing: /projects lists every project
 * once, merged from two existing sources:
 *
 *   PROJECTS  `content/data/projects.ts` — projects with a slug and a page
 *             under /projects/[slug].
 *   proof     `content/data/homepage.ts` — the named projects the homepage
 *             carousel shows. Listed too, without a link, until they get a
 *             page; one that already has a page (see PROOF_PAGES) is listed
 *             once, under its page.
 *
 * This file adds only UI labels and the helpers that keep unfilled
 * placeholders ("[Year]", "[Region]", …) off the page.
 */

import { applicationHref } from '@/config/navigation';
import { storyFor } from '@/content/data/case-studies';
import { applications, proof } from '@/content/data/homepage';
import { PROJECTS, type Project } from '@/content/data/projects';

import { assets } from '../../assets';
import { cms } from '@/lib/cms/store';

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

/** One card on /projects, whichever source the project came from. */
export interface ProjectListItem {
  key: string;
  name: string;
  tag: string;
  location?: string;
  image?: { src: string; alt: string };
  /** Set when the project has its own page. */
  href?: string;
  figures: { label: string; value: string }[];
  /** Shown in place of figures when there are none. */
  summary?: string;
}

/** Homepage proof projects that already have a page, by proof name → slug. */
const PROOF_PAGES: Record<string, string> = {
  'Black Langur Resort': 'black-langur-retreat',
  'Devagiri College Library': 'devagiri-library-book-tower',
};

export function projectItem(project: Project): ProjectListItem {
  return {
    key: project.slug,
    name: project.name,
    tag: project.industry,
    location: filled(project.location),
    image: project.image,
    href: projectHref(project.slug),
    figures:
      project.cardFigures ??
      [
        { label: caseStudyLabels.figures.duration, value: filled(project.installDuration) },
        { label: caseStudyLabels.figures.capacity, value: filled(project.capacity) },
        { label: caseStudyLabels.figures.concrete, value: filled(project.concreteSaved) },
      ].filter((f): f is { label: string; value: string } => Boolean(f.value)),
  };
}

/**
 * Every project, once: projects with a full story first, then the homepage's
 * named projects that have no page yet, then the remaining short case studies.
 */
function allProjects(): ProjectListItem[] {
  const withStory = PROJECTS.filter((p) => storyFor(p.slug));
  const rest = PROJECTS.filter((p) => !storyFor(p.slug));
  const proofOnly = proof.projects
    .filter((p) => !PROOF_PAGES[p.name])
    .map((p): ProjectListItem => ({
      key: p.name,
      name: p.name,
      tag: p.application,
      location: p.location,
      image: p.image,
      figures: [],
      summary: p.result,
    }));
  return [...withStory.map(projectItem), ...proofOnly, ...rest.map(projectItem)];
}

/**
 * The application page each case-study industry belongs to. Keys are
 * `Project['industry']`, values are slugs in `applications.items`.
 */
const industryToApplication: Record<Project['industry'], string> = {
  Residential: 'residential',
  Commercial: 'commercial',
  // The site already pictures Commercial with the Devagiri library.
  Institutional: 'commercial',
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

/* ---- /projects/[slug] ---------------------------------------------------- */

const _caseStudyLabelsDefault = {
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
/** Editable in the admin (/web-admin). */
export const caseStudyLabels = cms('projects.labels', _caseStudyLabelsDefault);

/* ---- /projects ----------------------------------------------------------- */

const _projectsIndexDefault = {
  hero: {
    kicker: 'Projects',
    title: proof.heading,
    image: assets.brickHouse,
    actions: [ASSESSMENT, { label: 'All projects', href: '#all-projects', tone: 'ghost' as const }],
  },
  list: {
    chip: 'Projects',
    heading: 'Projects already in the ground',
    items: allProjects(),
  },
  applications: {
    chip: 'Applications',
    heading: applications.heading,
    lead: applications.lead,
    items: applications.items.map((a) => ({ title: a.title, href: applicationHref(a.slug) })),
    note: applications.note,
  },
};
/** Editable in the admin (/web-admin). */
export const projectsIndex = cms('projects.page', _projectsIndexDefault);
