/**
 * Copy for /technology.
 *
 * Same rule as `src/designs/v2/content.ts`: NOTHING FACTUAL IS WRITTEN HERE.
 * Every claim and figure is imported from the sourced content modules
 * (`content/data/specification.ts`, `content/data/homepage.ts`) or carried
 * over verbatim from the page this one replaces (`features/engineering`).
 * This file only picks the copy and adds UI labels — words that name a section
 * or an action, never a claim.
 */

import { specification } from '@/content/data/specification';
import {
  builtBy,
  calculator,
  faq,
  howItWorks,
  product,
  validationLogos,
} from '@/content/data/homepage';

import { assets } from '../../assets';

const ASSESSMENT_HREF = '/contact#contact-form';

/** Look up an FAQ entry by its question, so the page never drifts from the FAQ. */
function faqEntry(question: string) {
  for (const tab of faq.tabs) {
    const hit = tab.entries.find((entry) => entry.question === question);
    if (hit) return hit;
  }
  throw new Error(`FAQ entry not found: ${question}`);
}

/** Split a paragraph after its first sentence — same words, same order. */
function splitFirstSentence(text: string): { first: string; rest: string } {
  const at = text.search(/[.!?]\s/);
  if (at === -1) return { first: text, rest: '' };
  return { first: text.slice(0, at + 1), rest: text.slice(at + 2) };
}

/** Row value from the specification table, by term. */
function spec(term: string) {
  return specification.parts.find((part) => part.term === term)?.spec ?? '';
}

/* ---- hero ----------------------------------------------------------------- */

export const heroT = {
  kicker: 'Technology',
  title: product.heading,
  lead: splitFirstSentence(product.lead).rest,
  image: assets.installedCloseUp,
  actions: [
    { label: 'Request Assessment', href: ASSESSMENT_HREF },
    { label: 'Estimate your project', href: '#calculator' },
  ],
  facts: [
    { label: 'Enhancement Factor', value: '2.0–2.6× SBC' },
    { label: 'Design code', value: 'IS 2911 Part 4' },
    { label: 'Min. embedment', value: spec('Min. embedment').split(' — ')[0] },
    { label: 'Peak load observed', value: spec('Peak load observed').split(' — ')[0] },
  ],
};

/* ---- 01 · anatomy --------------------------------------------------------- */

export const anatomyT = {
  chip: 'Anatomy',
  heading: splitFirstSentence(product.body[2].text).first,
  body: splitFirstSentence(product.body[2].text).rest,
  render: assets.productRender,
  /** Same callouts and positions as the homepage's anatomy panel. */
  tags: [
    { x: 51, y: 20, label: 'M12 galvanised bolts' },
    { x: 50, y: 40, label: 'M50 precast node' },
    { x: 79, y: 56, label: 'GI nail pipes' },
    { x: 17, y: 82, label: 'Tungsten carbide tips' },
  ],
};

/* ---- 02 · specification --------------------------------------------------- */

export const specificationT = {
  chip: 'Specification',
  heading: specification.title,
  parts: specification.parts,
  note: specification.note,
};

/* ---- 03 · load transfer --------------------------------------------------- */

export const loadT = {
  chip: 'Load transfer',
  heading: faqEntry('Where does the capacity gain come from?').question,
  /** The paragraph that contrasts PEN with a pad footing, verbatim. */
  lead: product.body[0].text,
  image: assets.frameOnNodes,
  imageLabel: 'Soil-structure interaction',
  /** Where the measured gain comes from, verbatim. */
  paragraphs: [product.body[1].text],
  soil: faqEntry('What soil conditions is it suitable for?'),
};

/* ---- 04 · installation ---------------------------------------------------- */

export const installT = {
  chip: 'Installation',
  heading: howItWorks.heading,
  lead: howItWorks.lead,
  steps: howItWorks.steps,
};

/* ---- 05 · comparison ------------------------------------------------------ */

export const comparisonT = {
  chip: 'PEN vs. conventional',
  heading: product.comparison.title,
  columns: product.comparison.columns,
  rows: product.comparison.rows,
  note: product.comparison.note,
};

/* ---- 06 · validation ------------------------------------------------------ */

export const validationT = {
  chip: 'Validation',
  heading: builtBy.heading,
  entries: [
    faqEntry('What testing has been done?'),
    faqEntry('What loads can it carry, and how is that verified?'),
    faqEntry('What code governs the design?'),
  ],
  logos: validationLogos,
};

/* ---- 07 · calculator ------------------------------------------------------ */

export const calculatorT = {
  chip: 'Project calculator',
  heading: 'What could your project save?',
  basis:
    'Directional estimate from published PEN assumptions (~2 h/point, 6× faster deployment, ~100 kg CO₂-eq avoided per unit). Actual figures depend on site conditions.',
  disclaimer: calculator.basis[4],
  tag: '0 m³ soil displaced',
  cta: { label: 'Get an exact site assessment', href: ASSESSMENT_HREF },
};

/* ---- 08 · documents ------------------------------------------------------- */

export const documentsT = {
  chip: 'Documents',
  heading: 'Spec sheet, CAD block and test report',
  lead: 'Available on request.',
  /** None of these files is published yet, so every row is a request. */
  items: ['Spec sheet (PDF)', 'CAD block (DWG)', 'Test report (PDF)'],
  href: ASSESSMENT_HREF,
  actionLabel: 'Request',
};
