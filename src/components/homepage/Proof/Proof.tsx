'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { ProjectGlyph } from '@/components/homepage/Proof/ProjectGlyph';
import { ScrollRevealText } from '@/components/motion/ScrollRevealText';
import { SECTION_RISE, SectionShell } from '@/components/homepage/shared/SectionHeader';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
import { proof } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * Real deployments: the section that turns "this could work" into "this has
 * worked".
 *
 * Every project is a challenge and a stated outcome, in that order, because
 * that is the pair a buyer is actually testing — "did someone have my problem,
 * and what happened". Location and application sit in the mono label style the
 * page uses for hard data everywhere else.
 *
 * ONE ROW PER PROJECT: everything it says on the left, what it looks like on
 * the right, stacked down the page. Rows rather than cards — a project carries
 * four blocks of record, and a tile made the reading measure the constraint.
 * The grid collapses to one column below `lg`, picture under text.
 *
 * EACH ROW is the record on the left and the picture on the right. The headline
 * figures that used to lead each row, and the three totals above the list, were
 * removed — the challenge and result lines already state what happened, and the
 * figures were restating them.
 *
 * No photography, with one exception. C-DISC supplied site imagery for a
 * single project; the other three are typographic, because illustrating a real
 * deployment with a stock photograph or a render would misrepresent it.
 *
 * REVEAL. Each card runs its own in-view rise rather than inheriting the
 * shell's stagger. The stack is several viewports tall, so one parent trigger
 * would fire every card while most were still far below the fold — the cards
 * would be animated already by the time they were seen.
 */
export function Proof() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell id={proof.id} ariaLabel={proof.heading}>
      {/* The About page's chapter opening, reused here: an oversized centred
          `title-si` heading. That band carried a two-column body under it
          — a labelled lead and a sourcing note — which was removed; the section
          now goes straight from the heading to the evidence. */}
      <header className="mx-auto mb-[54px] max-w-[1190px] text-center">
        <ScrollRevealText as="h2" text={proof.heading} className="title-si" />
      </header>

      {/* One row per project: everything it says on the left, what it looks
          like on the right. Rows rather than cards — a project has four
          paragraphs of record to carry, and squeezing that into a tile made
          the reading measure the constraint.

          Only one project has supplied photography, so the rest show their
          ground-condition drawing at size instead. That is deliberate: a stock
          photograph or a render standing in for a named deployment would read
          as documentary evidence of it. */}
      <ul className="mt-4 flex list-none flex-col gap-20 p-0 lg:gap-28">
        {proof.projects.map((project) => (
          <motion.li
            key={project.name}
            variants={SECTION_RISE}
            initial={prefersReducedMotion ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* LEFT — the record */}
            <div>
              <h3 className="title-h2 font-[450] text-[var(--c-dark-green)]">{project.name}</h3>

              <p className="label-4 mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 leading-[1.5] text-[var(--c-dark-gray)] uppercase">
                <span>{project.location}</span>
                <span aria-hidden className="h-px w-4 bg-[var(--c-accent)]" />
                <span>{project.application}</span>
              </p>

              <dl className="mt-10">
                <dt className="label-4 text-[var(--c-dark-gray)] uppercase">Challenge</dt>
                <dd className="m-0 mt-3 text-[var(--c-dark-green)]/70">{project.challenge}</dd>

                <dt className="label-4 mt-6 text-[var(--c-dark-gray)] uppercase">Result</dt>
                <dd className="m-0 mt-3 text-[var(--c-dark-green)]">{project.result}</dd>
              </dl>
            </div>

            {/* RIGHT — the picture, cut to the site's notched silhouette.

                `notch-mask notch-mask-right` is exactly what the About page
                puts on media sitting to the RIGHT of a row: the mirrored art,
                so the stepped corner and the side notch fall on the side facing
                the text rather than away from it.

                The hairline is a plate behind in the rule colour, masked to the
                same shape, with the picture one pixel inside it — a `border` is
                clipped along with the box it is on, so a masked element cannot
                carry an outline directly. Same technique as the calculator's
                travelling edge, held still. */}
            <div className="relative aspect-[4/3] w-full">
              <div
                aria-hidden
                className="notch-mask notch-mask-right absolute inset-0 bg-[var(--c-dark-green-15)]"
              />

              <div className="notch-mask notch-mask-right absolute inset-px bg-[var(--c-dirty-white)]">
                {/* The drawing sits behind EVERY card, not only the ones with no
                    photograph. These are 2–4MB site photographs loading lazily
                    on a phone, so between the card scrolling into view and the
                    image arriving there was a large empty grey panel sitting
                    directly above the NEXT project's heading — it read as a
                    broken card belonging to the wrong project. The mark it
                    falls back to is the one this section already uses, so the
                    unloaded state is now the section's own language rather
                    than a void. The photograph covers it on arrival. */}
                <ProjectGlyph
                  name={project.name}
                  className={cn(
                    'absolute inset-0 m-auto h-40 w-40',
                    // Full strength where the drawing IS the picture — that is
                    // the deliberate choice for a project with no photography.
                    // Held back where it is only covering the gap before one
                    // arrives, so it never competes with the photograph.
                    project.image ? 'text-[var(--c-accent)]/40' : 'text-[var(--c-accent)]',
                  )}
                />

                {project.image ? (
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 90vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.div variants={SECTION_RISE} className="mt-20">
        <SectionLink label={proof.cta.label} href={proof.cta.href} />
      </motion.div>
    </SectionShell>
  );
}
