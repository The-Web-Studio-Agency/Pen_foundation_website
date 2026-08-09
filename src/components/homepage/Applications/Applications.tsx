'use client';

import { motion } from 'framer-motion';

import {
  SECTION_RISE,
  SectionHeader,
  SectionShell,
} from '@/components/homepage/shared/SectionHeader';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
import { applications } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * Where PEN applies — the section that lets a visitor recognise their own
 * project on the page.
 *
 * Cards are flat `--c-dirty-white` panels with the site's notched corner. That
 * is the brand's own surface language: the notch runs through the section
 * separators, the footer lip, the calculator's masked card and the About media
 * panels, and `.notch-corner-sm` is the existing 18px token for a small box.
 * These first shipped as rounded white tiles with a soft drop shadow, which is
 * a generic card from any framework — the bevel is what makes it read as PEN.
 *
 * No border: `clip-path` cuts the border along with the box, so a bordered
 * notched card loses its outline exactly on the diagonal. Solid fill instead,
 * which is how every other notched surface on the site is built.
 *
 * No hover state either — these are not links, and the site only animates
 * things you can click.
 *
 * No imagery: there is no photography for most of these categories, and a
 * stock photograph standing in for a deployment that has not happened is the
 * one thing this section must not do.
 *
 * The `note` under the grid is load-bearing content, not a disclaimer: naming
 * the load ceiling is what stops the list reading as a claim that PEN does
 * everything.
 */
export function Applications() {
  return (
    <SectionShell id={applications.id} ariaLabel={applications.heading}>
      <SectionHeader heading={applications.heading} lead={applications.lead} />

      <ul className="mt-16 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {applications.items.map((item) => (
          <motion.li
            key={item.title}
            variants={SECTION_RISE}
            className={cn(
              'notch-corner-sm flex flex-col bg-[var(--c-dirty-white)]',
              // Extra left padding: the 18px bevel eats into the top-left, so
              // the title needs clearance to sit square under it.
              'p-7 pt-8 sm:p-8 sm:pt-9',
            )}
          >
            <h3 className="title-h4 font-normal text-[var(--c-dark-green)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--c-dark-green)]/70">
              {item.body}
            </p>
          </motion.li>
        ))}
      </ul>

      <motion.p
        variants={SECTION_RISE}
        className="mt-10 max-w-3xl font-mono text-xs leading-relaxed text-[var(--c-dark-gray)]"
      >
        {applications.note}
      </motion.p>

      <motion.div variants={SECTION_RISE} className="mt-12">
        <SectionLink label={applications.cta.label} href={applications.cta.href} />
      </motion.div>
    </SectionShell>
  );
}
