/**
 * Everything the admin can edit, grouped by page.
 *
 * Each entry names a content object wrapped with `cms()` where it is defined.
 * Importing those modules here registers their defaults (see store.ts), which
 * the admin uses for "reset to original" and for the shape of new items.
 *
 * `collection` entries are lists the admin can add to: blog articles and
 * projects, the only page types that can be created.
 */

import '@/config/navigation';
import '@/config/site';
import '@/content/data/application-audiences';
import '@/content/data/case-studies';
import '@/content/data/contact';
import '@/content/data/gallery';
import '@/content/data/homepage';
import '@/content/data/landing';
import '@/content/data/partner-network';
import '@/content/data/partners';
import '@/content/data/people';
import '@/content/data/projects';
import '@/content/data/research';
import '@/content/data/testimonials';
import '@/content/data/values';
import '@/designs/v2/content';
import '@/designs/v2/pages/about/faq';
import '@/designs/v2/pages/applications/content';
import '@/designs/v2/pages/pageCopy';
import '@/designs/v2/pages/projects/content';
import '@/designs/v2/pages/technology/content';
import '@/features/about';
import '@/features/resources';

import { getDefault } from '@/lib/cms/store';

export interface CmsEntry {
  id: string;
  title: string;
  /** The page group it is listed under. */
  page: string;
  /** Where it shows, for the "View on site" link. */
  path: string;
  hint?: string;
  /** Keys never shown in the form (kept as they are). */
  hidden?: string[];
  /** Lists whose length must not change (each item is tied to something fixed). */
  fixedLength?: string[];
  collection?: {
    /** The field that names the item's page address. */
    key: string;
    /** The field shown as the item's title in lists. */
    titleKey: string;
    /** Address prefix of each item's page. */
    hrefPrefix: string;
    singular: string;
  };
}

export const PAGES = [
  'Site-wide',
  'Home',
  'About',
  'Technology',
  'Applications',
  'Projects',
  'Blogs',
  'Gallery',
  'Partners',
  'Docs & certifications',
  'Contact',
  'Landing page',
] as const;

