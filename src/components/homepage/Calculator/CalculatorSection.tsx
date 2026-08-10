'use client';

import Link from 'next/link';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { ClockIcon, LeafIcon, NodeIcon } from '@/components/shared/icons';
import { calculator } from '@/content/data/homepage';
import {
  estimateProject,
  formatArea,
  formatCountRange,
  formatMassRange,
} from '@/lib/calculator/savings';
import { duration, easing } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Project estimator: a parameters card on the left, the figures it produces on
 * the right, closing on an assessment button.
 *
 * The arithmetic lives in `@/lib/calculator/savings` — this file only renders.
 * Every rate the model uses is also printed under the parameters as `basis`, so
 * a visitor can check the numbers rather than take them on trust.
 *
 * The slider now sets BUILT-UP AREA rather than a foundation-point count, and
 * the middle card is a cost saving no longer — both on the instruction of the
 * C-DISC content handoff. See the block comment on `calculator` in
 * `content/data/homepage` for why each change was made.
 */

const RISE: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.outExpo } },
};

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/** One result tile: tinted icon chip, figure, label, supporting line. */
function ResultCard({
  icon,
  iconClass,
  value,
  label,
  note,
}: {
  icon: ReactNode;
  iconClass: string;
  value: ReactNode;
  label: string;
  note: ReactNode;
}) {
  return (
    <div className="flex items-start gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(1,44,50,0.06)] sm:p-7">
      <span
        aria-hidden
        className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', iconClass)}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="title-h2 font-[450] text-[var(--c-dark-green)]">{value}</p>
        <p className="label-4 mt-1 text-[var(--c-dark-gray)] uppercase">{label}</p>
        <p className="mt-2 text-sm text-[var(--c-dark-green)]/70">{note}</p>
      </div>
    </div>
  );
}

