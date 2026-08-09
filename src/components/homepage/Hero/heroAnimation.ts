/**
 * The reveal maths, kept pure so the timing can be read and tuned without
 * touching the DOM plumbing.
 *
 * Model, measured off the reference:
 *
 *   The pinned scroll range is split evenly between the headings. Inside its
 *   own window each heading runs two left-to-right waves — one that reveals
 *   characters, one that erases them again — and the character under the
 *   reveal front is the only one mid-fade at any moment.
 */

/** Fraction of a heading's window before its first character appears. */
export const REVEAL_START = 0.12;
/** Fraction by which its last character has landed. */
export const REVEAL_END = 0.7;
/** Fraction at which the erase wave sets off. */
export const ERASE_START = 0.76;
/** Fraction by which the heading has fully cleared. */
export const ERASE_END = 0.94;

/**
 * Colour a character holds until it has finished revealing.
 *
 * The custom property is set on the section in `hero.module.css`; the literal
 * here is only the fallback, and it is PEN teal-bright — the reference's lime
 * is nowhere in this hero.
 */
export const CHAR_PENDING_COLOR = 'var(--hero-accent, #2fb7c4)';
/** Colour it keeps from then on, including while it erases. */
export const CHAR_REVEALED_COLOR = '#fff';

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Maps overall hero progress onto one heading's own 0→1 window.
 * Headings divide the scrub evenly, in order.
 */
export function headingProgress(progress: number, index: number, count: number) {
  const span = 1 / count;
  return clamp01((progress - index * span) / span);
}

/**
 * How far each wave has travelled through a heading, in characters.
 * Both are plain linear ramps — the reference scrubs, it does not ease, and the
 * softness comes from the damped progress feeding this and from the 0.1s
 * opacity transition on the characters themselves.
 */
function waveFront(local: number, start: number, end: number, total: number) {
  return clamp01((local - start) / (end - start)) * total;
}

export interface CharState {
  opacity: number;
  color: string;
}

/**
 * Resolves one character's state.
 *
 * `revealFront - index` gives the character-local reveal amount, so exactly one
 * character sits between 0 and 1 at a time. Erasing cuts opacity to zero but
 * deliberately leaves the colour white: a character that has already landed
 * must not flash back to the accent as it clears.
 */
export function charState(local: number, index: number, total: number): CharState {
  const revealFront = waveFront(local, REVEAL_START, REVEAL_END, total);
  const revealed = clamp01(revealFront - index);
  const erased = waveFront(local, ERASE_START, ERASE_END, total) > index;

  return {
    opacity: erased ? 0 : revealed,
    color: revealed >= 1 ? CHAR_REVEALED_COLOR : CHAR_PENDING_COLOR,
  };
}

/**
 * Frame-rate independent damping, standing in for the reference's Lenis-smoothed
 * scroll value. `factor` is the share of the remaining distance closed in 16.7ms;
 * the exponent rescales that for whatever the real frame time turned out to be.
 */
export function damp(current: number, target: number, factor: number, deltaMs: number) {
  return target + (current - target) * Math.pow(1 - factor, deltaMs / (1000 / 60));
}
