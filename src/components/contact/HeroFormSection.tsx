import { ContactForm } from '@/components/contact/ContactForm';
import { RevealText } from '@/components/motion';
import { hero } from '@/content/data/contact';
import { cn } from '@/lib/utils';
import { GridBeam } from '@/components/shared/backgrounds/GridBeam';

/**
 * Top section: the two-line display heading, then a two-column split of
 * supporting copy (left) and the dark form panel (right). The columns only
 * become side-by-side at 1280px — below that the form stacks under the copy.
 *
 * A faint square grid sits behind everything at 20% opacity; the original
 * paints it on a canvas, which a repeating gradient reproduces.
 */
export function HeroFormSection() {
  // The page wrapper already applies `pt-nav` to clear the fixed header, so the
  // padding below only adds breathing room under it — the reference site's
  // larger value assumed a header that scrolls away with the page.
  return (
    <div className="relative w-full pt-2 lg:pt-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="bg-grid-canvas size-full text-[var(--c-dark-green)]/25" />
      </div>
      <GridBeam duration={11} />

      <div className="relative z-[1]">
        {/* `site-gutter`, not the `px-5` this was ported with: it is the gutter
            every other section on the site uses, including the two below this
            one and the footer. With a gutter of its own, nothing on the page
            shared a left edge. */}
        <div className="site-gutter flex flex-col gap-8 py-12">
          <div className="mx-auto text-center text-balance text-[var(--c-dark-green)]">
            <RevealText
              as="h1"
              text={hero.titleLines[0]}
              className={cn(
                'block font-normal',
                'text-[min(2.5rem,10.256vw)] leading-[1.05] tracking-[min(-0.05rem,-0.205vw)]',
                'lg:text-[min(3.333vw,85.3333px)] lg:tracking-[min(-0.033vw,-0.8533px)]',
              )}
            />
            <RevealText
              as="h2"
              text={hero.titleLines[1]}
              indexOffset={hero.titleLines[0].length}
              className={cn(
                'block font-normal',
                'text-[min(2.5rem,10.256vw)] leading-[1.05] tracking-[min(-0.05rem,-0.205vw)]',
                'lg:text-[min(3.333vw,85.3333px)] lg:tracking-[min(-0.033vw,-0.8533px)]',
              )}
            />
          </div>

          <div
            className={cn(
              'flex flex-col items-center gap-14',
              'xl:grid xl:grid-cols-2 xl:items-start xl:gap-10',
            )}
          >
            <div
              className={cn(
                'flex w-full min-w-0 flex-col gap-10 lg:gap-12',
                /* Anchored to the container's left edge, not centred inside its
                   grid cell. Centring two different-width blocks in two equal
                   cells is what left the outer margins unequal (180px against
                   210px at 1920) and opened a 390px trench up the middle. */
                '3xl:max-w-[47.5rem] xl:max-w-[37.5rem] xl:justify-self-start',
              )}
            >
              <RevealText
                as="h2"
                text={hero.infoHeading}
                className="title-h2 block font-normal text-[var(--c-dark-green)]"
              />

              <div className="flex flex-col gap-3">
                <p className="text-[1.4375rem] leading-[1.26] tracking-[-0.014375rem] text-[var(--c-dark-green)]">
                  {hero.infoBody}
                </p>

                <ul className="mt-3 flex flex-col gap-3 border-l-[3px] border-[var(--c-accent)] pl-6">
                  {hero.bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-6">
                      <span
                        aria-hidden
                        className="absolute left-0 text-[1.4375rem] leading-none text-[var(--c-accent)]"
                      >
                        •
                      </span>
                      <p className="text-[1.4375rem] leading-[1.26] tracking-[-0.014375rem] text-[var(--c-dark-green)]">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-[1.4375rem] leading-[1.26] tracking-[-0.014375rem] text-[var(--c-dark-gray)]">
                  {hero.trustLabel}
                </p>
              </div>
            </div>

            {/* Fills its half of the row rather than sitting at the component's
                own 33.75rem/40rem cap. Those caps are narrower than the column
                on a wide screen, and because the copy opposite is capped too,
                the two together left ~380px of empty grid up the middle of the
                section at 1920. The panel is the element that can absorb the
                width — its fields are already a two-column grid — where the
                copy cannot without pushing the measure past a readable line. */}
            <ContactForm className="xl:max-w-none 3xl:max-w-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
