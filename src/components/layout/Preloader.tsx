'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { preloaderSequence } from '@/content/data/preloader';
import { TechnicalGridBackground } from '@/components/shared/backgrounds/TechnicalGridBackground';
import { PreloaderStatement, statementRevealMs } from './preloader/PreloaderStatement';
import styles from './preloader/preloader.module.css';

/**
 * The entry layer: `preloaderSequence` set one sentence at a time, then
 * dissolved into the hero that was loading underneath it the whole time.
 *
 * THE SEQUENCE IS AN ARGUMENT, NOT A SLIDESHOW. Three beats — a question, the
 * settled position, and a two-word reversal — each written a word at a time and
 * separated by a pause. They are timed so the sentence that turns the argument
 * ("Until now.") is the shortest to write and the longest to sit, which is what
 * makes it read as an answer rather than as a third slide.
 *
 * IT USED TO BORROW THE HERO'S FIRST LINE. `hero.sequence[0]`, on the reasoning
 * that the overlay states the question and the hero answers it on scroll. The
 * copy is its own now (`content/data/preloader.ts`), which also gets a layout
 * component out of the LOCKED hero block. The hero still writes its own first
 * line on scroll; the two no longer have to agree.
 *
 * The type is still transcribed from the hero's (see preloader.module.css) —
 * not to line the two sentences up any more, but because it is the one heading
 * scale on the site big enough to carry a sentence alone on the screen.
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

/**
 * The stillness after a sentence has finished writing itself.
 *
 * Two values, because the last beat is doing a different job. Between
 * sentences the pause only has to be long enough to read a line and register
 * that it has ended — hold longer and the three beats stop feeling like one
 * argument. After "Until now." the hold is the turn itself: the point of the
 * sequence, and the only line the visitor should still be holding when the
 * film appears.
 */
const BEAT_HOLD_MS = 1200;
const FINAL_HOLD_MS = 2500;
/** One sentence clearing out before the next writes itself in. */
const BEAT_EXIT_MS = 260;
const EXIT_MS = 620;
/**
 * Reduced motion keeps both holds. That setting asks for less movement, not
 * less reading time — and since each beat is painted at once rather than
 * written, cutting the holds would leave no time to read them at all.
 */
const REDUCED_EXIT_MS = 200;

/**
 * Whether this entry is a return within the session.
 *
 * Read through `useSyncExternalStore` rather than resolved in an effect: the
 * value has to be known during render so the scroll lock and the schedule can
 * both branch on it, and setting state from an effect to learn it is what
 * `react-hooks/set-state-in-effect` exists to stop. The server snapshot is
 * `false` — the markup always contains the overlay, and the inline script in
 * the root layout is what hides it before paint for a returning visitor.
 *
 * The value cannot change while the page is open, so `subscribe` registers
 * nothing and returns a no-op teardown.
 */
const subscribeToSession = () => () => {};

function readReturning() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    // Private modes can throw on access. Showing the overlay once more is a
    // better failure than crashing the page over a curtain.
    return false;
  }
}

const readReturningOnServer = () => false;

/** Reveal + hold for one beat, in ms. Reduced motion has no reveal to wait on. */
function beatDurationMs(index: number, reducedMotion: boolean) {
  const beat = preloaderSequence[index];
  const isLast = index === preloaderSequence.length - 1;
  const reveal = reducedMotion || !beat ? 0 : statementRevealMs(beat.lines);
  return reveal + (isLast ? FINAL_HOLD_MS : BEAT_HOLD_MS);
}

export function Preloader() {
  const reducedMotion = useReducedMotion() === true;
  const [visible, setVisible] = useState(true);
  const [beat, setBeat] = useState(0);
  const returning = useSyncExternalStore(
    subscribeToSession,
    readReturning,
    readReturningOnServer,
  );

  /**
   * Walks the sequence: one timer per beat, re-armed as `beat` advances.
   *
   * The wait is the beat's own length plus, for every beat after the first,
   * the time the previous sentence takes to clear out — `AnimatePresence` in
   * `mode="wait"` does not mount the incoming beat until the outgoing one has
   * finished exiting, so its words do not start writing until then. Without
   * that term the schedule would run ahead of what is on screen, and the error
   * would compound across the sequence.
   */
  useEffect(() => {
    /* Already entered this session: drop it on the next tick rather than
       synchronously here. The stylesheet has had it at display:none since
       before the first paint, so there is nothing to see either way — this
       just takes the node out. */
    if (returning) {
      const timer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timer);
    }

    const isLast = beat === preloaderSequence.length - 1;
    const clearOut = beat === 0 ? 0 : reducedMotion ? REDUCED_EXIT_MS : BEAT_EXIT_MS;
    const timer = window.setTimeout(
      () => (isLast ? setVisible(false) : setBeat((current) => current + 1)),
      beatDurationMs(beat, reducedMotion) + clearOut,
    );

    return () => window.clearTimeout(timer);
  }, [beat, returning, reducedMotion]);

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
    if (!visible || returning) return;

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
  }, [visible, returning]);

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
            {/* `mode="wait"` so a sentence is fully gone before the next
                starts writing — two beats crossfading over each other would be
                unreadable at this size. `initial={false}` because each beat
                animates itself in a word at a time; a fade on the wrapper as
                well would blunt the first word of every sentence. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={beat}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{
                  duration: (reducedMotion ? REDUCED_EXIT_MS : BEAT_EXIT_MS) / 1000,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <PreloaderStatement
                  lines={preloaderSequence[beat]?.lines ?? []}
                  still={reducedMotion}
                  signed={beat === preloaderSequence.length - 1}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
