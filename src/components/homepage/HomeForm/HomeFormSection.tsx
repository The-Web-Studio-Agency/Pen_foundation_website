'use client';

import { ContactForm } from '@/components/contact/ContactForm';
import { RevealText } from '@/components/motion';
import { homeForm } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * The closing contact block, measured at 925px tall.
 *
 * The original tags this instance `--pt-none --pb-none`, so the section
 * contributes no vertical padding of its own — the blocks either side own the
 * spacing. The form card itself is the contact page's `ContactForm` unchanged:
 * the reference uses one component in both places, and so does this.
 */
export function HomeFormSection() {
  const [firstLine, secondLine] = homeForm.titleLines;

  return (
    <section className="site-gutter w-full bg-[var(--c-white)] py-0">
      <h2 className="title-si mx-auto max-w-[min(70rem,90vw)] pt-24 text-center text-balance">
        <RevealText text={firstLine} className="block" />
        {/* +1 for the break, so the wave carries on into the second line. */}
        <RevealText text={secondLine} indexOffset={firstLine.length + 1} className="block" />
      </h2>

      <div
        className={cn(
          'mx-auto mt-20 grid w-full max-w-[85rem] items-start gap-12',
          'lg:grid-cols-[45fr_55fr] lg:gap-16',
        )}
      >
        <div className="flex flex-col">
          <p className="body-3 text-[var(--c-dark-green)]">{homeForm.intro}</p>

          {/* The lime rule runs the height of the list; each item carries its
           * own lime dot, as on the reference. */}
          <ul className="mt-10 flex flex-col gap-5 border-l-[3px] border-[var(--c-accent)] pl-6">
            {homeForm.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-baseline gap-4 text-[1.4375rem] leading-[1.26] text-[var(--c-dark-green)]"
              >
                <span
                  aria-hidden
                  className="size-[0.4375rem] shrink-0 rounded-full bg-[var(--c-accent)]"
                />
                {bullet}
              </li>
            ))}
          </ul>

          <p className="mt-16 text-[1.25rem] text-[var(--c-light-gray)]">{homeForm.trustLabel}</p>

          <ul
            aria-label="Placeholder customer logos"
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6"
          >
            {homeForm.logos.map((logo, index) => (
              <li key={`${logo.src}-${index}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG
                    placeholder; the optimiser refuses SVG by default. */}
                <img
                  src={logo.src}
                  alt=""
                  aria-hidden
                  className="h-8 w-auto opacity-60 grayscale"
                />
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
