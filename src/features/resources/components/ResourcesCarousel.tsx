'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ResourceCard } from './ResourceCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/shared/icons';
import { cn } from '@/lib/utils';
import type { CarouselSection } from '@/types/contact';

/** Width of one slide plus its gap, matching the original's 21.875rem + 24px. */
const SLIDE_STEP = 350 + 24;

/**
 * Horizontally scrolling card rail with prev/next buttons. Scrolling is native
 * (so trackpads and touch work as expected); the buttons just nudge the rail by
 * one slide and disable themselves at each end.
 */
export function ResourcesCarousel({ section, id }: { section: CarouselSection; id?: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      rail.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const nudge = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * SLIDE_STEP,
      behavior: 'smooth',
    });
  };

  const navButton = cn(
    'flex size-15 items-center justify-center rounded-lg bg-[var(--c-dark-green-05)]',
    'text-[var(--c-dark-green)] transition-colors duration-200',
    'fine:hover:bg-[var(--c-dark-green-15)]',
    'disabled:cursor-not-allowed disabled:opacity-40',
  );

  return (
    <section id={id} className={cn('py-15 lg:py-[5.625rem]', id && 'scroll-mt-nav')}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4 px-5 lg:px-[4.375rem]">
          <div className="flex flex-col gap-1">
            <p className="body-3 m-0 text-[var(--c-dark-gray)]">{section.eyebrow}</p>
            <h2 className="title-h2 m-0 font-normal text-[var(--c-dark-green)]">{section.title}</h2>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => nudge(-1)}
              disabled={atStart}
              className={navButton}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => nudge(1)}
              disabled={atEnd}
              className={navButton}
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </header>

        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 lg:px-[4.375rem]"
        >
          {section.cards.map((card) => (
            <div key={card.title} className="w-[min(21.875rem,80vw)] shrink-0 snap-start">
              <ResourceCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
