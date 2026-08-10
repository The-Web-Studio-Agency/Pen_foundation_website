'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { preloaderSequence } from '@/content/data/preloader';
import { CornerMark, TechnicalLineField } from './TechnicalLineField';
import { PreloaderStatement, statementRevealMs } from './PreloaderStatement';
import {
  BEAT_EXIT_MS,
  BEAT_HOLD_MS,
  EXIT_MS,
  EXIT_TOTAL_MS,
  FINAL_HOLD_MS,
  MAX_WAIT_MS,
  MOUNT_GRACE_MS,
  REDUCED_EXIT_MS,
  REDUCED_STATEMENT_START_MS,
  STATEMENT_START_MS,
  entryVariables,
} from './timeline';
import styles from './preloader.module.css';

/**
 * The entry, in two acts: a setting-out drawing assembling itself around an
 * empty centre, then the statement written into that centre — three beats of
 * copy, a word at a time. It closes by retracting to a single line.
 *
 * WHAT THIS COMPONENT ACTUALLY DOES. None of act one. The field is CSS
 * keyframes on server-rendered markup, so it begins drawing in the frame the
 * panel is painted rather than whenever the bundle finishes arriving — a
 * distinction worth a second or more on this app, which ships R3F and framer
 * before it can hydrate, and the reason the drawing is what fills that gap
 * instead of a still screen. Act two needs React, because a sentence written a
 * word at a time is a schedule, not a keyframe. See timeline.ts for the whole
 * shape.
 *
 * IT IS A CURTAIN, NOT A QUEUE. Everything below mounts and loads normally from
 * the first frame; the hero's 15MB scrub film is deliberately not waited on,
 * because an entry that waits for it has become the bottleneck it exists to
 * hide. What it does wait for, before handing the centre to type, is
 * `document.fonts.ready` — cheap, and it is what stops the statement being set
 * twice. Capped by `MAX_WAIT_MS`, with the 8s CSS failsafe behind that.
 *
 * THE EXIT IS A RETRACTION. The panel closes onto its own horizontal centre
 * line and the last thing on screen is that line, dissolving — the drawing
 * reduced to one stroke. Not a fade: a fade says the picture was a picture, and
 * this one is supposed to have been a mechanism.
 *
 * ONE ENTRY PER SESSION. `sessionStorage` plus the inline script in the root
 * layout, which hides the panel before the first paint on a return visit so
 * there is never a frame of it. That script is also why `<html>` carries
 * `suppressHydrationWarning`.
 */

/** Marks the session so the overlay is an entry, not a page transition. */
const SESSION_KEY = 'pen-entered';
/** Mirrors the attribute the inline script in the root layout sets. */
const ENTERED_ATTR = 'data-pen-entered';

/**
 * `drawing` is the whole of act one, because React does not need to distinguish
 * its parts; it only needs to know when it ends.
 */
type Phase = 'drawing' | 'statement' | 'exiting' | 'gone';

/** Which corner, and where it falls in the drawing order. */
const CORNERS = [
  { key: 'tl', className: styles.cornerTl, index: 1 },
  { key: 'tr', className: styles.cornerTr, index: 2 },
  { key: 'br', className: styles.cornerBr, index: 3 },
  { key: 'bl', className: styles.cornerBl, index: 4 },
] as const;

/**
 * Whether this entry is a return within the session.
 *
 * Read through `useSyncExternalStore` rather than resolved in an effect: the
 * value has to be known during render so the scroll lock and the schedule can
 * both branch on it, and setting state from an effect to learn it is what
 * `react-hooks/set-state-in-effect` exists to stop. The server snapshot is
 * `false` — the markup always contains the panel, and the inline script in the
 * root layout is what hides it before paint for a returning visitor.
 *
 * The value cannot change while the page is open, so `subscribe` registers
 * nothing and returns a no-op teardown.
 */
const subscribeToSession = () => () => {};

function readReturning() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    // Private modes can throw on access. Showing the entry once more is a
    // better failure than crashing the page over a curtain.
    return false;
  }
}

const readReturningOnServer = () => false;