export function CalculatorSection() {
  const prefersReducedMotion = useReducedMotion();
  const sliderId = useId();
  const [area, setArea] = useState(calculator.area.initial);
  const [typeId, setTypeId] = useState(calculator.projectTypes[0].id);

  const projectType =
    calculator.projectTypes.find((type) => type.id === typeId) ?? calculator.projectTypes[0];
  // `projectType` is not passed to the model: the handoff demotes project type
  // to a supporting selector and supplies no per-type rates, so the selection
  // is context carried into the assessment request rather than a multiplier.
  const { unitsMin, unitsMax, co2SavedKgMin, co2SavedKgMax, treesMin, treesMax } =
    estimateProject(area);

  const { min, max, step } = calculator.area;
  const progress = ((area - min) / (max - min)) * 100;

  return (
    /* `id` + `scroll-mt-nav` so the header's Calculator link lands the section
       below the fixed pill rather than underneath it — the same treatment the
       closing form already carries. */
    <section
      id="calculator"
      className="flex section-screen w-full scroll-mt-nav flex-col justify-center bg-[var(--c-white)] py-28"
    >
      <motion.div
        variants={STAGGER}
        initial={prefersReducedMotion ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="site-column"
      >
        {/* ---------------------------------------------------------- header */}
        <motion.h2 variants={RISE} className="title-si font-normal text-[var(--c-dark-green)]">
          {calculator.heading}
        </motion.h2>

        <motion.p variants={RISE} className="body-3 mt-6 max-w-2xl text-[var(--c-dark-green)]/70">
          {calculator.body.lead}
          <Link
            href={calculator.body.linkHref}
            className="font-medium text-[var(--c-dark-green)] underline underline-offset-4 transition-colors fine:hover:text-[var(--c-accent)]"
          >
            {calculator.body.linkLabel}
          </Link>
          {calculator.body.trail}
        </motion.p>

        {/*
          A plain rounded rectangle.

          This panel used to be cut to the site's notch silhouette
          (`section-mask`, section.svg) with a travelling highlight masked to
          the same shape sitting 2px behind it — which put a stepped tab across
          the top edge and an animated teal hairline down both sides. Asked for
          as a simple panel, so the mask and the highlight are both gone and the
          shape is now only a radius. `section-mask` itself stays: Statement
          still uses it.

          The background is `bg-white` (#fff) and so is the section behind it
          (`--c-white`, also #fff), which means the shadow is the only thing
          separating panel from page. It is structural here, not decoration.

          `rounded-3xl` (24px) against the result cards' `rounded-2xl` (16px):
          nested radii have to grow outward, or the corners read as mismatched.
        */}
        <motion.div
          variants={RISE}
          className="relative mt-16 rounded-3xl bg-white px-6 py-16 shadow-[0_20px_50px_rgba(1,44,50,0.10)] sm:px-10 lg:px-14 lg:py-20"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
            {/* --------------------------------------------- parameters */}
            <div>
              <h3 className="title-h3 font-[450] text-[var(--c-dark-green)]">
                {calculator.parametersTitle}
              </h3>

              <div className="mt-8 flex items-baseline justify-between gap-4">
                <label htmlFor={sliderId} className="text-[var(--c-dark-green)]/70">
                  {calculator.areaLabel}
                </label>
                <output
                  htmlFor={sliderId}
                  className="title-h3 font-[450] text-[var(--c-dark-green)]"
                >
                  {formatArea(area)}{' '}
                  {/* The unit is part of the reading, but at full size it
                      competes with the number it qualifies. */}
                  <span className="label-4 text-[var(--c-dark-gray)] uppercase">
                    {calculator.areaUnit}
                  </span>
                </output>
              </div>

              <input
                id={sliderId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={area}
                onChange={(event) => setArea(Number(event.target.value))}
                aria-valuetext={`${formatArea(area)} ${calculator.areaUnit} built-up area`}
                /*
                 * The filled portion, handed to the TRACK rather than painted
                 * on the input itself.
                 *
                 * It used to be the input's own `background`, which meant the
                 * input had to be the height of the track it was drawing — 6px.
                 * A range input's hit area is its box, so the whole control was
                 * a 6px-tall target: the 20px thumb is drawn overflowing that
                 * box, but a tap on the part of it above or below the 6px band
                 * landed on nothing. It was the hardest thing on the site to
                 * operate with a finger.
                 *
                 * Painting the track through its pseudo-element frees the input
                 * to be 44px tall — a proper target — with the track still 6px
                 * and the thumb centred on it. The gradient arrives as a custom
                 * property because a pseudo-element cannot be reached by inline
                 * style. Native keyboard and assistive-tech behaviour is
                 * untouched: this is still one plain `input[type=range]`.
                 */
                style={
                  {
                    '--pen-track': `linear-gradient(to right, var(--c-accent) ${progress}%, var(--c-dark-green-15) ${progress}%)`,
                  } as CSSProperties
                }
                className={cn(
                  // 44px box, positioned so the 6px track lands where the old
                  // 6px input did; the negative bottom margin gives back the
                  // height the taller box would otherwise add to the column.
                  'mt-0.5 -mb-4 h-11 w-full cursor-pointer appearance-none bg-transparent',
                  '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full',
                  '[&::-webkit-slider-runnable-track]:[background-image:var(--pen-track)]',
                  '[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full',
                  '[&::-moz-range-track]:[background-image:var(--pen-track)]',
                  // -7px centres a 20px thumb on a 6px track: (6 - 20) / 2.
                  '[&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:size-5',
                  '[&::-webkit-slider-thumb]:appearance-none',
                  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--c-accent)]',
                  '[&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white',
                  '[&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(1,44,50,0.3)]',
                  '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full',
                  '[&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white',
                  '[&::-moz-range-thumb]:bg-[var(--c-accent)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--c-dark-green)]',
                )}
              />

              <fieldset className="mt-8 border-0 p-0">
                <legend className="sr-only">Project type</legend>
                <div className="grid grid-cols-2 gap-3">
                  {calculator.projectTypes.map((type) => {
                    const selected = type.id === projectType.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTypeId(type.id)}
                        className={cn(
                          'rounded-xl px-4 py-3.5 text-left text-sm transition-colors duration-200',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-dark-green)]',
                          selected
                            ? 'bg-[var(--c-dark-green)] text-[var(--c-white)]'
                            : 'bg-[var(--c-dirty-white)] text-[var(--c-dark-green)] fine:hover:bg-[var(--c-dark-green-05)]',
                        )}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Fine print sits at 11px — the site's smallest mono size, the
                one `label-4` uses — so this block reads as an annotation under
                the controls rather than as a second column of copy. The same
                size is set on the matching notes in WhatIsPen and Applications;
                the three are one type style and move together. */}
              <p className="mt-8 font-mono text-[0.6875rem] leading-relaxed text-[var(--c-dark-gray)]">
                {calculator.basis.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            {/* ------------------------------------------------ results */}
            <div className="flex flex-col gap-5">
              {/* The point count leads now. It is the figure the area actually
                  determines, and every other number on the card derives from
                  it — so showing it first makes the chain legible rather than
                  asking the reader to take the carbon total on trust. */}
              <motion.div variants={RISE}>
                <ResultCard
                  icon={<NodeIcon className="size-6 text-[var(--c-dark-green)]" />}
                  iconClass="bg-[var(--c-dark-green)]/10"
                  value={`${formatCountRange(unitsMin, unitsMax)} units`}
                  label={calculator.unitsLabel}
                  note={calculator.unitsNote}
                />
              </motion.div>

              {/* Written, not computed — see `calculator` in the content module.
                  It keeps the card's shape without deriving a day count from a
                  rate the handoff has not yet reconciled. */}
              <motion.div variants={RISE}>
                <ResultCard
                  icon={<ClockIcon className="size-6 text-[var(--c-accent)]" />}
                  iconClass="bg-[var(--c-accent)]/10"
                  value={calculator.programmeValue}
                  label={calculator.programmeLabel}
                  note={calculator.programmeNote}
                />
              </motion.div>

              <motion.div variants={RISE}>
                <ResultCard
                  icon={<LeafIcon className="size-6 text-[var(--c-accent)]" />}
                  iconClass="bg-[var(--c-accent)]/10"
                  value={formatMassRange(co2SavedKgMin, co2SavedKgMax)}
                  label={calculator.carbon.label}
                  note={
                    <>
                      {/* The tree count is the figure that makes a kilogram
                        total mean something, so it leads the line and the
                        link follows it. */}
                      {calculator.carbon.treesPrefix} {formatCountRange(treesMin, treesMax)}{' '}
                      {calculator.carbon.treesSuffix} —{' '}
                      <Link
                        href={calculator.carbon.href}
                        className="underline underline-offset-4 transition-colors fine:hover:text-[var(--c-accent)]"
                      >
                        {calculator.carbon.linkLabel} →
                      </Link>
                    </>
                  }
                />
              </motion.div>

              {/* The button alone. It used to sit in a dark bar under a title
                and a supporting line, but the section heading and lead have
                already made that argument two hundred pixels above — the bar was
                restating it, and a dark box wrapping a single pill is a
                container around nothing.

                Full width so it lines up with the three result cards it closes,
                rather than floating at its own intrinsic size. */}
              <motion.div variants={RISE} className="mt-1">
                <Link
                  href={calculator.cta.href}
                  className={cn(
                    'label-4 flex w-full items-center justify-center rounded-full px-8 py-5 uppercase',
                    // `label-4` carries line-height 0.81, which collides with
                    // itself the moment the label wraps — and it does wrap inside
                    // the narrow results column on a phone.
                    'text-center leading-[1.5]',
                    'bg-[var(--c-accent)] text-white no-underline transition-colors duration-300',
                    'fine:hover:bg-[var(--c-dark-green)] fine:hover:text-white',
                    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--c-dark-green)]',
                  )}
                >
                  {calculator.cta.label}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
