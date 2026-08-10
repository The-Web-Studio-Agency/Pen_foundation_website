import Image from 'next/image';
import Link from 'next/link';

import { inAction } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * Three cards under a centred heading, in the reference's stacked order:
 * numbered mono eyebrow, title, body, picture, then a full-width button.
 *
 * Not `MediaCard`. That card leads on a square image and hangs its text
 * underneath, with the action hidden in a pill that only appears on hover —
 * the opposite arrangement, and an action a touch device never sees. This one
 * reads top-down and ends on a button that is always visible. `MediaCard`
 * stays where it is for /resources, which is built around its shape.
 *
 * The step number is derived from position rather than stored on the content:
 * it is an index, and writing it down would let it disagree with the order the
 * cards are actually in.
 *
 * A server component — three static cards, no state. The button's hover is
 * pure CSS, so nothing here needs to reach the browser.
 */
export function InAction() {
  return (
    <section
      id={inAction.id}
      className={cn(
        'flex section-screen scroll-mt-nav flex-col justify-center',
        'site-column py-15 lg:py-[5.625rem]',
      )}
    >
      <div className="mb-10 flex flex-col gap-4 text-center lg:mb-16">
        <h2 className="title-h2 m-0 font-normal text-balance text-[var(--c-dark-green)]">
          {inAction.title}
        </h2>
      </div>

      <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-[1.875rem]">
        {inAction.cards.map((card, index) => (
          <li
            key={card.title}
            className="flex flex-col rounded-2xl bg-[var(--c-dirty-white)] p-8 lg:p-10"
          >
            <p className="label-4 flex items-center gap-3 text-[var(--c-dark-gray)] uppercase">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{card.category}</span>
            </p>

            <h3 className="title-h3 mt-6 font-[450] text-[var(--c-dark-green)]">{card.title}</h3>

            <p className="mt-4 text-[var(--c-dark-green)]/70">{card.excerpt}</p>

            {/* `mt-auto` on the picture, not the button: it pushes the picture
                and everything after it to the bottom, so the three cards line
                their images and buttons up even though the copy above runs to
                different lengths. */}
            <div className="mt-auto pt-8">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>

            <Link
              href={card.href}
              className={cn(
                'label-4 mt-8 flex w-full items-center justify-center rounded-xl px-6 py-5 uppercase',
                // `label-4` sets line-height 0.81 for single-line mono labels;
                // an explicit leading keeps a wrapped label from colliding.
                'text-center leading-[1.5] no-underline',
                'bg-white text-[var(--c-dark-green)] transition-colors duration-300',
                'fine:hover:bg-ink fine:hover:text-white',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-dark-green)]',
              )}
            >
              {card.actionLabel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
