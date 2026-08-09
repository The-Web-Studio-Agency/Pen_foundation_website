'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { SECTION_RISE, SECTION_STAGGER } from '@/components/homepage/shared/SectionHeader';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
import { cn } from '@/lib/utils';
import type { ProcessContent } from '@/types/homepage';

/**
 * A numbered four-step process, given the same treatment as the "See PEN in
 * the ground" grid directly above it: centred display heading, full-bleed
 * padding, and light `--c-dirty-white` cards that open on a mono number.
 *
 * It used to be four ink cards under a left-aligned `SectionHeader` inside
 * `SectionShell`. Two adjacent card grids reading as two different systems —
 * one dark and left-aligned, one light and centred — made the page change its
 * mind halfway down. The process is now the third panel of the same idea, so
 * it is built from `InAction`'s shell: `min-h-svh` with the centred header
 * block, `px-5 py-15 lg:px-[4.375rem] lg:py-[5.625rem]`, `rounded-2xl` cards
 * on the off-white ground at `gap-6 lg:gap-[1.875rem]`.
 *
 * Two deliberate departures from that section, both because the content is a
 * sequence rather than three parallel cards:
 *
 *   - The eyebrow carries the step number alone. `InAction` pairs its index
 *     with a category word; a step has no category, and the phase name is the
 *     card's heading, so pairing them would print the same word twice.
 *   - No per-card picture or button. The steps have neither, and the section
 *     ends on the one shared `SectionLink` instead — centred, to sit under the
 *     centred heading.
 *
 * Four columns at ≥1024px, two at ≥640px, one below that, so the sequence
 * reads left-to-right on a desktop and top-to-bottom on a phone. Nothing is
 * hidden at any width.
 *
 * Still a client component, unlike `InAction`: it keeps the page's shared
 * in-view rise-and-stagger, which every other section below the fold animates
 * with, and which collapses to a plain render under `prefers-reduced-motion`.
 */
export interface ProcessStepsProps {
  content: ProcessContent;
}

export function ProcessSteps({ content }: ProcessStepsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={content.id}
      aria-label={content.heading}
      className={cn(
        'flex min-h-svh scroll-mt-nav flex-col justify-center',
        'px-5 py-15 lg:px-[4.375rem] lg:py-[5.625rem]',
      )}
    >
      <motion.div
        variants={SECTION_STAGGER}
        initial={prefersReducedMotion ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="mb-10 flex flex-col gap-4 text-center lg:mb-16">
          <motion.h2
            variants={SECTION_RISE}
            className="title-h2 m-0 font-normal text-balance text-[var(--c-dark-green)]"
          >
            {content.heading}
          </motion.h2>

          {content.lead ? (
            <motion.p
              variants={SECTION_RISE}
              className="body-3 mx-auto max-w-3xl text-[var(--c-dark-green)]/70"
            >
              {content.lead}
            </motion.p>
          ) : null}
        </div>

        <ol
          className={cn(
            'grid list-none grid-cols-1 gap-6 p-0',
            'sm:grid-cols-2 lg:grid-cols-4 lg:gap-[1.875rem]',
          )}
        >
          {content.steps.map((step) => (
            <motion.li
              key={step.number}
              variants={SECTION_RISE}
              className="flex flex-col rounded-2xl bg-[var(--c-dirty-white)] p-8 lg:p-10"
            >
              <p className="label-4 text-[var(--c-dark-gray)] uppercase">{step.number}</p>

              <h3 className="title-h3 mt-6 font-[450] text-[var(--c-dark-green)]">{step.title}</h3>

              <p className="mt-4 text-[var(--c-dark-green)]/70">{step.body}</p>
            </motion.li>
          ))}
        </ol>

        <motion.div variants={SECTION_RISE} className="mt-10 text-center lg:mt-16">
          <SectionLink label={content.cta.label} href={content.cta.href} />
        </motion.div>
      </motion.div>
    </section>
  );
}
