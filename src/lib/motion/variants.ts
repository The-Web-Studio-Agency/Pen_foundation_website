import type { Variants } from 'framer-motion';

import { EASE_OUT_EXPO, EASE_OUT_SOFT } from './easing';
import { duration, stagger } from './durations';

/**
 * Every scroll-reveal in the site resolves to one of these.
 *
 * Variants live here rather than next to the components that use them so a
 * ported page can be normalized onto the house motion by swapping an import,
 * not by rewriting keyframes.
 */

/** The default: content lifts into place. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: EASE_OUT_EXPO } },
};

/** Shorter travel, for dense content and list items. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: EASE_OUT_EXPO } },
};

/** No travel — for media and anything already in position. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: EASE_OUT_SOFT } },
};

/** Lateral entrance, for panels beside a column of text. */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: duration.base, ease: EASE_OUT_EXPO } },
};

/** Height accordion — pairs with `initial`/`animate`/`exit`. */
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 'auto',
    opacity: 1,
    transition: { duration: duration.fast, ease: EASE_OUT_EXPO },
  },
};

/** Parent that sequences its children. Children supply their own variant. */
export function staggerContainer(gap: number = stagger.base): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: stagger.tight } },
  };
}

export const variants = { rise, fadeUp, fadeIn, slideInRight, collapse } as const;

export type VariantName = keyof typeof variants;
