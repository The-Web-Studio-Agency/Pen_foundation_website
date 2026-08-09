/** Shapes for the "Our Value" section. */

/** One figure in a card's proof list — rendered as a <dt>/<dd> pair. */
export interface ValueProofPoint {
  /** The figure itself, e.g. "~2 h". Kept short: it sets at 36px. */
  value: string;
  /** What the figure measures, e.g. "to install one point". */
  label: string;
}

/** Which of the three line glyphs a card draws. */
export type ValueGlyphName = 'speed' | 'ground' | 'material';

export interface ValueCardContent {
  /** Stable key, also used to namespace the card's SVG ids. */
  id: string;
  title: string;
  body: string;
  glyph: ValueGlyphName;
  /**
   * Two per card in the reference layout. More than two still lays out, but
   * the desktop column was measured against a pair.
   */
  proofPoints: ValueProofPoint[];
}

export interface ValuesContent {
  eyebrow: string;
  heading: string;
  intro: string;
  cards: ValueCardContent[];
}