/**
 * How long act one has been running, in ms.
 *
 * Its schedule is measured from first paint, but React does not mount until
 * hydration — which on this bundle can be seconds later. Without this the
 * drawing would hold for "hydration plus 1.3s" and the published timing would
 * be fiction; worse, the wait would be longest on exactly the slow connections
 * that already waited.
 *
 * First contentful paint is the honest zero here, because this panel *is* the
 * first contentful paint: it is opaque, server-rendered, and covers the
 * viewport, so the entry it is timing and the entry the browser recorded are
 * the same event.
 *
 * `null` where paint timing is not exposed. Callers treat that as "assume it
 * just started", which errs towards showing the drawing for too long rather
 * than cutting it off — and `MOUNT_GRACE_MS` catches the other direction.
 */
function elapsedSincePaint(): number | null {
  try {
    const paint = performance
      .getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint');
    if (!paint) return null;

    return performance.now() - paint.startTime;
  } catch {
    return null;
  }
}

/**
 * The one asset gate. Fonts, and nothing heavier — see the note at the top of
 * the component for what is deliberately not waited on.
 */
function fontsReady(): Promise<unknown> {
  try {
    return document.fonts?.ready ?? Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

/** Written as the entry leaves, so a refresh does not replay it. */
function rememberEntry() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* see readReturning */
  }
  document.documentElement.setAttribute(ENTERED_ATTR, '');
}

/** Reveal + hold for one beat, in ms. Reduced motion has no reveal to wait on. */
function beatDurationMs(index: number, reducedMotion: boolean) {
  const beat = preloaderSequence[index];
  const isLast = index === preloaderSequence.length - 1;
  const reveal = reducedMotion || !beat ? 0 : statementRevealMs(beat.lines);
  return reveal + (isLast ? FINAL_HOLD_MS : BEAT_HOLD_MS);
}

