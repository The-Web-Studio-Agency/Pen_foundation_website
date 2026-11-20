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
import { cms } from '@/lib/cms/store';

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

/**
 * A white opening built around the 3D model. The heading is the client's;
 * the subheading joins two lines of the product copy, verbatim: the anatomy
 * paragraph's opening sentence and the product heading.
 */
const _heroTDefault = {
  title: 'Our Patented Technology',
  /** Two lines: the anatomy sentence, then the product heading. */
  subheading: [splitFirstSentence(product.body[2].text).first, product.heading],
  facts: [
    { label: 'Enhancement Factor', value: '2.0–2.6× SBC' },
    { label: 'Design code', value: 'IS 2911 Part 4' },
    { label: 'Min. embedment', value: spec('Min. embedment').split(' — ')[0] },
    { label: 'Peak load observed', value: spec('Peak load observed').split(' — ')[0] },
  ],
};
/** Editable in the admin (/web-admin). */
export const heroT = cms('technology.hero', _heroTDefault);

/** A specification row's value, split at its dash into two lines. */
function specLines(term: string): string[] {
  const part = specification.parts.find((row) => row.term === term);
  if (!part) throw new Error(`Specification row not found: ${term}`);
  return part.spec.split(' — ');
}

/* ---- 01 · anatomy --------------------------------------------------------- */

const _anatomyTDefault = {
  render: assets.productRender,
  model: assets.penModel.src,
  dragLabel: 'Drag to rotate',
  /**
   * Callouts pinned on the 3D model, one per part, numbered in this order. Each chip is the part's
   * tag below; its two lines are that part's specification row, split at its
   * dash, word for word.
   */
  hud: (
    [
      ['bolts', 'M12 galvanised bolts', 'Bolts', 'right', 5],
      ['nodeFace', 'M50 precast node', 'Node', 'right', 3],
      ['nailFront', 'GI nail pipes', 'Nail pipes', 'left', 6.5],
      ['tipEnd', 'Tungsten carbide tips', 'Nail tip', 'right', 2.5],
    ] as const
  ).map(([anchor, chip, term, side, rise]) => ({
    anchor,
    chip,
    lines: specLines(term),
    side,
    rise,
  })),
  /** Fallback when WebGL is unavailable: the render with its callouts. */
  tags: [
    { x: 51, y: 20, label: 'M12 galvanised bolts' },
    { x: 50, y: 40, label: 'M50 precast node' },
    { x: 79, y: 56, label: 'GI nail pipes' },
    { x: 17, y: 82, label: 'Tungsten carbide tips' },
  ],
};
/** Editable in the admin (/web-admin). */
export const anatomyT = cms('technology.anatomy', _anatomyTDefault);

/* ---- 02 · specification --------------------------------------------------- */

const _specificationTDefault = {
  chip: 'Specification',
  heading: specification.title,
  parts: specification.parts,
  note: specification.note,
};
/** Editable in the admin (/web-admin). */
export const specificationT = cms('technology.specification', _specificationTDefault);

/* ---- 03 · load transfer --------------------------------------------------- */

const _loadTDefault = {
  chip: 'Load transfer',
  heading: faqEntry('Where does the capacity gain come from?').question,
  /** The paragraph that contrasts PEN with a pad footing, verbatim. */
  lead: product.body[0].text,
  image: assets.frameOnNodes,
  imageLabel: 'Soil-structure interaction',
  /** The mechanism paragraph now lives in `soilT`, just above this section. */
  paragraphs: [] as string[],
  soil: faqEntry('What soil conditions is it suitable for?'),
};
/** Editable in the admin (/web-admin). */
export const loadT = cms('technology.loadTransfer', _loadTDefault);

/** Soil-structure interaction, moved from the homepage system section. */
const _soilTDefault = {
  chip: 'Soil-structure interaction',
  heading: splitFirstSentence(product.body[1].text).first,
  body: splitFirstSentence(product.body[1].text).rest,
  cta: { label: 'Estimate your project', href: '#calculator' },
};
/** Editable in the admin (/web-admin). */
export const soilT = cms('technology.soil', _soilTDefault);

/* ---- 04 · installation ---------------------------------------------------- */

const _installTDefault = {
  chip: 'Installation',
  heading: howItWorks.heading,
  lead: howItWorks.lead,
  steps: howItWorks.steps,
};
/** Editable in the admin (/web-admin). */
export const installT = cms('technology.installation', _installTDefault);

/* ---- 05 · comparison ------------------------------------------------------ */

const _comparisonTDefault = {
  chip: 'PEN vs. conventional',
  heading: product.comparison.title,
  columns: product.comparison.columns,
  rows: product.comparison.rows,
  note: product.comparison.note,
};
/** Editable in the admin (/web-admin). */
export const comparisonT = cms('technology.comparison', _comparisonTDefault);

/* ---- 06 · validation ------------------------------------------------------ */

const _validationTDefault = {
  chip: 'Validation',
  heading: builtBy.heading,
  entries: [
    faqEntry('What testing has been done?'),
    faqEntry('What loads can it carry, and how is that verified?'),
    faqEntry('What code governs the design?'),
  ],
  logos: validationLogos,
};
/** Editable in the admin (/web-admin). */
export const validationT = cms('technology.validation', _validationTDefault);

/* ---- 07 · calculator ------------------------------------------------------ */

const _calculatorTDefault = {
  chip: 'Project calculator',
  heading: 'What could your project save?',
  basis:
    'Directional estimate from published PEN assumptions (~2 h/point, 6× faster deployment, ~100 kg CO₂-eq avoided per unit). Actual figures depend on site conditions.',
  disclaimer: calculator.basis[4],
  tag: '0 m³ soil displaced',
  cta: { label: 'Get an exact site assessment', href: ASSESSMENT_HREF },
};
/** Editable in the admin (/web-admin). */
export const calculatorT = cms('technology.calculator', _calculatorTDefault);

/* ---- 08 · documents ------------------------------------------------------- */

const _documentsTDefault = {
  chip: 'Documents',
  heading: 'Spec sheet, CAD block and test report',
  lead: 'Available on request.',
  /** None of these files is published yet, so every row is a request. */
  items: ['Spec sheet (PDF)', 'CAD block (DWG)', 'Test report (PDF)'],
  href: ASSESSMENT_HREF,
  actionLabel: 'Request',
};
/** Editable in the admin (/web-admin). */
export const documentsT = cms('technology.documents', _documentsTDefault);
