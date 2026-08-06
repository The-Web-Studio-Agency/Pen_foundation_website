/**
 * Duration scale, in seconds.
 *
 * A scale rather than free numbers: three sections animating at 0.6s, 0.62s and
 * 0.7s read as sloppy, and no reviewer ever catches it.
 */

export const duration = {
  /** Hover, focus, colour changes. Sub-perceptual. */
  instant: 0.15,
  /** Accordions, chips, small reveals. */
  fast: 0.3,
  /** The default for content entering the viewport. */
  base: 0.6,
  /** Large editorial blocks and display type. */
  slow: 0.9,
  /** Full-section or hero transitions. Use sparingly. */
  cinematic: 1.2,
} as const;

/** Delay between staggered children. */
export const stagger = {
  tight: 0.05,
  base: 0.1,
  loose: 0.18,
} as const;

export type DurationName = keyof typeof duration;
