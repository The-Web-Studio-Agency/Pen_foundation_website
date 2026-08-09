'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { ValueCardContent } from '@/types/values';

import { CARD_BORDER_PATHS, CARD_SHAPE_COUNT, cardEnter } from './ValuesAnimations';
import { ValueCardBorder } from './ValueCardBorder';
import { ValueGlyph } from './ValueGlyph';
import { ValueItem } from './ValueItem';

/**
 * One value card: a glyph and its figures across the top, the claim below.
 *
 * The card has no background of its own — the page shows through the notched
 * silhouette, and the only thing describing its edge is the animated outline.
 * `clip-path` does the cutting so the corners stay proportional at every width;
 * `overflow-hidden` then keeps content off the cuts.
 *
 * `shapeIndex` wraps past three so a fourth card reuses the first silhouette
 * rather than rendering an unclipped rectangle among clipped ones.
 */

interface ValueCardProps {
  card: ValueCardContent;
  index: number;
  /** `useId()` value from the section, for the clip and filter ids. */
  prefix: string;
  className?: string;
}

export function ValueCard({ card, index, prefix, className }: ValueCardProps) {
  const shapeIndex = index % CARD_SHAPE_COUNT;

  return (
    <motion.article
      className={cn('relative', className)}
      variants={cardEnter}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="relative">
        <div
          className="relative flex flex-col gap-6 overflow-hidden rounded-[1.25rem] p-[2.375rem] lg:p-[4rem_4.375rem]"
          style={{ clipPath: `url(#${prefix}-card-clip-${shapeIndex})` }}
        >
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-12">
            <figure className="mx-auto w-full max-w-[10.125rem] shrink-0 overflow-hidden lg:mx-0 lg:max-w-[16.5rem]">
              <ValueGlyph name={card.glyph} className="h-auto w-full text-teal" />
            </figure>

            <dl className="flex w-full flex-1 flex-wrap justify-center gap-4 lg:w-auto lg:flex-col lg:flex-nowrap lg:justify-start">
              {card.proofPoints.map((point) => (
                <ValueItem key={point.label} {...point} />
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-4 lg:max-w-[32.5rem]">
            <h3 className="text-[1.5rem] leading-[1.25] font-normal tracking-[-0.015rem] text-[var(--c-dark-green)] lg:text-[1.875rem] lg:tracking-[-0.01875rem]">
              {card.title}
            </h3>
            <p className="text-base leading-[1.4] tracking-[-0.01125rem] text-[var(--c-dark-gray)] lg:leading-[1.35] lg:tracking-[-0.0125rem]">
              {card.body}
            </p>
          </div>
        </div>

        <ValueCardBorder d={CARD_BORDER_PATHS[shapeIndex]} prefix={prefix} index={shapeIndex} />
      </div>
    </motion.article>
  );
}
