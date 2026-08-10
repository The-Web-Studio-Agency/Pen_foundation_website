'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { duration, easing } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * The page's left-aligned section header: the display heading, then a lead
 * paragraph.
 *
 * Lifted from `CalculatorSection`, which established the pattern on this page —
 * same `title-si` heading, same `body-3` lead at 70% ink. The centred
 * `SectionIntro` remains the pattern for chapter openings; this is the one for
 * sections inside a chapter.
 *
 * Every section used to open on a short mono eyebrow behind an accent rule
 * ("THE SYSTEM", "APPLICATIONS"). Those were dropped, so a section now starts
 * on its heading and the type does the work the label was doing.
 *
 * The rise-and-stagger is the shared `duration.base` / `easing.outExpo` pair
 * every other section on the page animates with, and it collapses to a plain
 * render under `prefers-reduced-motion`.
 */

export const SECTION_RISE: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.outExpo } },
};

export const SECTION_STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export interface SectionHeaderProps {
  heading: string;
  /** Optional: the validation table carries a title with no supporting line. */
  lead?: string;
  /** Widens the lead measure where the section has no column beside it. */
  leadClassName?: string;
  className?: string;
}

export function SectionHeader({ heading, lead, leadClassName, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <motion.h2
        variants={SECTION_RISE}
        className="title-si font-normal text-[var(--c-dark-green)]"
      >
        {heading}
      </motion.h2>

      {lead ? (
        <motion.p
          variants={SECTION_RISE}
          className={cn('body-3 mt-6 max-w-2xl text-[var(--c-dark-green)]/70', leadClassName)}
        >
          {lead}
        </motion.p>
      ) : null}
    </div>
  );
}

/**
 * Section shell used by every block added below the fold: white ground, the
 * page's `py-28` rhythm, the shared `.site-column` measure, and
 * one in-view stagger driving the children.
 */
export interface SectionShellProps {
  id: string;
  /** Announced name for the landmark, since the visible heading is inside. */
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionShell({ id, ariaLabel, className, children }: SectionShellProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        // On a landscape viewport every section holds at least one screen, with
        // its content centred in it; on a portrait one the content sets the
        // height instead. That is `section-screen` in globals.css — a floor,
        // never `h-`, so a section taller than the viewport (the applications
        // grid, the FAQ) grows rather than clips, and `svh` so mobile browser
        // chrome cannot make a "full screen" section overflow the visible area.
        'flex section-screen w-full scroll-mt-nav flex-col justify-center',
        'bg-[var(--c-white)] py-28',
        className,
      )}
    >
      <motion.div
        variants={SECTION_STAGGER}
        initial={prefersReducedMotion ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="site-column"
      >
        {children}
      </motion.div>
    </section>
  );
}
