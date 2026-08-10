'use client';

import { ContactForm } from '@/components/contact/ContactForm';
import { RevealText } from '@/components/motion';
import { homeForm } from '@/content/data/homepage';

/**
 * The closing contact block: eyebrow, heading, one line of intent, then the
 * form on its own.
 *
 * The supporting column the reference put beside the card — bullets, trust
 * label, logo row — is gone. The page has already made every one of those
 * arguments by the time a reader arrives here, so the block asks rather than
 * re-sells. The single intro line stays because it does something the bullets
 * did not: it says what submitting the form actually starts, which is the last
 * thing a visitor wants to know before committing.
 *
 * With nothing beside it the card is centred and given its own width instead
 * of the two-column split's: `max-w-[64rem]` overrides the caps ContactForm
 * carries for /contact, where it is the narrow half of a split. Everything on
 * this section shares that one measure, so heading and card share an axis and
 * both edges line up.
 *
 * The FAQ now follows this block, so the extra closing space that used to sit
 * here moved with it — the footer-lip clearance belongs to whichever section
 * is last, and that is no longer this one.
 *
 * `id="contact"` so anything on the page can jump straight to the form.
 */
export function HomeFormSection() {
  const [firstLine, secondLine] = homeForm.titleLines;

  return (
    <section
      id="contact"
      className="site-gutter flex min-h-svh w-full scroll-mt-nav flex-col justify-center bg-[var(--c-white)] pt-0 pb-8"
    >
      <div className="mx-auto flex w-full max-w-[64rem] flex-col items-center">
        <h2 className="title-si pt-24 text-center text-balance">
          <RevealText text={firstLine} className="block" />
          {/* +1 for the break, so the wave carries on into the second line. */}
          <RevealText text={secondLine} indexOffset={firstLine.length + 1} className="block" />
        </h2>

        <p className="body-3 mt-8 max-w-2xl text-center text-[var(--c-dark-green)]/70">
          {homeForm.intro}
        </p>

        {/* Narrower than the 64rem measure the heading and intro share, so the
            card reads as a form rather than a full-width panel.

            All three breakpoints have to be restated: ContactForm carries its
            own `xl:max-w-[33.75rem]` and `3xl:max-w-[40rem]` caps for
            /contact, and twMerge keeps only the last max-width it sees at each
            breakpoint — setting the base alone would leave those two winning
            on wide screens. */}
        <ContactForm
          submitLabel={homeForm.submitLabel}
          className="mt-14 max-w-[54rem] 3xl:max-w-[54rem] xl:max-w-[54rem]"
        />
      </div>
    </section>
  );
}
