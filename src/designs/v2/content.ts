/**
 * Copy for the home-v2 concept.
 *
 * NOTHING FACTUAL IS WRITTEN HERE. Every claim, figure and project is imported
 * from the live site's sourced content modules (`content/data/homepage.ts` and
 * friends), whose header explains why figures must stay verbatim — the brief
 * forbids paraphrasing, rounding or upgrading them. This file only:
 *
 *   1. picks which existing copy each concept section shows, and
 *   2. adds UI labels (chips, button text, hotspot tags) — words that name a
 *      section or an action, never a claim.
 *
 * If a figure needs to change, change it at its source and both homepages
 * follow.
 */

import {
  applicationHref,
  applicationImages,
  footerColumns,
  footerContact,
  footerCta,
} from '@/config/navigation';
import { siteConfig } from '@/config/site';
import {
  applications,
  builtBy,
  calculator,
  faq,
  hero,
  homeForm,
  howItWorks,
  logoWall,
  product,
  proof,
  statement,
  validationLogos,
  whyPen,
} from '@/content/data/homepage';
import { partners } from '@/content/data/partners';

import { assets } from './assets';

/** In-page anchors. The nav and the CTAs both point at these. */
export const anchors = {
  system: 'system',
  applications: 'applications',
  process: 'process',
  projects: 'projects',
  validation: 'validation',
  faq: 'faq',
} as const;

const ASSESSMENT_HREF = '/contact#contact-form';

/**
 * Split a paragraph after its first sentence, so the opening sentence can be
 * set as a heading and the rest as body — same words, same order.
 */
function splitFirstSentence(text: string): { first: string; rest: string } {
  const at = text.search(/[.!?]\s/);
  if (at === -1) return { first: text, rest: '' };
  return { first: text.slice(0, at + 1), rest: text.slice(at + 2) };
}

/* ---- 1 · opening: 3D hero, then the scroll-driven film ------------------- */

export const openingV2 = {
  /** The film's first beat is the page headline, so it is set here once. */
  /** Small label above the headline, after a short lime rule. */
  kicker: siteConfig.name,
  heading: hero.sequence[0].lines,
  cta: { label: 'Request Assessment', href: ASSESSMENT_HREF },
  /** Bottom-left support: the organisation's own one-sentence description. */
  support: [siteConfig.description],
  scrollLabel: 'Scroll to discover',
  model: assets.penModel.src,
  /** Centred statement that rises over the model as it grows. */
  statement: {
    chip: siteConfig.name,
    heading: (logoWall.heading ?? '').split(' '),
    sub: splitFirstSentence(product.lead).first,
  },
  /**
   * Callouts cycled over the model. Chips name the part; figures are quoted
   * from the FAQ's materials answer and the product copy, unchanged.
   */
  hud: [
    {
      anchor: 'node',
      chip: 'M50 precast node',
      lines: ['450 × 450 × 200 mm', 'Factory cast and cured'],
    },
    { anchor: 'nail', chip: 'GI nail pipes', lines: ['32 mm OD · 3.2 mm wall', 'Batter 40°–51°'] },
    {
      anchor: 'tip',
      chip: 'Enhancement Factor',
      lines: ['2.0–2.6× SBC', 'Field-validated · NIT Calicut'],
    },
    {
      anchor: 'bolts',
      chip: 'M12 galvanised bolts',
      lines: ['Grade 4.6 · IS 5624', 'Superstructure connection'],
    },
  ] as const,
  /**
   * The six-beat script written against hero.mp4's six shots. Shot one carries
   * no caption: its words are the page headline, already on screen above.
   */
  film: {
    src: assets.heroFilm.src,
    poster: assets.heroFilm.poster,
    label: 'From the factory to the ground',
    beats: hero.sequence.map((beat, i) => ({ lines: i === 0 ? [] : beat.lines })),
  },
};

/* ---- 2 · full-bleed statement over the site film ------------------------- */

export const statementV2 = {
  /** The tagline, on one line beside the lime bar. */
  kicker: siteConfig.tagline,
  /** Looping band of large grey type behind the pill as it arrives. */
  marquee: 'Pre-Engineered Nail Foundation',
  text: `${statement.before}${statement.emphasis}${statement.after}`,
  film: assets.siteFilm,
  /**
   * The three cards and their dots, spread across the top of the frame
   * (percentages of the screen: dot centre). The centre one sits a little
   * higher, as in the layout reference. Titles and bodies are the product
   * highlights, unchanged.
   */
  hotspots: [
    { x: 19, y: 52, label: product.highlights[0].title, body: product.highlights[0].body },
    { x: 50, y: 46, label: product.highlights[1].title, body: product.highlights[1].body },
    { x: 81, y: 52, label: product.highlights[3].title, body: product.highlights[3].body },
  ],
};

/* ---- 3 · glass card + numbered list over the install film --------------- */

