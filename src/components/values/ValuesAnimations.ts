import { duration, EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Geometry and timing for the "Our Value" cards.
 *
 * The three silhouettes are transcribed from the reference section and are the
 * one thing here that cannot be derived: each card has its own arrangement of
 * notches, and the set only reads as a family because the notch depths agree.
 * Full measurements in
 * docs/research/clones/terminal-industries.com/what-is-terminal-yos/components/values-section.spec.md.
 */

/**
 * The border overlay's coordinate space. `preserveAspectRatio="none"` stretches
 * it to whatever box the card ends up at, so corner radii distort with the
 * card's aspect ratio — that is the reference's behaviour, kept deliberately.
 */
export const CARD_VIEWBOX = { width: 730, height: 531 } as const;

/**
 * Border outlines, in `CARD_VIEWBOX` user units. Index matches card order.
 *
 * Card 0 notches on the top-left and indents the left edge, card 1 mirrors it,
 * card 2 puts a pair of notches on the top edge and steps the right. Pointing
 * the cuts in different directions is what stops three stacked cards reading as
 * one repeated shape.
 */
export const CARD_BORDER_PATHS = [
  'M717.999 0.5H237.774L200.635 23.7734L200.513 23.8506H12C5.64876 23.8506 0.5 28.9993 0.5 35.3506V196.47L20.8203 218.169L20.9551 218.312V374.771L20.834 374.911L0.5 398.497V518.88C0.5 525.231 5.6487 530.38 12 530.38H718C724.351 530.38 729.5 525.231 729.5 518.88V218.51H729.499V12C729.499 5.64873 724.35 0.5 717.999 0.5Z',
  'M12.001 0.5H492.226L529.365 23.7734L529.487 23.8506H718C724.351 23.8506 729.5 28.9993 729.5 35.3506V196.47L709.18 218.169L709.045 218.312V374.771L709.166 374.911L729.5 398.497V518.88C729.5 525.231 724.351 530.38 718 530.38H12C5.64873 530.38 0.5 525.231 0.5 518.88V218.51H0.500977V12C0.500977 5.64873 5.6497 0.5 12.001 0.5Z',
  'M729.355 518.999V261.108L706.065 220.302L706 220.187V12C706 5.6487 700.851 0.5 694.5 0.5H334.501L312.799 22.8135L312.651 22.9648H156.132L155.987 22.8281L132.399 0.5H12C5.64888 0.5 0.500198 5.64887 0.5 12V519C0.5 525.351 5.6487 530.5 12 530.5H132.599L312.44 530.499H717.855C724.207 530.499 729.355 525.35 729.355 518.999Z',
] as const;

/**
 * The same three silhouettes in `objectBoundingBox` units, for the `clip-path`
 * that cuts the card's own box. Expressed separately rather than scaled from
 * the paths above because `clipPathUnits="objectBoundingBox"` needs 0–1
 * coordinates and the browser will not do that conversion for us.
 */
export const CARD_CLIP_PATHS = [
  'M0.984 0.001H0.326L0.275 0.045L0.275 0.045H0.016C0.008 0.045 0.001 0.055 0.001 0.067V0.37L0.029 0.411L0.029 0.411V0.706L0.029 0.706L0.001 0.751V0.977C0.001 0.989 0.008 0.999 0.016 0.999H0.984C0.992 0.999 0.999 0.989 0.999 0.977V0.412H0.999V0.023C0.999 0.011 0.992 0.001 0.984 0.001Z',
  'M0.016 0.001H0.674L0.725 0.045L0.725 0.045H0.984C0.992 0.045 0.999 0.055 0.999 0.067V0.37L0.972 0.411L0.972 0.411V0.706L0.972 0.706L0.999 0.751V0.977C0.999 0.989 0.992 0.999 0.984 0.999H0.016C0.008 0.999 0.001 0.989 0.001 0.977V0.412H0.001V0.023C0.001 0.011 0.008 0.001 0.016 0.001Z',
  'M0.999 0.977V0.492L0.967 0.415L0.967 0.415V0.023C0.967 0.011 0.96 0.001 0.952 0.001H0.458L0.428 0.043L0.428 0.043H0.214L0.214 0.043L0.181 0.001H0.016C0.008 0.001 0.001 0.011 0.001 0.023V0.978C0.001 0.989 0.008 0.999 0.016 0.999H0.182L0.428 0.999H0.984C0.992 0.999 0.999 0.989 0.999 0.977Z',
] as const;

/** How many distinct card silhouettes exist. Cards past this wrap around. */
export const CARD_SHAPE_COUNT = CARD_BORDER_PATHS.length;

/**
 * Seconds for the travelling highlight to complete one lap.
 *
 * Measured off the reference rather than chosen: its dash offset drifts at
 * 305.9 px/s around a ~2497-unit path, which is 8.16s a lap.
 */
export const COMET_LAP_SECONDS = 8.16;

/**
 * Length of the lit segment, in path units — the reference runs 24.97 of ~2497,
 * almost exactly 1%. Expressed as a fraction so it stays right if a future card
 * shape has a different perimeter.
 */
export const COMET_TRAIL_FRACTION = 0.01;

/** The short dark tick that rides just ahead of the highlight, in path units. */
export const COMET_TICK_LENGTH = 12;

/** Blur radius of the highlight's glow, in path units. */
export const COMET_GLOW_DEVIATION = 17;

/** Static border: 1.5px at 20% of the site dark, per the reference. */
export const BORDER_STROKE_WIDTH = 1.5;
export const BORDER_STROKE_OPACITY = 0.2;

/** The border draws itself on once as the card arrives. */
export const borderDraw = {
  hidden: { pathLength: 0 },
  show: {
    pathLength: 1,
    transition: { duration: duration.cinematic * 1.4, ease: EASE_OUT_EXPO },
  },
} as const;

/** The card's own arrival — short travel, house curve. */
export const cardEnter = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: EASE_OUT_EXPO },
  },
} as const;
