'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { SectionIntro } from '@/components/homepage/SectionIntro/SectionIntro';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
import { whyPen } from '@/content/data/homepage';
import { duration, easing } from '@/lib/motion';

/**
 * Opens the "why" chapter: the claim that a conventional footing's constraints
 * are a choice, not a given, and a route on to the engineering that backs it.
 *
 * No new visual language — `SectionIntro` carries the heading block, and the
 * motion comes from the shared easing and duration tokens.
 */

const RISE: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.outExpo } },
};

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function WhyPen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    /* `id` + `scroll-mt-nav` so the "what it replaces" card in the media grid
       has somewhere to land. Non-visual — the section is otherwise unchanged. */
    <section
      id="why"
      className="flex section-screen w-full scroll-mt-nav flex-col justify-center bg-[var(--c-white)] py-24 lg:py-28"
    >
      <SectionIntro heading={whyPen.heading} />

      <motion.div
        variants={STAGGER}
        initial={prefersReducedMotion ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-14 max-w-5xl px-6 md:px-10"
      >
        <motion.p
          variants={RISE}
          className="body-3 mx-auto max-w-2xl text-center text-[var(--c-dark-green)]/70"
        >
          {whyPen.intro}
        </motion.p>

        {/* Rendered here rather than through SectionIntro, which places its link
            directly under the heading — the lead-in sentence has to come first
            for the capability cards below to read as the list it promises. The
            link itself is the shared `SectionLink`, not the third hand-written
            copy of it that used to sit here. */}
        <motion.div variants={RISE} className="mt-10 flex justify-center">
          <SectionLink label={whyPen.link.label} href={whyPen.link.href} />
        </motion.div>
      </motion.div>
    </section>
  );
}
