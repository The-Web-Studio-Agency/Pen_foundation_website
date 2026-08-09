import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * Square-cropped media card: image, category, title, optional excerpt.
 *
 * Promoted here from `features/resources/components/ResourceCard` when the
 * homepage needed the same card. ESLint enforces a one-way dependency —
 * `components/` may not import from `features/` — and the rule's own message
 * prescribes exactly this move: "Promote the shared part to
 * src/components/shared". The resources feature now renders this component, so
 * there is one card, not two that drift.
 *
 * The markup is unchanged from the original: the image sits pre-zoomed at
 * scale(1.2) and eases back to 1 over 1.2s on hover — the reverse of the usual
 * zoom-in — while an action pill fades in over the bottom-right corner and the
 * title picks up an underline.
 */
export interface MediaCardData {
  category: string;
  title: string;
  excerpt?: string;
  href: string;
  image: { src: string; alt: string };
  actionLabel: string;
}

export function MediaCard({ card }: { card: MediaCardData }) {
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
            <h3 className="relative inline text-xl leading-normal font-medium text-[#012c32]">
              {card.title}
              <span
                aria-hidden
                className={cn(
                  'absolute -bottom-0.5 left-0 z-[1] block h-px w-full origin-left scale-x-0 bg-[#012c32]',
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
