'use client';

import { RevealText } from '@/components/motion';
import { statement } from '@/content/data/homepage';

/**
 * A single centred sentence with one emphasised phrase, holding a full screen.
 *
 * It was measured at 570px against the reference; it now takes `section-screen`
 * like every other section. The mask stretches to whatever height the section
 * ends up, so the notch scales with it rather than staying a fixed 43px.
 *
 * Runs as a dark band: `bg-ink` and white type, the same pair the site footer
 * uses, so the page's two dark moments match. It is the one break in an
 * otherwise white run from the hero to the estimator, which is what makes the
 * sentence land — the statement is the pivot from the conventional problem to
 * the PEN approach, and it reads as a held beat rather than another section.
 *
 * `.section-mask` shapes the top and bottom edges into the site's notch profile
 * from `section.svg`. That replaces the `NotchSeparator` that used to sit above
 * this section: a separator pulls a coloured lip over the section above it and
 * shapes one edge, whereas the mask shapes both and belongs to the band itself,
 * so the dark block is self-contained between two white sections.
 *
 * The emphasis is a `<strong>` in the original but carries no extra weight —
 * `font-weight: inherit` keeps it matching, because what actually sets the
 * phrase apart is the character reveal passing through it. The three parts share
 * one running character offset so that wave never restarts mid-sentence, and
 * all three run `onDark` so the reveal uses the light-on-dark colour ramp
 * instead of warming to ink no one could read here.
 */
export function Statement() {
  const emphasisOffset = statement.before.length;
  const afterOffset = emphasisOffset + statement.emphasis.length;

  return (
    /* `py-32 md:py-40` is new, and it is what makes the band survive losing
       its floor. This section had NO vertical padding: on a landscape viewport
       `section-screen` still gives it a full screen and the sentence sits in
       the middle of it, but on a portrait one the floor lifts and, with no
       padding, the dark band would have shrink-wrapped the text. The held beat
       is the point of this section, so it now carries its own height. */
    <section className="section-mask relative flex section-screen w-full items-center justify-center overflow-hidden bg-ink py-32 text-[var(--c-white)] md:py-40">
      <h2 className="site-gutter title-si relative z-[1] max-w-[min(80rem,90vw)] text-center text-balance">
        <RevealText text={statement.before} onDark />
        <strong className="font-[inherit]">
          <RevealText text={statement.emphasis} indexOffset={emphasisOffset} onDark />
        </strong>
        <RevealText text={statement.after} indexOffset={afterOffset} onDark />
      </h2>
    </section>
  );
}
