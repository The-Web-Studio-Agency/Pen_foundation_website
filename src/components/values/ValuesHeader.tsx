'use client';

import { motion, type MotionValue } from 'framer-motion';

import { ScrollRevealText } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * The section's left column: eyebrow, heading, and the paragraph that frames
 * the three cards beside it.
 *
 * Sticky from the large breakpoint up, so the argument stays on screen while
 * its evidence scrolls past. Below that it is ordinary flow content with the
 * cards underneath.
 *
 * The heading reveals per word as it scrubs into place — `ScrollRevealText` is
 * the house component for exactly this, ported from the same reference site, so
 * the ramp (light gray → teal → site dark) already matches.
 */

interface ValuesHeaderProps {
  eyebrow: string;
  heading: string;
  intro: string;
  /**
   * Optional scroll-linked drift, supplied by the section. A couple of percent
   * of travel layered on the sticky — enough to keep the column from feeling
   * nailed down, not enough to notice as movement.
   */
  y?: MotionValue<string>;
  className?: string;
}

export function ValuesHeader({ eyebrow, heading, intro, y, className }: ValuesHeaderProps) {
  return (
    <motion.div
      style={{ y }}
      className={cn(
        'flex flex-col gap-6',
        'lg:sticky lg:top-[max(20svh,calc(var(--spacing-nav)+2rem))] lg:max-w-[55rem] lg:self-start',
        className,
      )}
    >
      <p className="text-[1.0625rem] leading-[0.95] tracking-[-0.0106rem] text-[var(--c-light-gray)] lg:text-[1.25rem] lg:tracking-[-0.0125rem]">
        {eyebrow}
      </p>

      <ScrollRevealText as="h2" text={heading} className="title-h2 leading-[1.2] font-normal" />

      <p className="text-[1.25rem] leading-[1.26] tracking-[-0.01em] text-[var(--c-dark-green)]">
        {intro}
      </p>
    </motion.div>
  );
}
