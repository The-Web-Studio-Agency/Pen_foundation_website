'use client';

import { useId, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

import { values as defaultValues } from '@/content/data/values';
import { cn } from '@/lib/utils';
import type { ValuesContent } from '@/types/values';

import { ValuesBackground } from './ValuesBackground';
import { ValuesGrid } from './ValuesGrid';
import { ValuesHeader } from './ValuesHeader';

/**
 * "Our Value" — a sticky argument beside the evidence that carries it.
 *
 * Two columns of the site's 12-column grid each, from `lg` up: the copy sticks
 * while the cards scroll past it, which is what makes three separate claims
 * read as one. Below `lg` the grid collapses and the copy simply sits above the
 * stack.
 *
 * Content defaults to `content/data/values.ts` but is fully injectable, so the
 * same section can carry a different argument on another route without a fork.
 *
 * Structure and measurements reverse-engineered from the reference recorded in
 * docs/research/clones/terminal-industries.com/what-is-terminal-yos/.
 */

interface ValuesSectionProps {
  content?: ValuesContent;
  id?: string;
  className?: string;
}

export function ValuesSection({ content = defaultValues, id, className }: ValuesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefix = useId().replace(/:/g, '');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['1.5%', '-2.5%']);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={content.eyebrow}
      className={cn(
        'relative w-full bg-white py-[3.75rem] text-[var(--c-dark-green)]',
        // `px-6`, not the `px-5` this was ported with: on /about the block
        // above it is padded 24px and this one was 20px, so the two sections'
        // left edges sat four pixels apart on every phone. The `lg` value is
        // untouched — above that breakpoint both resolve to the same gutter.
        'px-6 lg:px-[min(3.646vw,93.3333px)] lg:py-[8.75rem]',
        className,
      )}
    >
      <ValuesBackground prefix={prefix} />

      <div
        className={cn(
          'relative flex flex-col',
          'lg:grid lg:grid-cols-12 lg:gap-x-[min(1.042vw,26.6667px)]',
        )}
      >
        <ValuesHeader
          eyebrow={content.eyebrow}
          heading={content.heading}
          intro={content.intro}
          y={y}
          className="mb-[3.75rem] lg:col-span-6 lg:mb-0"
        />

        <ValuesGrid cards={content.cards} prefix={prefix} className="lg:col-span-6" />
      </div>
    </section>
  );
}
