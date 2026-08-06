/**
 * Content shapes for the home page.
 *
 * Each interface mirrors one section of the reference layout, so the section
 * order in this file matches the order the sections appear on the page.
 */

/** One of the four headings the hero cross-fades through as you scroll. */
export interface HeroSequenceItem {
  /** Pre-split so the character reveal breaks exactly where the original does. */
  lines: string[];
}

export interface HeroContent {
  sequence: HeroSequenceItem[];
  scrollLabel: string;
}

/** A cell in a logo wall. Multiple entries make the cell cycle through them. */
export interface LogoCell {
  reel: { src: string; alt: string }[];
}

export interface LogoWallContent {
  heading?: string;
  cells: LogoCell[];
}

/**
 * A heading where one phrase is emphasised. The reference renders the emphasis
 * as a `<strong>` inside the heading, and the character reveal runs across both.
 */
export interface StatementContent {
  before: string;
  emphasis: string;
  after: string;
}

export interface CapabilityStep {
  title: string;
  media: { src: string; alt: string };
}

export interface Benefit {
  eyebrow: string;
  /** Rendered as: `title` `emphasis`(strong) `titleAfter` `underline`(underlined). */
  title: string;
  emphasis?: string;
  titleAfter?: string;
  underline?: string;
  body: string;
  media: { src: string; alt: string };
}

/** The section where three letters break out of the sentence into a monogram. */
export interface MonogramContent {
  subTitle: string;
  /** Words of the sentence; letters at `anchorIndexes` fly out to form the monogram. */
  sentence: string;
  /** Indexes into `sentence` of the characters that become the monogram. */
  anchorIndexes: number[];
  monogram: string;
  trademark: string;
}

export interface SectionHeading {
  label: string;
  heading: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface HomeTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image: { src: string; alt: string };
}

export interface HomeFormContent {
  titleLines: [string, string];
  intro: string;
  bullets: string[];
  trustLabel: string;
  logos: { src: string; alt: string }[];
}
