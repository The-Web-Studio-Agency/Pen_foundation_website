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
import { cms } from '@/lib/cms/store';

/** In-page anchors. The nav and the CTAs both point at these. */
export const anchors = {
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

/* ---- 1 · opening: 3D hero, then the scroll-driven film ------------------- --- */

const _openingV2Default = {
  /** The film's first beat is the page headline, so it is set here once. */
  /** Small label above the headline, after a short lime rule. */
  kicker: siteConfig.name,
  heading: hero.sequence[0].lines,
  cta: { label: 'Request Assessment', href: ASSESSMENT_HREF },
  /** Bottom-left support: the organisation's own one-sentence description. */
  support: [siteConfig.description],
  scrollLabel: 'Scroll to discover',
  dragLabel: 'Drag to rotate',
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
   * The six-beat script is written against hero.mp4's six equal shots. Shot
   * one's words are the page headline, already on screen above, so the film
   * starts `skipSeconds` in and opens straight on beat two: the rest of shot
   * one plays under beat two's caption, and every later caption keeps its shot.
   */
  film: {
    src: assets.heroFilm.src,
    // A still of the film at `skipSeconds`, so the picture shown before the
    // video loads (and with reduced motion) is the frame the film opens on.
    // Re-capture it if `skipSeconds` changes.
    poster: '/media/images/homepage/hero-film-start.webp',
    label: 'From the factory to the ground',
    /** Equal shots the source film is cut into. */
    sourceShots: hero.sequence.length,
    /** The opening seconds of the film that are never shown. */
    skipSeconds: 9,
    /**
     * Caption order over the five shots, as indexes into `hero.sequence`.
     * Reordered from the script's 1-2-3-4-5: "Zero excavation" now comes
     * fourth, after "30 days of construction" and "Hours, not weeks". The
     * footage keeps its own order; only the captions move.
     */
    beats: [1, 3, 4, 2, 5].map((i) => ({ lines: hero.sequence[i].lines })),
  },
};
/** Editable in the admin (/web-admin). */
export const openingV2 = cms('home.opening', _openingV2Default);

/* ---- 2 · full-bleed statement over the site film ------------------------- --- */

const _statementV2Default = {
  /** The tagline, on one line beside the lime bar. */
  kicker: siteConfig.tagline,
  /** Looping band of large grey type behind the pill as it arrives. */
  marquee: 'Pre-Engineered Nail Foundation',
  text: `${statement.before}${statement.emphasis}${statement.after}`,
  film: assets.siteFilm,
  /**
   * The five product highlights, each a card above a dot, spread across the
   * frame (percentages of the screen: dot centre). Alternate dots sit a little
   * higher so the row reads as markers on the site rather than a table.
   * Titles and bodies are the product highlights, unchanged.
   */
  hotspots: product.highlights.map((item, i) => ({
    x: 12 + i * 19,
    y: i % 2 ? 44 : 52,
    label: item.title,
    body: item.body,
  })),
  /**
   * The measured figure, bottom right beside the statement, drawn as a range
   * on a 1× to 3× scale. Moved here from the former install-film section.
   */
  stat: {
    title: 'Enhancement Factor',
    caption: 'Field plate load tests · NIT Calicut',
    value: '2.0–2.6×',
    unit: 'SBC',
    from: 2.0,
    to: 2.6,
    scale: [1, 3] as const,
  },
};
/** Editable in the admin (/web-admin). */
export const statementV2 = cms('home.why', _statementV2Default);

/* ---- 3 · applications ---------------------------------------------------- --- */

const _applicationsV2Default = {
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
/** Editable in the admin (/web-admin). */
export const applicationsV2 = cms('home.applications', _applicationsV2Default);

/* ---- 4 · the problem (light collage) ------------------------------------ --- */

const _problemV2Default = {
  chip: 'The problem',
  /**
   * The handoff headline, trimmed to its claim (same figure, same subject):
   * "Three weeks of your programme are spent waiting for concrete to cure".
   */
  heading: 'Three weeks spent waiting for concrete to cure.',
  /** The handoff's problem paragraph, its first two sentences verbatim. */
  sub: whyPen.intro.split('. ').slice(0, 2).join('. ') + '.',
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
/** Editable in the admin (/web-admin). */
export const problemV2 = cms('home.problem', _problemV2Default);

/* ---- 5 · process --------------------------------------------------------- --- */

const _processV2Default = {
  chip: 'Our process',
  heading: howItWorks.heading,
  lead: howItWorks.lead,
  steps: howItWorks.steps,
};
/** Editable in the admin (/web-admin). */
export const processV2 = cms('home.process', _processV2Default);

/* ---- 6 · projects -------------------------------------------------------- --- */

const _projectsV2Default = {
  chip: 'Projects',
  heading: proof.heading,
  projects: proof.projects,
  cta: proof.cta,
};
/** Editable in the admin (/web-admin). */
export const projectsV2 = cms('home.projects', _projectsV2Default);

/* ---- 7 · validation ------------------------------------------------------ --- */

const _validationV2Default = {
  chip: 'Validation',
  heading: builtBy.heading,
  /** The handoff's credibility-strip supporting line, verbatim. */
  lead: logoWall.note,
  logos: validationLogos,
  supportersLabel: 'Supported by',
  supporters: partners.flatMap((p) =>
    p.logo ? [{ src: p.logo, alt: p.fullName ?? p.name, onDark: Boolean(p.onDark) }] : [],
  ),
};
/** Editable in the admin (/web-admin). */
export const validationV2 = cms('home.validation', _validationV2Default);

/* ---- 8 · FAQ ------------------------------------------------------------ --- */

const _faqV2Default = {
  chip: 'FAQ',
  heading: 'Questions engineers ask first',
  body: faq.body,
  tabs: faq.tabs,
  cta: { label: faq.cta.label, href: ASSESSMENT_HREF },
};
/** Editable in the admin (/web-admin). */
export const faqV2 = cms('home.faq', _faqV2Default);

/* ---- 8b · ask an AI assistant ------------------------------------------ --- */

const ASK_PROMPT = 'How is PEN Foundation useful for me?';

/**
 * Opens Claude or ChatGPT with the question already typed. Both accept the
 * prompt as a `q` parameter on their web address; on phones with the app
 * installed, the system may open that link in the app instead.
 */
const _askAiV2Default = {
  chip: 'Ask AI',
  heading: 'Ask your AI assistant about PEN',
  lead: 'Open Claude or ChatGPT with this question ready to send.',
  prompt: ASK_PROMPT,
  assistants: [
    { label: 'Ask Claude', href: `https://claude.ai/new?q=${encodeURIComponent(ASK_PROMPT)}` },
    { label: 'Ask ChatGPT', href: `https://chatgpt.com/?q=${encodeURIComponent(ASK_PROMPT)}` },
  ],
};
/** Editable in the admin (/web-admin). */
export const askAiV2 = cms('home.askAi', _askAiV2Default);

/* ---- 9 · closing CTA + footer ------------------------------------------ --- */

const _closingV2Default = {
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
/** Editable in the admin (/web-admin). */
export const closingV2 = cms('global.footer', _closingV2Default);
