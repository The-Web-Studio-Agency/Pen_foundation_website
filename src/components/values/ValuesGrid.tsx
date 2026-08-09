import { cn } from '@/lib/utils';
import type { ValueCardContent } from '@/types/values';

import { ValueCard } from './ValueCard';

/**
 * The cards column.
 *
 * A flex column rather than a grid: the cards are a single stack at every
 * width, and the only thing that changes across the breakpoint is the gap
 * between them and the inset that holds them off the sticky copy beside them.
 */

interface ValuesGridProps {
  cards: ValueCardContent[];
  /** `useId()` value from the section, threaded down to the SVG ids. */
  prefix: string;
  className?: string;
}

export function ValuesGrid({ cards, prefix, className }: ValuesGridProps) {
  return (
    <div className={cn('relative lg:pl-[min(2.083vw,53.3333px)]', className)}>
      <div className="flex flex-col gap-6 lg:gap-12">
        {cards.map((card, index) => (
          <ValueCard key={card.id} card={card} index={index} prefix={prefix} />
        ))}
      </div>
    </div>
  );
}
