/**
 * The site's easing curves. This file is the only place a cubic-bezier may be
 * written down — `scripts/check-architecture.mjs` fails the build on easing
 * literals anywhere else.
 *
 * Before this existed the same curve, [0.22, 1, 0.36, 1], was typed by hand in
 * two files and a third used a bare 'easeOut'. Nobody could tell whether the
 * difference was intentional.
 */

/** Decisive entrance: fast start, long settle. The house curve. */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/** Gentle entrance for small elements — accordions, chips, hovers. */
export const EASE_OUT_SOFT = [0.25, 0.46, 0.45, 0.94] as const;

/** Symmetric, for things that move both ways (drawers, carousels). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Physical, for anything the pointer is dragging. */
export const SPRING = { type: 'spring', stiffness: 260, damping: 30 } as const;

export const easing = {
  outExpo: EASE_OUT_EXPO,
  outSoft: EASE_OUT_SOFT,
  inOut: EASE_IN_OUT,
} as const;

export type EasingName = keyof typeof easing;