export const highlightsV2 = {
  heading: product.heading,
  film: assets.installFilm,
  items: product.highlights,
  card: {
    title: 'Enhancement Factor',
    caption: 'Field plate load tests · NIT Calicut',
    value: '2.0–2.6×',
    unit: 'SBC',
  },
};

/* ---- 4 · applications ---------------------------------------------------- */

export const applicationsV2 = {
  chip: 'Applications',
  heading: applications.heading,
  lead: applications.lead,
  /** All six, in the source order, each with a photo and a link. */
  items: applications.items.map((item) => ({
    ...item,
    image: applicationImages[item.slug] ?? assets.installedCloseUp,
    href: applicationHref(item.slug),
  })),
  note: applications.note,
};

/* ---- 5 · the system (black chapter) ------------------------------------- */

export const systemV2 = {
  chip: 'The system',
  heading: product.heading
    .split('. ')
    .map((line, i, all) => (i < all.length - 1 ? `${line}.` : line)),
  lead: product.lead,
};

export const anatomyV2 = {
  chip: 'Pre-engineered',
  heading: splitFirstSentence(product.body[2].text).first,
  body: splitFirstSentence(product.body[2].text).rest,
  cta: { label: 'Full specification', href: '/technology' },
  render: assets.productRender,
  /**
   * Callouts on the render. Wording is lifted from the FAQ's "What is it made
   * of?" answer; positions are percentages of pen.png.
   */
  tags: [
    { x: 51, y: 20, label: 'M12 galvanised bolts' },
    { x: 50, y: 40, label: 'M50 precast node' },
    { x: 79, y: 56, label: 'GI nail pipes' },
    { x: 17, y: 82, label: 'Tungsten carbide tips' },
  ],
};

export const evidenceV2 = {
  chip: 'Soil-structure interaction',
  heading: splitFirstSentence(product.body[1].text).first,
  body: splitFirstSentence(product.body[1].text).rest,
  cta: { label: 'Estimate your project', href: '/#calculator' },
  stats: [
    { label: 'Enhancement Factor', value: '2.0–2.6×', note: 'of soil bearing capacity' },
    { label: 'Design code', value: 'IS 2911', note: 'Part 4 — Factor of Safety 2.0–2.5' },
    { label: 'Indicative rate', value: '16–20', note: calculator.basis[0] },
  ],
  confirmation: calculator.basis[4],
};

export const manifestoV2 = {
  /** "Zero excavation." / "No curing cycle." from the hero script, sans stops. */
  chips: hero.sequence[2].lines.slice(0, 2).map((line) => line.replace(/\.$/, '')),
  lines: hero.sequence[4].lines,
  film: assets.heroFilm,
};

/* ---- 6 · the problem (light collage) ------------------------------------ */

export const problemV2 = {
  chip: 'The problem',
  heading: whyPen.heading,
  sub: product.body[0].text,
  tiles: {
    excavation: assets.excavation,
    aerial: assets.aerialSetOut,
    rising: assets.structureRising,
    render: assets.productRender,
    contours: assets.contours,
  },
  stat: { label: calculator.programmeLabel, value: calculator.programmeValue },
  /** Two rows of the PEN-vs-conventional comparison, verbatim. */
  facts: [product.comparison.rows[2].feature, product.comparison.rows[3].feature],
  conventionalLabel: 'The conventional way',
};

/* ---- 7 · process --------------------------------------------------------- */

export const processV2 = {
  heading: howItWorks.heading,
  lead: howItWorks.lead,
  steps: howItWorks.steps,
};

/* ---- 8 · projects -------------------------------------------------------- */

export const projectsV2 = {
  chip: 'Projects',
  heading: proof.heading,
  projects: proof.projects,
  cta: proof.cta,
};

/* ---- 9 · validation ------------------------------------------------------ */

export const validationV2 = {
  chip: 'Validation',
  heading: builtBy.heading,
  logos: validationLogos,
  supportersLabel: 'Supported by',
  supporters: partners.flatMap((p) =>
    p.logo ? [{ src: p.logo, alt: p.fullName ?? p.name, onDark: Boolean(p.onDark) }] : [],
  ),
};

/* ---- 10 · FAQ ------------------------------------------------------------ */

export const faqV2 = {
  chip: 'FAQ',
  heading: 'Questions engineers ask first',
  body: faq.body,
  tabs: faq.tabs,
  cta: { label: faq.cta.label, href: ASSESSMENT_HREF },
};

/* ---- 11 · closing CTA + footer ------------------------------------------ */

export const closingV2 = {
  heading: homeForm.titleLines,
  intro: homeForm.intro,
  cta: { label: homeForm.submitLabel, href: ASSESSMENT_HREF },
  /** Set in capitals by CSS: "PEN FOUNDATION". */
  wordmark: siteConfig.name,
  film: assets.siteFilm,
  slogan: footerCta.title,
  columns: footerColumns,
  contact: {
    heading: footerContact.heading,
    phone: footerContact.phone,
    contactHref: footerContact.promptHref,
  },
  social: siteConfig.social,
  credit: siteConfig.credit,
  copyright: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
};
