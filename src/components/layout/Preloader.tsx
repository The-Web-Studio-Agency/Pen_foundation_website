'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { hero } from '@/content/data/homepage';
import { TechnicalGridBackground } from '@/components/shared/backgrounds/TechnicalGridBackground';
import { PreloaderStatement } from './preloader/PreloaderStatement';
import styles from './preloader/preloader.module.css';

/**
 * The entry layer: `hero.sequence[0]` shown as an opening statement, then
 * dissolved into the hero that was loading underneath it the whole time.
 *
 * WHY THE SAME SENTENCE TWICE IS NOT A REPEAT. The statement is the hero's own
 * first heading, and the hero paints that heading at `opacity: 0` until the
 * scrub has moved (`REVEAL_START = 0.12` in heroAnimation.ts). So at rest the
 * hero shows the film and nothing else: the overlay lifts, the sentence is
 * gone, and scrolling writes it back one character at a time. The overlay
 * states the question; the hero answers it on the reader's action.
 *
 * That is also why the type is transcribed exactly (see preloader.module.css):
 * the sentence sits at the position and the scale the hero would set it at, so
 * the dissolve reveals footage already in place and nothing shifts or
 * re-lays-out.
 *
 * THE GROUND IS THE "THREE WEEKS…" SECTION'S, NOT THE HERO'S. It was `#000`,
 * matching the hero stage behind its video, which made the hand-off invisible.
 * It is now that section's white under `TechnicalGridBackground` — so the entry
 * opens on the engineering-drawing surface the page argues on, and the curtain
 * reads as lifting off the film rather than as the film brightening. The
 * trade is deliberate: the dissolve is now a light-to-dark fade rather than an
 * imperceptible one. It stays clean because the hero holds its own heading at
 * `opacity: 0` until the scrub moves, so there is no moment where a dark
 * headline and a light one are both on screen.
 *
 * WHAT IT DOES NOT DO. It does not gate the page: the hero, its video and every
 * section below mount and load normally underneath from the first frame. This
 * is a curtain over a stage that is already set, not a queue to get in. It runs
 * on a fixed, short schedule and gets out of the way whether or not the video
 * has buffered — a preloader that waits on a 15MB scrub file would be the
 * bottleneck it is supposed to hide.
 */

/** Marks the session so the overlay is an entry, not a page transition. */
const SESSION_KEY = 'pen-entered';
/** Mirrors the attribute the inline script in the root layout sets. */
const ENTERED_ATTR = 'data-pen-entered';

/** The last word lands at ~1.17s; this is the beat of silence after it. */
const HOLD_MS = 380;
const EXIT_MS = 620;
/** Reduced motion: the composition, read, and out. No rising type, no drift. */
const REDUCED_HOLD_MS = 520;
const REDUCED_EXIT_MS = 200;

export function Preloader() {
  const reducedMotion = useReducedMotion() === true;
  const [visible, setVisible] = useState(true);
  // Set synchronously on the first client render so the exit choreography and
  // the scroll lock agree about which schedule they are on.
  const skipped = useRef(false);

  useEffect(() => {
    let entered = false;
    try {
      entered = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // Private modes can throw on access. Showing the overlay once more is a
      // better failure than crashing the page over a curtain.
    }

    skipped.current = entered;

    const hold = reducedMotion ? REDUCED_HOLD_MS : HOLD_MS;
    // The reveal's own length, then the hold. Reduced motion has no reveal.
    const revealMs = reducedMotion ? 0 : 1170;
    /* Already entered this session: drop it on the next tick rather than
       synchronously here. The stylesheet has had it at display:none since
       before the first paint, so there is nothing to see either way — this
       just takes the node out. */
    const timer = window.setTimeout(() => setVisible(false), entered ? 0 : revealMs + hold);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  /**
   * Hold the page still while the curtain is up.
   *
   * Without this a scroll during the overlay advances the hero scrub behind it,
   * and the film is already part-way through its first heading when the curtain
   * lifts — the one thing that would make the hand-off look like two animations
   * instead of one. The scrollbar's width is given back as padding so locking
   * does not shift the layout by the 4px the custom scrollbar occupies.
   */
  useEffect(() => {
    if (!visible || skipped.current) return;

    const root = document.documentElement;
    const gutter = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    root.style.overflow = 'hidden';
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    // A refresh can restore a scroll position; the curtain always opens on the
    // top of the film.
    window.scrollTo(0, 0);

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
    };
  }, [visible]);

  /** Written once the overlay is on its way out, so a refresh does not replay it. */
  const remember = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* see above */
    }
    document.documentElement.setAttribute(ENTERED_ATTR, '');
  };

  return (
    <AnimatePresence onExitComplete={remember}>
      {visible ? (
        <motion.div
          className={styles.root}
          /* A stable hook for the two rules that must reach this element from
             outside the CSS module, where the class name is hashed: the
             `<noscript>` block in the root layout, and nothing else. */
          data-preloader=""
          /* `initial={false}`: the overlay is in the server HTML and already
             painted, so animating it in would be a fade from nothing over a
             page that is briefly visible — the flash this exists to prevent. */
          initial={false}
          exit={{ opacity: 0 }}
          transition={{
            duration: (reducedMotion ? REDUCED_EXIT_MS : EXIT_MS) / 1000,
            ease: EASE_OUT_EXPO,
          }}
          /* The whole overlay is decorative chrome over a page that is already
             mounted and reachable; the statement inside carries the readable
             sentence for screen readers. */
          role="presentation"
        >
          {/* The section's backdrop. No `withBase` — the white ground is on
              `.root`; see the note there. */}
          <TechnicalGridBackground />

          <motion.div
            className={styles.content}
            exit={reducedMotion ? { opacity: 0 } : { y: -18, opacity: 0 }}
            transition={{
              duration: (reducedMotion ? REDUCED_EXIT_MS : EXIT_MS) / 1000,
              ease: EASE_OUT_EXPO,
            }}
          >
            <PreloaderStatement lines={hero.sequence[0]?.lines ?? []} still={reducedMotion} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
