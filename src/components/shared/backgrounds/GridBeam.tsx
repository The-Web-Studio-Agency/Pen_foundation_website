import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface GridBeamProps {
  /** Seconds for one full pass. Longer reads calmer. */
  duration?: number;
  /** Seconds before the first pass, so several beams on one page don't march in step. */
  delay?: number;
  /** Overrides the beam colour; defaults to the brand teal. Dark surfaces should
   * pass the lifted `--color-teal-bright` instead. */
  color?: string;
  className?: string;
}

/**
 * One bright light travelling across a grid surface.
 *
 * Purely decorative, so it is `aria-hidden` and never focusable. Place it as a
 * sibling of the grid layer inside a `relative overflow-hidden` parent — not as
 * a child, because the hero grids live in an `opacity-20` wrapper that would
 * dim the beam along with the lines it is meant to light up.
 *
 * The animation is defined in globals.css (`.grid-beam`) rather than Framer
 * Motion: it runs forever on a decorative element, so keeping it on the
 * compositor costs nothing and ships no JS.
 */
export function GridBeam({ duration = 9, delay = 0, color, className }: GridBeamProps) {
  return (
    <div
      aria-hidden
      className={cn('grid-beam', className)}
      style={
        {
          '--grid-beam-duration': `${duration}s`,
          '--grid-beam-delay': `${delay}s`,
          ...(color ? { '--grid-beam-color': color } : {}),
        } as CSSProperties
      }
    />
  );
}
