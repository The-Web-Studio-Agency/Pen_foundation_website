'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { RevealText } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * The wall of customer marks. Each square cell holds a vertical reel of logos
 * that slides up by one item on a timer, so the wall keeps quietly swapping
 * which brands are on show.
 *
 * Measured on the reference at 1440×900: the wall spans columns 2–11 of the
 * 12-column grid (1110px), which makes the twenty cells 111px squares — ten per
 * row, two rows, 366px tall. Below 1024px the grid collapses to two columns and
 * the cells are half the viewport wide.
 *
 * Used twice on the page: once with an intro heading over twenty cells, once
 * without over five investor marks, hence the prop-driven shape.
 */

/** Milliseconds between swaps. One cell moves per tick, so the wall never
 *  flips two marks at the same moment — the reference's quiet trickle. */
const SWAP_MS = 750;
/** Length of the slide itself. */
const SLIDE_MS = 1000;
/** Cells per row at ≥1024px; the reference's `flex-basis: 10%`. */
const DESKTOP_MAX_PER_ROW = 10;

export interface LogoWallProps {
  /** Omit for the heading-less variant. */
  heading?: string;
  /**
   * One supporting line under the heading. Twenty unfamiliar marks do not say
   * what kind of backing they represent, and the heading alone cannot carry it.
   *
   * Sits in the intro block directly above the grid, so however many lines it
   * wraps to, the marks below simply start lower.
   */
  note?: string;
  cells: { reel: { src: string; alt: string }[] }[];
  className?: string;
  /**
   * Cells per row on desktop. Defaults to one row of however many cells there
   * are (capped at DESKTOP_MAX_PER_ROW), which is right for the full wall but
   * balloons a short wall: three cells would otherwise be 33% wide each, and
   * because a cell is `aspect-square` that is also 33% of the width *tall* —
   * a ~370px box around a 72px logo. Pass a higher number to keep the cells
   * small and the marks close together.
   */
  perRow?: number;
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

/**
 * Visits every cell exactly once per cycle, but in strides rather than in
 * order, so consecutive swaps land far apart on the wall. Any stride coprime
 * with the count produces a full permutation; 7 scatters best at these sizes.
 */
function swapOrder(count: number): number[] {
  const stride = [7, 5, 3].find((candidate) => greatestCommonDivisor(candidate, count) === 1) ?? 1;
  return Array.from({ length: count }, (_, step) => (step * stride) % count);
}

export function LogoWall({ heading, note, cells, className, perRow: perRowProp }: LogoWallProps) {
  const [indexes, setIndexes] = useState<readonly number[]>(() => cells.map(() => 0));

  /** Cells with a single mark have nothing to swap, so they never take a turn. */
  const order = useMemo(() => {
    const swappable = cells.reduce<number[]>((collected, cell, index) => {
      if (cell.reel.length > 1) collected.push(index);
      return collected;
    }, []);
    return swapOrder(swappable.length).map((position) => swappable[position]);
  }, [cells]);

  useEffect(() => {
    if (order.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let turn = 0;
    const id = window.setInterval(() => {
      const cellIndex = order[turn % order.length];
      turn += 1;
      setIndexes((current) => {
        const next = current.slice();
        // Grows without bound-checking on purpose: the render takes it modulo
        // the reel length, so the reel keeps cycling forwards forever.
        next[cellIndex] = (next[cellIndex] ?? 0) + 1;
        return next;
      });
    }, SWAP_MS);

    return () => window.clearInterval(id);
  }, [order]);

  const perRow = perRowProp ?? Math.min(DESKTOP_MAX_PER_ROW, Math.max(cells.length, 1));
  // Every mark carries the same placeholder alt, so one group label stands in
  // for what would otherwise be forty identical announcements.
  const wallLabel = cells[0]?.reel[0]?.alt ?? 'Logo wall';

  return (
    <section
      className={cn(
        'relative z-0 grid overflow-clip bg-[var(--c-white)] text-[var(--c-dark-green)]',
        'grid-cols-2 gap-x-[2.564vw] px-[5.128vw]',
        'lg:grid-cols-12 lg:gap-x-[min(1.042vw,26.6666666667px)] lg:px-[min(3.646vw,93.3333333333px)]',
        // The reference only carries its `--pt-sm/--pb-sm` padding on the
        // instance that has an intro; the bare one sits flush.
        heading && 'py-6 lg:py-10',
        className,
      )}
    >
      {/* The intro is in normal flow above the grid.

          It used to be absolutely positioned, with the grid reserving room for
          it via a JS-measured `--lw-intro-h` custom property. That property was
          never actually applied — measured in the browser, the element carried
          no inline style — so the grid fell back to the 7rem guess while the
          intro really stood 319px tall on a phone, and 142px of the supporting
          paragraph rendered directly on top of the first row of logos.

          Flow layout cannot desynchronise: however tall the intro gets, the
          marks start below it. The composition on screen is unchanged, one
          effect and one ResizeObserver are gone, and the bug cannot come back
          the next time this copy is edited. */}
      <div className={cn('relative [grid-column:1/span_2] lg:[grid-column:2/span_10]')}>
        {heading ? (
          <div
            className={cn(
              'z-[2] px-5 pt-10 text-center text-balance',
              'lg:px-[4.375rem] lg:pt-[min(3.125vw,80px)]',
            )}
          >
            <RevealText as="h2" text={heading} className="title-si" />
            {note ? (
              <p className="body-3 mx-auto mt-6 max-w-2xl text-[var(--c-dark-green)]/70">{note}</p>
            ) : null}
          </div>
        ) : null}

        <div
          role="img"
          aria-label={wallLabel}
          className={cn(
            'flex flex-wrap items-start pt-[3.25rem] pb-14',
            'lg:justify-center lg:pt-[min(3.854vw,98.6666666667px)] lg:pb-[4.5rem]',
          )}
          style={{ '--lw-basis': `${100 / perRow}%` } as React.CSSProperties}
        >
          {cells.map((cell, cellIndex) => {
            const position = (indexes[cellIndex] ?? 0) % cell.reel.length;

            return (
              <div
                key={cellIndex}
                /* Three short cells per row on a phone, not two square ones.
                   A square cell at `basis-1/2` is ~175px tall on a 390px
                   screen while the mark inside it is capped at 72px, so twelve
                   supporters occupied about 1050px of mostly empty page — the
                   single largest stretch of dead space on mobile. Same marks,
                   same order, a third of the height. Square returns at `lg`,
                   where a 12-column row makes the cell small enough for it to
                   be the right shape. */
                className={cn(
                  'relative shrink-0 grow-0',
                  'aspect-[3/2] basis-1/3',
                  'lg:aspect-square lg:basis-[var(--lw-basis)]',
                )}
              >
                <div className="relative size-full overflow-clip">
                  <div
                    aria-hidden
                    className={cn(
                      'flex w-full flex-col will-change-transform',
                      'transition-transform ease-[var(--ease-expo)]',
                    )}
                    style={{
                      // Percentages resolve against the reel's own height, so
                      // one item is 100 / reel length of it.
                      transform: `translate3d(0, ${-position * (100 / cell.reel.length)}%, 0)`,
                      transitionDuration: `${SLIDE_MS}ms`,
                    }}
                  >
                    {cell.reel.map((mark, markIndex) => (
                      <div
                        key={`${mark.src}-${markIndex}`}
                        className="flex aspect-[3/2] w-full shrink-0 grow-0 items-center justify-center lg:aspect-square"
                      >
                        {/* 85% is the reference's `min(95%, 85% * clamp(.5, var(--logo-scale), 2))`
                            resolved at the default scale of 1. */}
                        <span className="flex h-full max-h-[4.5rem] w-full max-w-[85%] items-center justify-center overflow-hidden">
                          <Image
                            src={mark.src}
                            alt=""
                            width={160}
                            height={40}
                            // The optimizer refuses SVG unless dangerouslyAllowSVG
                            // is set. It was skipped for every mark, though,
                            // so the .webp logos were being sent at 600px to
                            // fill a 94px box. Only SVG opts out now.
                            unoptimized={mark.src.endsWith('.svg')}
                            sizes="(min-width: 1024px) 120px, 30vw"
                            className={cn(
                              'h-full w-full object-contain object-center',
                              // The reference supplies pre-greyed marks; these
                              // placeholders are ink, so they are knocked back
                              // to the same reduced contrast.
                              'opacity-[0.55] [filter:grayscale(1)]',
                              'transition-opacity duration-500 ease-[var(--ease-out)]',
                            )}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
