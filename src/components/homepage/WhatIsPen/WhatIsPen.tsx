'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  SECTION_RISE,
  SectionHeader,
  SectionShell,
} from '@/components/homepage/shared/SectionHeader';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
import { CheckIcon } from '@/components/shared/icons';
import { product } from '@/content/data/homepage';
import { cn } from '@/lib/utils';
import type { BodyParagraph } from '@/types/homepage';

/**
 * What PEN Foundation actually is.
 *
 * The page could previously establish that PEN was *different* without ever
 * saying what it *was* — this is the section that answers it: the mechanism,
 * the parts with their real specifications, and the comparison against the
 * thing it replaces.
 *
 * No new visual language. The header is the page's own `SectionHeader`, the
 * spec rows use the hairline rule the FAQ uses, the comparison's highlighted
 * column is the same `bg-ink` as the statement band and the footer, and every
 * label is the mono `label-4` the page already uses.
 *
 * The comparison was three ink cards that slid in from alternating sides; it
 * is now a side-by-side matrix, so that motion and its tokens went with it.
 * The section keeps the one shared in-view stagger from `SectionShell`.
 *
 * The hairline is `--c-dark-green-15` rather than a new token, and every
 * measurement below is one already on the page's scale.
 */

/**
 * The matrix's column template, shared by the header row and every data row so
 * the three columns cannot drift apart. The PEN column is the widest of the
 * two system columns: it is the one being read.
 */
const GRID = 'grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-0';

/** Column-header type. Steps up with the viewport instead of using the
 *  single-line `title-h4` scale, which collides when a header wraps. */
const HEAD = 'text-[0.9375rem] leading-[1.3] sm:text-[1.125rem] lg:text-[1.375rem]';

/**
 * A paragraph with its one emphasised phrase set in a `<strong>`.
 *
 * The phrase is located in the sentence rather than the copy being stored
 * pre-split, so `homepage.ts` keeps whole readable paragraphs. `split` with a
 * limit of 2 takes the first occurrence and leaves the rest of the sentence
 * intact — "friction" appearing again later stays plain, which is what you
 * want: the emphasis marks the term's introduction, not every mention.
 *
 * An `emphasis` that is missing, or that no longer matches after a copy edit,
 * renders the paragraph plain instead of throwing. A dropped bold is a
 * cosmetic loss; a crashed section is not.
 */
function Paragraph({ text, emphasis }: BodyParagraph) {
  const [before, after] = emphasis ? text.split(emphasis, 2) : [text];

  if (after === undefined) return text;

  return (
    <>
      {before}
      {/* Full-strength ink against the paragraph's 70%, so the weight and the
          contrast lift the phrase together — bold alone at 70% barely reads. */}
      <strong className="font-semibold text-[var(--c-dark-green)]">{emphasis}</strong>
      {after}
    </>
  );
}

/** A tick, or nothing — with the state named for assistive tech either way. */
function Mark({ on, className }: { on: boolean; className?: string }) {
  return on ? (
    <>
      <CheckIcon className={cn('size-6', className)} />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <span className="sr-only">No</span>
  );
}

