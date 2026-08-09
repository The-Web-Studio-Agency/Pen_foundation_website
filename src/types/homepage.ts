export interface HeroSequenceItem {
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
  /**
   * One supporting line under the heading, saying what the marks below
   * actually represent. Optional — the validation wall renders bare.
   */
  note?: string;
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
  /** An `.mp4` src renders as a muted autoplaying loop, anything else as an image. */
  media: {
    src: string;
    alt: string;
    /**
     * First frame for an `.mp4`, painted while the clip is still inactive or
     * decoding. Video steps carry one so an inactive panel costs a poster
     * rather than a decoded stream; ignored for image steps.
     */
    poster?: string;
  };
}

export interface SectionHeading {
  heading: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface HomeFormContent {
  titleLines: [string, string];
  /** One line under the heading saying what submitting actually gets you. */
  intro: string;
  /** Replaces the form's default "Submit" so the last click names the outcome. */
  submitLabel: string;
}

/**
 * A link rendered in the site's underline-sweep treatment. Every new section
 * ends on one of these, so the shape is shared rather than re-declared.
 */
export interface SectionLinkContent {
  label: string;
  href: string;
}

/**
 * Header shared by the sections added below the fold: heading and lead.
 *
 * There is no eyebrow field. Every section used to open on a short mono label
 * ("THE SYSTEM", "APPLICATIONS") above its heading; they were dropped, so each
 * section now starts on the heading itself.
 */
export interface SectionHeaderContent {
  /** Anchor id, so the header can be linked to from the nav. */
  id: string;
  heading: string;
  lead: string;
}

/**
 * One row of the conventional-versus-PEN comparison.
 *
 * A property either system has or does not, so the cell is a tick or nothing.
 * Rows where BOTH tick are not padding — a matrix where the alternative never
 * scores reads as marketing, and the two rows a conventional footing does win
 * are what make the other seven credible.
 */
export interface ComparisonRow {
  feature: string;
  pen: boolean;
  conventional: boolean;
}

/** "What PEN Foundation is" — the product explanation. */
/**
 * A body paragraph with one phrase of it emphasised.
 *
 * `emphasis` is a verbatim substring of `text`, not a separate string to splice
 * in: the paragraph stays readable as one sentence in the content module, and
 * the renderer finds the span rather than the copy being pre-cut into fragments.
 * A paragraph with no term worth pulling out omits the field.
 */
export interface BodyParagraph {
  text: string;
  /** Rendered as a `<strong>`. Must appear in `text` exactly once. */
  emphasis?: string;
}

export interface ProductContent extends SectionHeaderContent {
  /** Body paragraphs, in order. */
  body: BodyParagraph[];
  /**
   * Four short pairs beside the render — a bold term and one supporting line.
   *
   * Not the technical specification: that is eight rows of tolerances and IS
   * codes and it lives on /engineering. These are the four things worth
   * knowing before a reader decides whether to go and read it.
   */
  highlights: { title: string; body: string }[];
  media: { src: string; alt: string };
  comparison: {
    title: string;
    /** Column headers: [PEN, conventional]. The feature column is unlabelled. */
    columns: [string, string];
    rows: ComparisonRow[];
    /** Sourcing line under the matrix. */
    note: string;
  };
  cta: SectionLinkContent;
}

/** One numbered step in a process list. */
export interface ProcessStep {
  /** Displayed as written — '01', '02' … */
  number: string;
  title: string;
  body: string;
}

/** A numbered process: the project journey, and the post-enquiry sequence. */
export interface ProcessContent extends SectionHeaderContent {
  steps: ProcessStep[];
  cta: SectionLinkContent;
}

export interface ApplicationItem {
  title: string;
  body: string;
}

/** Where PEN applies. Every entry is drawn from the company brochure. */
export interface ApplicationsContent extends SectionHeaderContent {
  items: ApplicationItem[];
  /** The qualifier under the grid — what listing an application does not claim. */
  note: string;
  cta: SectionLinkContent;
}

/** A deployment with a stated challenge and a stated outcome. */
export interface ProofProject {
  name: string;
  location: string;
  application: string;
  challenge: string;
  result: string;
  /**
   * Optional site photograph, painted faintly behind the card's text.
   *
   * Held at a low opacity on purpose: at full strength a photograph behind
   * body copy is unreadable, and a render behind a project's stated result
   * reads as documentary evidence of that project. Faint, it is atmosphere.
   * Only set this where the image actually depicts the project named.
   */
  image?: { src: string; alt: string };
}

/**
 * Deployment evidence: headline figures plus the projects behind them.
 *
 * Declares `id` and `heading` rather than extending `SectionHeaderContent`:
 * this section opens on a centred display heading alone, so it has no `lead`,
 * and carrying a required one would leave copy nobody renders.
 */
export interface ProofContent {
  id: string;
  heading: string;
  projects: ProofProject[];
  cta: SectionLinkContent;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** One category of questions, shown behind a tab. */
export interface FaqTabContent {
  id: string;
  label: string;
  entries: FaqItem[];
}

/**
 * The FAQ block. Shaped for the tabbed two-column treatment /resources
 * already uses: a title and a supporting line on the left, tabs and the
 * accordion on the right.
 */
export interface FaqContent {
  id: string;
  title: string;
  body: string;
  tabs: FaqTabContent[];
  cta: SectionLinkContent;
}

/**
 * The card grid — a centred heading over three square media cards, matching
 * the featured grid on /resources.
 */
export interface InActionContent {
  id: string;
  title: string;
  cards: {
    category: string;
    title: string;
    excerpt: string;
    href: string;
    image: { src: string; alt: string };
    actionLabel: string;
  }[];
}

/** A selectable project type; each scales the per-point rates. */
export interface CalculatorProjectType {
  id: string;
  label: string;
  /** Multiplier applied to the baseline time and cost saved per point. */
  factor: number;
}

/** The homepage time & cost estimator. */
export interface CalculatorContent {
  heading: string;
  body: { lead: string; linkLabel: string; linkHref: string; trail: string };
  parametersTitle: string;
  pointsLabel: string;
  points: { min: number; max: number; step: number; initial: number };
  projectTypes: CalculatorProjectType[];
  /** Small print under the parameters, stating what the model is based on. */
  basis: string[];
  timeLabel: string;
  timeNote: string;
  costLabel: string;
  costNote: string;
  /**
   * The computed carbon card. `title` is gone — the figure is calculated from
   * the slider now, not written down. The trees line is assembled around the
   * computed count so the copy still lives here rather than in the component.
   */
  carbon: {
    label: string;
    treesPrefix: string;
    treesSuffix: string;
    linkLabel: string;
    href: string;
  };
  /** Label and destination only — the estimator's CTA is a bare button. */
  cta: { label: string; href: string };
}

/** The "Why PEN" section. */
export interface WhyPenContent {
  heading: string;
  intro: string;
  link: { label: string; href: string };
}
