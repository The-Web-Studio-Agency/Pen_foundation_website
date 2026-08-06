'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/shared/icons';
import { capabilitySteps } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * INTERACTION MODEL: scroll-driven at >=1024px, drag carousel below it — the
 * original swaps the same list between the two, it is never a click-tab UI.
 *
 * Desktop: the six titles stack with a 21.5rem gap and the media panel sticks
 * beside them, so the active step is simply whichever title is nearest the
 * middle of the viewport. Reading that from cached item centres (rather than
 * measuring on every frame) keeps the scroll handler free of layout work, and
 * state is only written when the index actually changes.
 *
 * Mobile: the same list becomes a scroll-snapping row. Native scrolling is the
 * drag — the original's custom drag handler and a snap rail land on the same
 * behaviour — and the progress bar tracks it.
 */

const STEP_COUNT = capabilitySteps.length;
const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** `--opacity-per-step: .3`: every step away from the active one drops 30%. */
const OPACITY_PER_STEP = 0.3;

const DIGITS = Array.from({ length: 10 }, (_, digit) => digit);

/** Steps are labelled 01…06, so the index is displayed one-based and padded. */
function stepLabel(index: number) {
  return String(index + 1).padStart(2, '0');
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * One column of the rolling counter: 0-9 stacked vertically, shifted up by
 * `digit` cells. The tens and units columns are separate elements so 01 -> 02
 * only rolls the units, exactly as the original does.
 */
function OdometerDigit({ digit }: { digit: number }) {
  return (
    <span className="block h-[var(--digit-height)] overflow-hidden">
      <span
        className={cn(
          'flex flex-col',
          'transition-transform duration-500 ease-[var(--ease-expo)] motion-reduce:transition-none',
        )}
        style={{ transform: `translateY(calc(${digit} * var(--digit-height) * -1))` }}
      >
        {DIGITS.map((value) => (
          <span key={value} className="flex h-[var(--digit-height)] items-center justify-center">
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Capabilities() {
  const [current, setCurrent] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  /** Document-relative centre of each title, refreshed only on resize/reflow. */
  const centersRef = useRef<number[]>([]);

  const { scrollY } = useScroll();

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const syncFromPageScroll = useCallback(() => {
    const centers = centersRef.current;
    if (centers.length !== STEP_COUNT) return;
    const focus = window.scrollY + window.innerHeight / 2;
    let nearest = 0;
    for (let index = 1; index < centers.length; index += 1) {
      if (Math.abs(centers[index] - focus) < Math.abs(centers[nearest] - focus)) {
        nearest = index;
      }
    }
    setCurrent((previous) => (previous === nearest ? previous : nearest));
  }, []);

  const remeasure = useCallback(() => {
    centersRef.current = itemRefs.current.map((item) => {
      if (!item) return Number.POSITIVE_INFINITY;
      const rect = item.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height / 2;
    });
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const handleReflow = () => {
      remeasure();
      syncFromPageScroll();
    };
    // ResizeObserver delivers a callback on observe(), so this both seeds the
    // measurements and refreshes them whenever the titles re-wrap.
    const observer = new ResizeObserver(handleReflow);
    const list = listRef.current;
    if (list) observer.observe(list);
    // A viewport-height change moves the focus line without resizing the list.
    window.addEventListener('resize', handleReflow);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleReflow);
    };
  }, [isDesktop, remeasure, syncFromPageScroll]);

  useMotionValueEvent(scrollY, 'change', () => {
    if (!isDesktop) return;
    syncFromPageScroll();
  });

  useEffect(() => {
    if (isDesktop) return;
    const rail = listRef.current;
    if (!rail) return;
    const sync = () => {
      const travel = rail.scrollWidth - rail.clientWidth;
      if (travel <= 0) return;
      const index = Math.round((rail.scrollLeft / travel) * (STEP_COUNT - 1));
      setCurrent((previous) => (previous === index ? previous : index));
    };
    rail.addEventListener('scroll', sync, { passive: true });
    // The rail can already be scrolled when this runs — e.g. after a resize
    // back across 1024px — so read its position once the layout has settled.
    const frame = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', sync);
    };
  }, [isDesktop]);

  /**
   * The arrows do not set the index directly — the index is derived from
   * scroll position, so they scroll the target step into the position that
   * makes it active and let the normal tracking follow.
   */
  const goToStep = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), STEP_COUNT - 1);
      const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
      if (isDesktop) {
        const center = centersRef.current[next];
        if (center === undefined || !Number.isFinite(center)) return;
        window.scrollTo({ top: center - window.innerHeight / 2, behavior });
        return;
      }
      const rail = listRef.current;
      if (!rail) return;
      const travel = rail.scrollWidth - rail.clientWidth;
      rail.scrollTo({ left: (travel / (STEP_COUNT - 1)) * next, behavior });
    },
    [isDesktop],
  );

  return (
    <section
      aria-label="Platform capabilities"
      className="relative bg-[var(--c-white)] pt-12 pb-[max(8rem,15vw)]"
    >
      <div
        className={cn(
          'flex flex-col gap-8',
          // 548px of titles and a 695px media panel inside the 1335px content
          // column at 1440px, with the 92px remainder falling between them.
          'lg:grid lg:grid-cols-[41.049%_52.06%] lg:justify-between lg:gap-0',
          'lg:items-start lg:px-[var(--spacing-gutter)]',
        )}
      >
        <div
          className={cn(
            'px-[var(--spacing-gutter)] lg:col-start-2 lg:row-start-1 lg:px-0',
            // Sticky within its grid area: the full-height wrapper keeps the
            // panel centred in the viewport while the titles scroll past it.
            'lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:self-start',
          )}
        >
          <div className="relative aspect-[400/480] w-full">
            {capabilitySteps.map((step, index) => (
              <Image
                key={step.media.src}
                src={step.media.src}
                alt={step.media.alt}
                width={400}
                height={480}
                sizes="(min-width: 1024px) 52vw, 90vw"
                aria-hidden={index !== current}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover',
                  'transition-opacity duration-500 ease-[var(--ease-out)] motion-reduce:transition-none',
                  index === current ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}

            <div className="absolute right-5 bottom-10 hidden justify-end gap-x-2.5 lg:flex">
              <button
                type="button"
                aria-label="Previous capability"
                onClick={() => goToStep(current - 1)}
                disabled={current === 0}
                className={cn(
                  'flex aspect-square size-11 cursor-pointer place-content-center place-items-center',
                  'rounded-[8px] bg-[var(--c-white)] text-[var(--c-dark-green)]',
                  'transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                <ArrowLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next capability"
                onClick={() => goToStep(current + 1)}
                disabled={current === STEP_COUNT - 1}
                className={cn(
                  'flex aspect-square size-11 cursor-pointer place-content-center place-items-center',
                  'rounded-[8px] bg-[var(--c-white)] text-[var(--c-dark-green)]',
                  'transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                <ArrowRightIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-1 lg:max-w-[27.1875rem]">
          <p
            className={cn(
              'hidden justify-end lg:flex',
              'relative top-[1.28rem] mb-[1.29rem]',
              'font-mono leading-[.81] text-[var(--c-light-gray)]',
              'text-[length:var(--odometer-font-size)]',
              '[--odometer-font-size:min(.677vw,17.3333333333px)]',
              // The original is `round(padding*2 + font-size*line-height, 1px)`;
              // the padding is .625rem a side and `round()` is dropped so an
              // unsupported function can never invalidate the whole variable.
              '[--digit-height:calc(1.25rem_+_var(--odometer-font-size)*.81)]',
            )}
          >
            <span className="sr-only">
              Capability {stepLabel(current)} of {stepLabel(STEP_COUNT - 1)}
            </span>
            <span aria-hidden className="flex">
              <OdometerDigit digit={Math.floor((current + 1) / 10)} />
              <OdometerDigit digit={(current + 1) % 10} />
            </span>
          </p>

          <p
            aria-hidden
            className={cn(
              'mb-4 px-[var(--spacing-gutter)] font-mono text-[.8125rem] leading-[.81]',
              'text-[var(--c-light-gray)] lg:hidden',
            )}
          >
            {stepLabel(current)}
          </p>

          <ul
            ref={listRef}
            className={cn(
              'no-scrollbar relative m-0 flex list-none p-0',
              'snap-x snap-mandatory gap-[var(--spacing-gutter)] overflow-x-auto',
              'scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)]',
              'lg:flex-col lg:gap-[21.5rem] lg:overflow-x-visible lg:px-0',
            )}
          >
            {capabilitySteps.map((step, index) => (
              <li
                key={step.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                style={{
                  // opacity = max(0, 1 - .3 * |index - current|)
                  opacity: Math.max(0, 1 - OPACITY_PER_STEP * Math.abs(index - current)),
                }}
                className={cn(
                  'w-[89.744vw] shrink-0 snap-start lg:w-full lg:shrink',
                  'transition-opacity duration-500 ease-[var(--ease-out)] motion-reduce:transition-none',
                )}
              >
                <p className="title-h3 m-0 font-normal text-[var(--c-dark-green)]">{step.title}</p>
              </li>
            ))}
          </ul>

          <div
            aria-hidden
            className={cn('mx-[5.128vw] mt-8 grid h-0.5 bg-[var(--c-dirty-white)] lg:hidden')}
          >
            <span
              className={cn(
                'h-full w-[calc(100%/6)] justify-self-start bg-[var(--c-black)]',
                'transition-[translate] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none',
              )}
              style={{ translate: `${current * 100}% 0` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