export function WhatIsPen() {
  return (
    <SectionShell id={product.id} ariaLabel={product.heading}>
      <SectionHeader heading={product.heading} lead={product.lead} />

      {/* ----------------------------------------------------------- anatomy */}
      {/* The reference's anatomy arrangement: four short pairs down the left,
          the object floating unboxed on the right. A bold term over one grey
          supporting line, which is the whole rhythm of that layout.

          These are highlights, not the specification. The eight-row table of
          grades, tolerances and IS codes moved to /engineering — printing it
          at a reader who is still deciding whether the system is relevant to
          them was the reason this section read as a datasheet. */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <motion.dl variants={SECTION_RISE} className="flex flex-col gap-9">
          {product.highlights.map((item) => (
            <div key={item.title}>
              <dt className="text-xl leading-normal font-medium text-[var(--c-dark-green)]">
                {item.title}
              </dt>
              <dd className="m-0 mt-2 text-[var(--c-dark-green)]/60">{item.body}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={SECTION_RISE}>
          <Image
            src={product.media.src}
            alt={product.media.alt}
            width={1547}
            height={1017}
            sizes="(min-width: 1024px) 52vw, 90vw"
            // No panel behind it: the render is already on white, and the
            // reference floats its product rather than boxing it.
            className="h-auto w-full object-contain"
          />
        </motion.div>
      </div>

      {/* --------------------------------------------------- the mechanism */}
      {/* Full width under the anatomy block. Four paragraphs of prose squeezed
          into half a page next to a render is the layout this section started
          with, and the reason it read as two unrelated halves.

          Centred, on the same axis as the comparison heading below it, so the
          section closes on one column rather than drifting back to the left
          margin. `max-w-3xl` is what keeps that safe: centred text needs a
          short measure to stay readable, and both ragged edges of a full-width
          paragraph are a genuinely hard thing to read.

          Left-aligned below `lg`, though — that is the same rule, not an
          exception to it. Under 1024px the cap is wider than the viewport, so
          the measure it was protecting does not exist and four paragraphs end
          up centred at full width with both edges ragged. Exactly the failure
          the comment above describes. */}
      <div className="mx-auto mt-20 flex max-w-3xl flex-col gap-6 text-left lg:text-center">
        {product.body.map((paragraph) => (
          <motion.p
            key={paragraph.text.slice(0, 40)}
            variants={SECTION_RISE}
            // `text-pretty` rather than `text-balance`: balance is for a couple
            // of lines, and evening out the last line of a centred paragraph is
            // exactly what stops it ending on one orphaned word.
            className="body-3 text-pretty text-[var(--c-dark-green)]/70"
          >
            <Paragraph {...paragraph} />
          </motion.p>
        ))}
      </div>

      {/* ------------------------------------------------------- comparison */}
      {/*
        A side-by-side matrix: features down the left, one column per system,
        a tick where the system has that property and an empty cell where it
        does not. The PEN column is a single unbroken ink panel running the
        height of the table, so the eye reads it as one block rather than as
        nine separate cells — the highlighted-column treatment from the
        reference.

        Absence is an empty cell, not a cross. A cross argues; a gap states.
        Both cells carry `sr-only` text either way, because "nothing here" is
        not something a screen reader can infer from an empty box.

        Built as a grid rather than a <table>: at narrow widths the three
        columns have to reflow, and a table cannot. The row semantics are
        carried by roles instead, so it still reads as a table to assistive
        tech at any width.
      */}
      <motion.h3
        variants={SECTION_RISE}
        className="title-si mt-24 text-center font-normal text-balance text-[var(--c-dark-green)]"
      >
        {product.comparison.title}
      </motion.h3>

      {/* `max-w-5xl`, not the `max-w-4xl` this started on: the feature column
          was wrapping rows like "Installs on disturbed or sloping ground
          without excavation" onto two lines while the section's own column
          still had 300px spare on either side. Stops short of the full
          `max-w-7xl` shell — the matrix is a centred object, and running it
          edge to edge would read as a full-bleed table. */}
      <motion.div variants={SECTION_RISE} role="table" className="mx-auto mt-16 max-w-5xl">
        {/* Header. The feature column is deliberately unlabelled — the rows
            name themselves, and a "Feature" heading would only add furniture. */}
        <div role="row" className={cn(GRID, 'items-end')}>
          {/* Holds the first grid column. The label is `sr-only` on an INNER
              span, not on this one: `sr-only` is `position: absolute`, which
              takes the element out of grid flow — put it here and every header
              after it shifts one column left of the rows it labels. */}
          <span role="columnheader">
            <span className="sr-only">Property</span>
          </span>

          <p
            role="columnheader"
            className={cn(
              'rounded-t-3xl bg-ink px-3 py-6 text-center font-[450] text-[var(--c-white)] sm:px-4 sm:py-8',
              // Not `title-h4`: at 390px these columns are about 97px wide and
              // that scale wraps "Conventional footing" into an overlapping
              // stack, since its line-height is tuned for a single line.
              HEAD,
            )}
          >
            {product.comparison.columns[0]}
          </p>

          <p
            role="columnheader"
            className={cn(
              'px-3 py-6 text-center font-[450] text-[var(--c-dark-green)] sm:px-4 sm:py-8',
              HEAD,
            )}
          >
            {product.comparison.columns[1]}
          </p>
        </div>

        {product.comparison.rows.map((row, index) => {
          const isLast = index === product.comparison.rows.length - 1;

          return (
            <div role="row" key={row.feature} className={cn(GRID, 'items-stretch')}>
              <span
                role="rowheader"
                className={cn(
                  'flex items-center py-5 pr-6 text-[var(--c-dark-green)]',
                  'border-b border-b-[var(--c-dark-green-15)]',
                  isLast && 'border-b-transparent',
                )}
              >
                {row.feature}
              </span>

              {/* PEN — inside the ink panel, so its divider is a light hairline
                  on dark rather than the page's rule colour, which would vanish. */}
              <span
                role="cell"
                className={cn(
                  'flex items-center justify-center bg-ink py-5',
                  !isLast && 'border-b border-b-white/10',
                  isLast && 'rounded-b-3xl',
                )}
              >
                <Mark on={row.pen} className="text-teal-bright" />
              </span>

              <span
                role="cell"
                className={cn(
                  'flex items-center justify-center py-5',
                  'border-b border-b-[var(--c-dark-green-15)]',
                  isLast && 'border-b-transparent',
                )}
              >
                <Mark on={row.conventional} className="text-[var(--c-dark-green)]/60" />
              </span>
            </div>
          );
        })}
      </motion.div>

      <motion.p
        variants={SECTION_RISE}
        // Tracks the matrix width above it, so the note's edges line up with
        // the table it annotates rather than sitting inset from it.
        className="mx-auto mt-10 max-w-5xl font-mono text-xs leading-relaxed text-[var(--c-dark-gray)]"
      >
        {product.comparison.note}
      </motion.p>

      <motion.div variants={SECTION_RISE} className="mt-14">
        <SectionLink label={product.cta.label} href={product.cta.href} />
      </motion.div>
    </SectionShell>
  );
}
