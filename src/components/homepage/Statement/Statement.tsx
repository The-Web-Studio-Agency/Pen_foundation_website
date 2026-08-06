'use client';

import { RevealText } from '@/components/motion';
import { DotGrid } from '@/components/homepage/shared/DotGrid';
import { statement } from '@/content/data/homepage';

/**
 * A single centred sentence with one emphasised phrase, measured at 570px tall.
 *
 * The emphasis is a `<strong>` in the original but carries no extra weight —
 * `font-weight: inherit` keeps it matching, because what actually sets the
 * phrase apart is the character reveal passing through it. The three parts share
 * one running character offset so that wave never restarts mid-sentence.
 */
export function Statement() {
  const emphasisOffset = statement.before.length;
  const afterOffset = emphasisOffset + statement.emphasis.length;

  return (
    <section className="relative flex h-[570px] w-full items-center justify-center overflow-hidden bg-[var(--c-white)]">
      <DotGrid />
      <h2 className="site-gutter title-si relative z-[1] max-w-[min(80rem,90vw)] text-center text-balance">
        <RevealText text={statement.before} />
        <strong className="font-[inherit]">
          <RevealText text={statement.emphasis} indexOffset={emphasisOffset} />
        </strong>
        <RevealText text={statement.after} indexOffset={afterOffset} />
      </h2>
    </section>
  );
}
