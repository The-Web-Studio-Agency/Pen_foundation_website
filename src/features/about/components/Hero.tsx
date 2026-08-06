import { RevealText } from '@/components/motion';
import { cn } from '@/lib/utils';
import { hero } from '../content';
import { GridBeam } from '@/components/shared/backgrounds/GridBeam';

/**
 * About hero.
 *
 * Uses the contact hero's treatment — a faint square grid behind a large,
 * centred, two-line display heading whose characters warm through the accent
 * as it enters view — while keeping About's own copy. The form panel, bullet
 * list and customer logos from that page are deliberately not carried over:
 * they belong to a contact flow, not an about page.
 *
 * The heading is one <h1> holding two block lines, rather than the contact
 * page's h1-then-h2 pair, which promotes a visual line break into a
 * second-level heading.
 */
const HEADING_LINE = cn(
  'block font-normal',
  'text-[min(2.5rem,10.256vw)] leading-[1.05] tracking-[min(-0.05rem,-0.205vw)]',
  'lg:text-[min(3.333vw,85.3333px)] lg:tracking-[min(-0.033vw,-0.8533px)]',
);

export function Hero() {
  // Top padding clears the fixed header (--spacing-nav) plus the same small
  // breathing room the contact hero uses, so the two stay visually matched.
  return (
    <section className="relative w-full overflow-hidden pt-[calc(var(--spacing-nav)+0.5rem)] pb-20 lg:pt-[calc(var(--spacing-nav)+1rem)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="bg-grid-canvas size-full text-[var(--c-dark-green)]/25" />
      </div>
      <GridBeam duration={11} />

      <div className="relative z-[1] flex flex-col gap-8 px-5 py-12">
        <div className="mx-auto text-center text-balance text-[var(--c-dark-green)]">
          <p className="mb-6 text-sm text-[var(--c-dark-gray)]">{hero.eyebrow}</p>

          <h1>
            {hero.titleLines.map((line, i) => (
              <RevealText
                key={line}
                as="span"
                text={line}
                // Keeps one continuous character wave across the line break.
                indexOffset={hero.titleLines.slice(0, i).reduce((n, l) => n + l.length + 1, 0)}
                className={HEADING_LINE}
              />
            ))}
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[var(--c-dark-gray)]">
            {hero.body}
          </p>
        </div>
      </div>
    </section>
  );
}