export function PENPreloader() {
  const reducedMotion = useReducedMotion() === true;
  const returning = useSyncExternalStore(
    subscribeToSession,
    readReturning,
    readReturningOnServer,
  );
  const [phase, setPhase] = useState<Phase>('drawing');
  const [beat, setBeat] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  /**
   * Ends act one and hands the centre to the statement.
   *
   * Two clocks race a ceiling. The first is act one's own schedule — whatever
   * is left of it, given that the CSS has been running since paint. The second
   * is the document. The copy starts when *both* have finished, or when the
   * ceiling fires, whichever comes first, so a fast load is never padded out
   * and a slow one is never held hostage.
   */
  useEffect(() => {
    if (phase !== 'drawing') return;

    /* Already entered this session: drop it on the next tick rather than
       synchronously here. The stylesheet has had it at display:none since
       before the first paint, so there is nothing to see either way — this just
       takes the node out. */
    if (returning) {
      const timer = window.setTimeout(() => setPhase('gone'), 0);
      return () => window.clearTimeout(timer);
    }

    /* Disarms the stylesheet's dead man's switch, which would otherwise blank
       the panel eight seconds in — halfway through the third beat. React is
       demonstrably running, so the case it guards against cannot happen, and
       from here the scheduler's own ceiling is what guarantees an exit. Written
       straight to the node rather than held in state: it is a one-shot fact
       about the DOM and re-rendering the tree to record it would be waste. */
    rootRef.current?.setAttribute('data-live', 'true');

    let live = true;
    const timers: number[] = [];
    const after = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const elapsed = elapsedSincePaint() ?? 0;
    const holdEnd = reducedMotion ? REDUCED_STATEMENT_START_MS : STATEMENT_START_MS;
    /* `MOUNT_GRACE_MS` floor: if hydration lands after the hold was already
       due, cutting on that same frame reads as a glitch rather than a hand-off. */
    const remaining = Math.max(holdEnd - elapsed, MOUNT_GRACE_MS);
    const ceiling = Math.max(MAX_WAIT_MS - elapsed, remaining);

    void Promise.race([
      Promise.all([after(remaining), fontsReady()]),
      after(ceiling),
    ]).then(() => {
      if (live) setPhase('statement');
    });

    return () => {
      live = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [phase, returning, reducedMotion]);

  /**
   * Walks the sequence: one timer per beat, re-armed as `beat` advances.
   *
   * The wait is the beat's own length plus, for every beat after the first, the
   * time the previous sentence takes to clear out — `AnimatePresence` in
   * `mode="wait"` does not mount the incoming beat until the outgoing one has
   * finished exiting, so its words do not start writing until then. Without
   * that term the schedule would run ahead of what is on screen, and the error
   * would compound across the sequence.
   */
  useEffect(() => {
    if (phase !== 'statement') return;

    const isLast = beat === preloaderSequence.length - 1;
    const clearOut = beat === 0 ? 0 : reducedMotion ? REDUCED_EXIT_MS : BEAT_EXIT_MS;
    const timer = window.setTimeout(
      () => (isLast ? setPhase('exiting') : setBeat((current) => current + 1)),
      beatDurationMs(beat, reducedMotion) + clearOut,
    );

    return () => window.clearTimeout(timer);
  }, [phase, beat, reducedMotion]);

  /**
   * Unmounts once the retraction is over.
   *
   * The exit is driven by `animate`, not by an `AnimatePresence` around the
   * whole overlay: the panel and the seam finish at different times on purpose,
   * and owning the removal here means that offset is a number in timeline.ts
   * rather than something inferred from whichever child settles last.
   */
  useEffect(() => {
    if (phase !== 'exiting') return;

    const timer = window.setTimeout(
      () => {
        rememberEntry();
        setPhase('gone');
      },
      reducedMotion ? REDUCED_EXIT_MS : EXIT_TOTAL_MS,
    );

    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  /**
   * Any deliberate input skips the rest of the entry.
   *
   * The sequence runs about eleven seconds. That is the right length for the
   * piece and it is only ever shown once a session — but a visitor who has seen
   * it, or who arrived to do one specific thing, had no way out: the scroll
   * lock below means even trying to scroll past it did nothing, which reads as
   * a broken page rather than as a considered intro.
   *
   * It exits through `exiting`, not `gone`, so a skip plays the same retraction
   * the timed ending plays. Skipping is a shortcut through the entry, not a
   * different way of leaving it, and cutting the panel out on the frame the key
   * was pressed would look like a fault.
   *
   * `wheel` and `touchmove` rather than `scroll`: the document cannot scroll
   * while the lock is on, so the scroll event never fires — but the gestures
   * that would have caused it still do, and they are the honest signal that
   * someone is trying to get past this.
   *
   * Armed after `MOUNT_GRACE_MS`. An input event already in flight when the
   * overlay mounts — momentum from a trackpad, a key held down through a
   * reload — would otherwise dismiss the entry before its first frame, so the
   * visitor would never see it at all on exactly the fast connections it is
   * there to fill.
   */
  useEffect(() => {
    if (returning || phase === 'exiting' || phase === 'gone') return;

    let armed = false;
    const arm = window.setTimeout(() => {
      armed = true;
    }, MOUNT_GRACE_MS);

    const skip = (event: Event) => {
      if (!armed) return;
      // Modifier presses on their own are not an attempt to get past anything —
      // someone reaching for a shortcut should not lose the entry to the Ctrl.
      if (event instanceof KeyboardEvent && ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
        return;
      setPhase('exiting');
    };

    const options = { passive: true } as const;
    window.addEventListener('wheel', skip, options);
    window.addEventListener('touchmove', skip, options);
    window.addEventListener('pointerdown', skip, options);
    window.addEventListener('keydown', skip, options);

    return () => {
      window.clearTimeout(arm);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [returning, phase]);

  /**
   * Holds the page still while the curtain is up.
   *
   * Without this a scroll during the entry advances the hero scrub behind it,
   * and the film is already part-way through its first heading when the panel
   * retracts — the one thing that would make the hand-off look like two
   * animations instead of one. The lock is kept through the retraction as well,
   * since that is when the hero is most exposed and least ready to be moved.
   *
   * The scrollbar's width is given back as padding so locking does not shift
   * the layout by the 4px the custom scrollbar occupies.
   */
  useEffect(() => {
    if (returning || phase === 'gone') return;

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
  }, [returning, phase]);

  if (phase === 'gone') return null;

  const exiting = phase === 'exiting';
  /* Act one is over the moment the centre is spoken for, and it stays over. */
  const past = phase !== 'drawing';
  const beatExitMs = reducedMotion ? REDUCED_EXIT_MS : BEAT_EXIT_MS;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      /* A stable hook for the one rule that must reach this element from
         outside the CSS module, where the class name is hashed: the
         `<noscript>` block in the root layout, and nothing else. */
      data-preloader=""
      /* The schedule, handed to the stylesheet. Server-rendered, so the
         keyframes have their timings before hydration — see timeline.ts. */
      style={entryVariables}
      /* Chrome over a page that is already mounted and reachable. Not
         `aria-hidden`: the drawing is decoration and says so itself, but the
         statement is the one thing here with something to say, and it carries
         its own readable sentence. */
      role="presentation"
    >
      <motion.div
        className={styles.panel}
        data-exiting={exiting ? 'true' : undefined}
        /* `initial={false}`: the panel is in the server HTML and already
           painted, so animating it in would be a reveal of the page it exists
           to cover. */
        initial={false}
        animate={
          exiting
            ? reducedMotion
              ? { opacity: 0 }
              : { clipPath: 'inset(50% 0% 50% 0%)' }
            : { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
        }
        transition={{
          duration: (reducedMotion ? REDUCED_EXIT_MS : EXIT_MS) / 1000,
          ease: EASE_OUT_EXPO,
        }}
      >
        {/* `noise` is the site-wide grain; the module class only sets how much
            of it comes through the cream. */}
        <div className={cn('noise', styles.grain)} />

        <TechnicalLineField recede={past} />

        {CORNERS.map((corner) => (
          <div key={corner.key} className={cn(styles.corner, corner.className)} aria-hidden>
            <CornerMark index={corner.index} />
          </div>
        ))}

        {/* Mounted only once the drawing has established the centre. Nothing
            fades it in: each beat writes its own words, and a wrapper fade on
            top of that would blunt the first word of every sentence. */}
        {phase === 'drawing' ? null : (
          <motion.div
            className={styles.content}
            initial={false}
            animate={exiting ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
            transition={{
              duration: (reducedMotion ? REDUCED_EXIT_MS : EXIT_MS) / 1000,
              ease: EASE_OUT_EXPO,
            }}
          >
            {/* `mode="wait"` so a sentence is fully gone before the next starts
                writing — two beats crossfading over each other would be
                unreadable at this size. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={beat}
                className={styles.beat}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: beatExitMs / 1000, ease: EASE_OUT_EXPO }}
              >
                <PreloaderStatement
                  lines={preloaderSequence[beat]?.lines ?? []}
                  still={reducedMotion}
                  signed={beat === preloaderSequence.length - 1}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/*
        The line the panel collapses onto. A sibling of the panel, not a child,
        so the clip cannot take it away — it has to outlive the surface it was
        drawn on. Reduced motion never shows it: there is no retraction for it
        to be the residue of.
      */}
      <motion.div
        className={styles.seam}
        aria-hidden
        initial={false}
        /* The resting state is opacity alone, deliberately. A `scaleX` here
           would be server-rendered as a `transform`, and Framer under
           `reducedMotion` declines to write transforms at all — so the server
           and the client would disagree about this element's style attribute
           and hydration would fail for every visitor with the setting on. The
           keyframe array below carries its own starting value, so nothing is
           lost by leaving the transform out until it is needed. */
        animate={
          exiting && !reducedMotion
            ? { opacity: [0, 1, 1, 0], scaleX: [0.4, 1, 1, 1] }
            : { opacity: 0 }
        }
        transition={{
          duration: EXIT_TOTAL_MS / 1000,
          times: [0, 0.45, 0.78, 1],
          ease: EASE_OUT_EXPO,
        }}
      />
    </div>
  );
}