export const ENTRIES: CmsEntry[] = [
  /* ---- site-wide ---- */
  {
    id: 'global.site',
    title: 'Site settings',
    page: 'Site-wide',
    path: '/',
    hint: 'Name, tagline, description, phone (also the WhatsApp number forms send to), social links and the footer credit.',
    hidden: ['url', 'locale', 'language', 'ogImage'],
  },
  { id: 'global.navigation', title: 'Navbar links', page: 'Site-wide', path: '/' },
  { id: 'global.navActions', title: 'Navbar button', page: 'Site-wide', path: '/' },
  { id: 'global.contact', title: 'Contact details', page: 'Site-wide', path: '/contact' },
  {
    id: 'global.footer',
    title: 'Footer',
    page: 'Site-wide',
    path: '/',
    hint: 'Closing call to action, wordmark, slogan, footer columns and social links.',
  },
  {
    id: 'global.supporters',
    title: 'Supporter logos',
    page: 'Site-wide',
    path: '/about',
    hint: 'Shown on the homepage validation section and the About page.',
  },

  /* ---- home ---- */
  {
    id: 'home.opening',
    title: 'Hero and scroll film',
    page: 'Home',
    path: '/',
    hidden: ['model'],
    fixedLength: ['film.beats', 'hud'],
    hint: 'The film is cut into fixed shots, so its captions can be reworded but not added or removed.',
  },
  {
    id: 'home.why',
    title: 'Why PEN (film section)',
    page: 'Home',
    path: '/',
    fixedLength: ['hotspots'],
  },
  { id: 'home.applications', title: 'Applications', page: 'Home', path: '/#applications' },
  { id: 'home.problem', title: 'The problem', page: 'Home', path: '/' },
  { id: 'home.process', title: 'Our process', page: 'Home', path: '/#process' },
  { id: 'home.projects', title: 'Projects', page: 'Home', path: '/#projects' },
  { id: 'home.validation', title: 'Validation', page: 'Home', path: '/#validation' },
  { id: 'home.estimator', title: 'Project estimator', page: 'Home', path: '/' },
  {
    id: 'home.testimonialsHeading',
    title: 'Testimonials heading',
    page: 'Home',
    path: '/#testimonials',
  },
  { id: 'home.testimonials', title: 'Testimonials', page: 'Home', path: '/#testimonials' },
  { id: 'home.faq', title: 'FAQ', page: 'Home', path: '/#faq' },
  { id: 'home.askAi', title: 'Ask AI', page: 'Home', path: '/' },

  /* ---- about ---- */
  { id: 'about.hero', title: 'Hero', page: 'About', path: '/about' },
  { id: 'about.beginnings', title: 'Where it began', page: 'About', path: '/about' },
  { id: 'about.story', title: 'Story and values', page: 'About', path: '/about' },
  { id: 'about.values', title: 'Our values', page: 'About', path: '/about' },
  { id: 'about.teamIntro', title: 'Team introduction', page: 'About', path: '/about' },
  { id: 'about.team', title: 'Team members', page: 'About', path: '/about' },
  {
    id: 'about.ecosystemIntro',
    title: 'Research & industry ecosystem',
    page: 'About',
    path: '/about',
  },
  { id: 'about.faq', title: 'FAQ', page: 'About', path: '/about' },

  /* ---- technology ---- */
  { id: 'technology.hero', title: 'Hero', page: 'Technology', path: '/technology' },
  {
    id: 'technology.anatomy',
    title: '3D model labels',
    page: 'Technology',
    path: '/technology',
    hidden: ['model'],
    fixedLength: ['hud'],
  },
  {
    id: 'technology.specification',
    title: 'Specification',
    page: 'Technology',
    path: '/technology',
  },
  {
    id: 'technology.soil',
    title: 'Soil-structure interaction',
    page: 'Technology',
    path: '/technology',
  },
  {
    id: 'technology.loadTransfer',
    title: 'Load transfer',
    page: 'Technology',
    path: '/technology',
  },
  { id: 'technology.installation', title: 'Installation', page: 'Technology', path: '/technology' },
  {
    id: 'technology.comparison',
    title: 'PEN vs conventional',
    page: 'Technology',
    path: '/technology',
  },
  { id: 'technology.validation', title: 'Validation', page: 'Technology', path: '/technology' },
  {
    id: 'technology.calculator',
    title: 'Calculator',
    page: 'Technology',
    path: '/technology#calculator',
  },
  { id: 'technology.documents', title: 'Documents', page: 'Technology', path: '/technology' },

  /* ---- applications ---- */
  {
    id: 'applications.items',
    title: 'The six applications',
    page: 'Applications',
    path: '/applications/residential',
    fixedLength: ['items'],
    hint: 'Each application has its own page, so they can be edited but not added or removed.',
  },
  {
    id: 'applications.images',
    title: 'Application photos',
    page: 'Applications',
    path: '/applications/residential',
  },
  {
    id: 'applications.faq',
    title: 'Application FAQs',
    page: 'Applications',
    path: '/applications/commercial',
  },
  {
    id: 'applications.audiences',
    title: 'Residential & modular extras',
    page: 'Applications',
    path: '/applications/residential',
  },

  /* ---- projects ---- */
  {
    id: 'projects.list',
    title: 'Projects',
    page: 'Projects',
    path: '/projects',
    collection: { key: 'slug', titleKey: 'name', hrefPrefix: '/projects/', singular: 'project' },
  },
  { id: 'projects.page', title: 'Projects page', page: 'Projects', path: '/projects' },
  { id: 'projects.labels', title: 'Project page labels', page: 'Projects', path: '/projects' },
  {
    id: 'projects.stories',
    title: 'Case stories (Black Langur, Devagiri)',
    page: 'Projects',
    path: '/projects/black-langur-retreat',
    fixedLength: [''],
  },

  /* ---- blogs ---- */
  {
    id: 'blog.articles',
    title: 'Blog articles',
    page: 'Blogs',
    path: '/blogs',
    collection: { key: 'slug', titleKey: 'title', hrefPrefix: '/blogs/', singular: 'article' },
  },
  { id: 'blog.page', title: 'Blogs page', page: 'Blogs', path: '/blogs' },

  /* ---- gallery ---- */
  { id: 'gallery.page', title: 'Gallery page', page: 'Gallery', path: '/gallery' },
  { id: 'gallery.items', title: 'Gallery entries', page: 'Gallery', path: '/gallery' },
  {
    id: 'gallery.photos',
    title: 'Gallery photos',
    page: 'Gallery',
    path: '/gallery',
    hint: 'Keyed by the gallery entry id (g01, g02 …).',
  },

  /* ---- partners ---- */
  { id: 'partners.network', title: 'Partner network', page: 'Partners', path: '/partners' },
  {
    id: 'partners.photos',
    title: 'Partners photos',
    page: 'Partners',
    path: '/partners',
    fixedLength: ['steps', 'why'],
  },
  { id: 'partners.facts', title: 'Trust figures', page: 'Partners', path: '/partners' },
  {
    id: 'partners.topics',
    title: 'Enquiry form options',
    page: 'Partners',
    path: '/partners#join',
  },

  /* ---- docs & certifications ---- */
  { id: 'docs.page', title: 'Docs page', page: 'Docs & certifications', path: '/docs' },
  { id: 'docs.documents', title: 'Documents', page: 'Docs & certifications', path: '/docs' },
  {
    id: 'certifications.page',
    title: 'Certifications page',
    page: 'Docs & certifications',
    path: '/certifications',
  },
  {
    id: 'certifications.certificate',
    title: 'GRIHA certificate',
    page: 'Docs & certifications',
    path: '/certifications',
  },

  /* ---- contact ---- */
  { id: 'contact.page', title: 'Contact page', page: 'Contact', path: '/contact' },
  { id: 'contact.hero', title: 'Contact copy', page: 'Contact', path: '/contact' },
  {
    id: 'contact.form',
    title: 'Enquiry form fields',
    page: 'Contact',
    path: '/contact#contact-form',
    fixedLength: [''],
    hint: 'Labels, placeholders and options. The fields themselves are fixed.',
  },

  /* ---- landing ---- */
  { id: 'landing.page', title: 'Landing page', page: 'Landing page', path: '/landing-page' },
  {
    id: 'landing.phone',
    title: 'Landing phone number',
    page: 'Landing page',
    path: '/landing-page',
  },
];

export function getEntry(id: string) {
  return ENTRIES.find((entry) => entry.id === id);
}

/** A plain JSON copy of an entry's original value. */
export function defaultsFor(id: string): unknown {
  const value = getDefault(id);
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}
