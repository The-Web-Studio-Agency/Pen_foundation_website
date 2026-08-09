import type { ValuesContent } from '@/types/values';

/**
 * "Our Value" — the commercial case for PEN, stated in three figures-first
 * cards.
 *
 * Every number below already appears elsewhere in this codebase with its
 * source attached; nothing here is new, derived or rounded up:
 *
 *   ~2 h / point, 21 days curing, 2–3 m³ spoil, Enhancement Factor 2.0–2.6×
 *     — content/data/homepage.ts (`whyPen`, `capabilitySteps`), from BRIEF's
 *       core-claims table and technical specification.
 *   Over 80% less concrete
 *     — content/data/homepage.ts (`capabilitySteps`), BRIEF core claims.
 *   106 kg CO₂ per point
 *     — lib/calculator/savings.ts, IKEA Foundation case study.
 *   650+ units deployed
 *     — content/data/homepage.ts (`proof`), DECK traction slide.
 *
 * The eyebrow matches the one `proof` already uses, because it is the same
 * argument told twice at different lengths.
 */
export const values: ValuesContent = {
  eyebrow: 'Our Value',
  heading: 'The foundation stops being the thing your programme waits for.',
  intro:
    'A cast-in-situ footing has to be dug, formed, poured and then left alone for 21 days before anything can be built on it. PEN Foundation is driven in about two hours, carries structural load immediately, and moves no soil at all — which changes the programme, the spoil bill and the carbon line at the same time.',
  cards: [
    {
      id: 'speed',
      glyph: 'speed',
      title: 'Load-bearing the day it goes in',
      body: 'Driven, not poured. There is no formwork to strike and no curing window to schedule around, so the frame can follow the foundation crew across the site instead of waiting three weeks behind it.',
      proofPoints: [
        { value: '~2 h', label: 'per foundation point' },
        { value: '0 days', label: 'of curing' },
      ],
    },
    {
      id: 'ground',
      glyph: 'ground',
      title: 'The ground is left where it is',
      body: 'Four battered nails transfer load through skin friction, so soil stratification and groundwater flow survive the install. The resulting enhancement factor is field-validated at NIT Calicut.',
      proofPoints: [
        { value: '2–3 m³', label: 'of spoil avoided' },
        { value: '2.0–2.6×', label: 'SBC enhancement' },
      ],
    },
    {
      id: 'material',
      glyph: 'material',
      title: 'Less concrete, and you get it back',
      body: 'The system carries the same loads on a fraction of the material, and its components are recoverable at end of life rather than buried in the ground they were poured into.',
      proofPoints: [
        { value: '80%+', label: 'less concrete' },
        { value: '106 kg', label: 'CO₂ avoided per point' },
      ],
    },
  ],
};
