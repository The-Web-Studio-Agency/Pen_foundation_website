import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { ResourceCard as ResourceCardData } from '@/types/contact';

/**
 * Square-cropped card used by both featured grids and the carousel.
 *
 * The image sits pre-zoomed at scale(1.2) and eases back to 1 over 1.2s on
 * hover — the reverse of the usual zoom-in — while an action pill fades in over
 * the bottom-right corner and the title picks up an underline.
 */
export function ResourceCard({ card }: { card: ResourceCardData }) {
  return (
    <article className="group overflow-clip">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden rounded-lg">
        <Link
          href={card.href}
          className="relative block w-full overflow-hidden rounded-lg no-underline"
        >
          <Image
            src={card.image.src}
            alt={card.image.alt}
            width={1040}
            height={1040}
            className={cn(
              'aspect-square w-full rounded-lg bg-[#e5e7eb] object-cover',
              'scale-[1.2] transition-transform duration-[1200ms] ease-out',
              'group-hover:scale-100',
            )}
          />
          <span
            className={cn(
              'absolute right-6 bottom-6 z-[1] flex h-10 w-[124px] items-center justify-center rounded-lg lg:w-20',
              'bg-[#f3f4f4] text-[var(--c-dark-green)]',
              'font-mono text-[11px] leading-[0.81] font-semibold tracking-[1.98px] uppercase',
              'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            )}
          >
            {card.actionLabel}
          </span>
        </Link>

        <div className="flex w-full flex-col items-start gap-2 self-stretch">
          <p className="text-xs leading-[146%] tracking-[-0.12px] text-[#6b7280] uppercase">
            {card.category}
          </p>
          <Link href={card.href} className="no-underline">
            <h3 className="relative inline text-xl leading-normal font-medium text-[#052424]">
              {card.title}
              <span
                aria-hidden
                className={cn(
                  'absolute -bottom-0.5 left-0 z-[1] block h-px w-full origin-left scale-x-0 bg-[#052424]',
                  'transition-transform duration-600 ease-in-out group-hover:scale-x-100',
                )}
              />
            </h3>
          </Link>
          {card.excerpt ? (
            <p className="line-clamp-2 text-lg leading-[146%] tracking-[-0.18px] text-[#6b7280]">
              {card.excerpt}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
