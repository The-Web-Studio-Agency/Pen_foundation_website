'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  cells: { reel: { src: string; alt: string }[] }[];
  className?: string;
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

export function LogoWall({ heading, cells, className }: LogoWallProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
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

  /**
   * The reference measures its own intro and publishes the height as
   * `--lw-intro-h`, which the grid's top padding is built from. The `calc()`
   * fallbacks (7rem / 10rem) cover the first paint before this lands.
   */
  useEffect(() => {
    const intro = introRef.current;
    const target = windowRef.current;
    if (!intro || !target) return;

    const sync = () => target.style.setProperty('--lw-intro-h', `${intro.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(intro);
    return () => observer.disconnect();
  }, [heading]);

  const perRow = Math.min(DESKTOP_MAX_PER_ROW, Math.max(cells.length, 1));
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
      <div
        ref={windowRef}
        className={cn(
          'relative [grid-column:1/span_2] lg:[grid-column:2/span_10]',
          heading &&
            'pt-[calc(var(--lw-intro-h,7rem)+3.25rem)] lg:pt-[calc(var(--lw-intro-h,10rem)+min(3.854vw,98.6666666667px))]',
        )}
      >
        {heading ? (
          <div
            ref={introRef}
            className={cn(
              'absolute inset-x-0 top-10 z-[2] px-5 text-center text-balance',
              'lg:top-[min(3.125vw,80px)] lg:px-[4.375rem]',
            )}
          >
            <RevealText as="h2" text={heading} className="title-si" />
          </div>
        ) : null}

        <div
          role="img"
          aria-label={wallLabel}
          className={cn(
            'flex flex-wrap items-start pt-[3.125rem] pb-14',
            'lg:justify-center lg:py-[4.5rem]',
          )}
          style={{ '--lw-basis': `${100 / perRow}%` } as React.CSSProperties}
        >
          {cells.map((cell, cellIndex) => {
            const position = (indexes[cellIndex] ?? 0) % cell.reel.length;

            return (
              <div
                key={cellIndex}
                className="relative aspect-square shrink-0 grow-0 basis-1/2 lg:basis-[var(--lw-basis)]"
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
                        className="flex aspect-square w-full shrink-0 grow-0 items-center justify-center"
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
                            // is set, and these placeholders are all SVG.
                            unoptimized
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
