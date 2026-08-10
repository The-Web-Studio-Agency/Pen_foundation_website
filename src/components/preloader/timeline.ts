import type { CSSProperties } from 'react';

/**
 * The entry's schedule, in one place.
 *
 * WHY THIS FILE EXISTS AT ALL. The entrance is drawn by CSS keyframes and ended
 * by React. If each side kept its own numbers they would desynchronise the
 * first time either was tuned — the exact failure the old overlay hit when its
 * reveal length was a literal copied into the scheduler. So the numbers live
 * here, TypeScript reads them directly, and CSS reads them through the custom
 * properties `entryVariables` writes onto the server-rendered root.
 *
 * WHY THE ENTRANCE IS CSS AND NOT FRAMER. The overlay is in the server HTML, so
 * it is painted long before the bundle that would animate it has arrived — this
 * app hydrates in roughly 1.5–2.7s (R3F plus framer). A JS-driven entrance would
 * therefore sit frozen on its first frame for most of its own runtime, and the
 * "2.8s" schedule below would really be "hydration plus 2.8s". Declaring the
 * entrance in CSS means the first line is being drawn in the same frame the
 * panel is painted, whatever the bundle is doing. React is only needed for the
 * one thing CSS cannot decide: when the page underneath is ready to be shown.
 *
 * TWO ACTS. The drawing sets itself out, and then the statement is written into
 * the centre it left empty — three beats of copy, a word at a time, which is
 * the entry this site already had and the part of it that says something.
 *
 * The centre is deliberately unoccupied through act one. The axes break at the
 * inner circle rather than crossing, so the drawing is built around a void, and
 * the sentence is what the void turns out to have been for.
 *
 * The published shape, measured from first paint:
 *
 *   0.00s  panel covers the viewport (it is in the server HTML)
 *   0.00s  the technical line system starts drawing itself, staggered
 *   1.14s  the axes and the two inner circles have landed
 *   1.30s  beat one starts writing, over a drawing still finishing itself
 *   1.76s  the last of the outer geometry lands; the field begins to recede
 *   ~10.2s three beats and their holds — see the beat constants below
 *   ~10.2s the panel retracts to its centre line
 *   ~10.9s the hero is clear
 *
 * Act one is fixed; act two is as long as the copy is. The beat lengths are
 * derived from `statementRevealMs`, never written down twice — the previous
 * entry kept a literal copy of the reveal length in its scheduler and the two
 * silently drifted apart every time the stagger was retuned.
 */

/** Gap between one path starting to draw and the next. */
export const FIELD_STAGGER_MS = 48;
/** How long a single path takes to draw itself in. */
export const FIELD_DRAW_MS = 900;
/** Highest stagger index used by the line system. */
export const FIELD_LAST_INDEX = 17;
/** When the last path finishes drawing, from first paint. Derived, never typed. */
export const FIELD_SETTLED_MS = FIELD_LAST_INDEX * FIELD_STAGGER_MS + FIELD_DRAW_MS;

/**
 * When act one ends and the statement takes the centre, from first paint.
 *
 * Everything before this is CSS; this is the one number React needs to start
 * from, and it is a floor rather than a fixed point — see `PENPreloader`, which
 * holds past it if the document is not ready and cuts to it if it already was.
 *
 * It lands just after the axes and the two inner circles have drawn (1.14s) and
 * well before the outer geometry has (1.76s), on purpose: the frame around the
 * centre is complete when the first word arrives, and the rest of the drawing
 * finishes underneath the sentence. Waiting for the whole field would add half
 * a second in which nothing at all is happening in the middle of the screen.
 */
export const STATEMENT_START_MS = 1300;

/**
 * How long the field waits, after the copy starts, before it recedes.
 *
 * The statement deliberately begins before the drawing has finished, so the
 * two overlap — but the fade must not. The outer geometry is drawn at stroke
 * opacities of 0.07–0.09; fading the layer to 0.42 while those paths are still
 * arriving would land them at about 0.03, which is nothing, and the drawing
 * would lose everything except the inner circles for the rest of the entry.
 *
 * So the recede is held off until the last path is down, and derived rather
 * than typed: it is exactly the overlap between the two acts, and it stays
 * correct if the stagger, the draw length or the start ever move.
 */
export const RECEDE_DELAY_MS = Math.max(FIELD_SETTLED_MS - STATEMENT_START_MS, 0);

/**
 * The stillness after a sentence has finished writing itself.
 *
 * Two values, because the last beat is doing a different job. Between sentences
 * the pause only has to be long enough to read a line and register that it has
 * ended — hold longer and the three beats stop feeling like one argument. After
 * "Until now." the hold is the turn itself: the point of the sequence, and the
 * only line the visitor should still be holding when the film appears.
 */
export const BEAT_HOLD_MS = 1200;
export const FINAL_HOLD_MS = 2500;
/** One sentence clearing out before the next writes itself in. */
export const BEAT_EXIT_MS = 260;

/** The retraction itself, and the hairline that outlives it by a beat. */
export const EXIT_MS = 600;
export const SEAM_TAIL_MS = 140;
export const EXIT_TOTAL_MS = EXIT_MS + SEAM_TAIL_MS;

/**
 * Reduced motion: nothing is drawn or retracted, so act one has nothing to
 * watch and no reason to hold. The field is simply there, briefly, and then the
 * copy starts.
 *
 * The beat holds are deliberately NOT shortened. That setting asks for less
 * movement, not less reading time — and since each beat is painted at once
 * rather than written, cutting the holds would leave no time to read them at
 * all. Only the reveal and the exit go.
 */
export const REDUCED_STATEMENT_START_MS = 500;
export const REDUCED_EXIT_MS = 220;

/**
 * Ceiling on waiting for the document. Past this the entry leaves regardless:
 * a preloader that outstays its schedule has become the thing it was hiding.
 *
 * Deliberately under the 8s CSS failsafe in the stylesheet, so the two never
 * race — this is the normal cap, that one is the dead man's switch for a bundle
 * that never arrives at all.
 */
export const MAX_WAIT_MS = 6000;

/**
 * Floor on how long the panel stays after React takes over.
 *
 * Only reachable when hydration lands after the hold was already due — a cold
 * cache, a slow phone. Cutting on that same frame reads as a glitch rather than
 * as an exit, so it always gets this much to retract from.
 */
export const MOUNT_GRACE_MS = 220;

/**
 * The schedule as CSS custom properties.
 *
 * Written onto the root element, which is server-rendered, so the stylesheet
 * has these before hydration and the keyframes below can start on paint. Frozen
 * and module-level: it is the same object every render, so it can never be the
 * reason the tree re-renders.
 */
export const entryVariables = Object.freeze({
  '--pre-draw': `${FIELD_DRAW_MS}ms`,
  '--pre-stagger': `${FIELD_STAGGER_MS}ms`,
  '--pre-recede-delay': `${RECEDE_DELAY_MS}ms`,
}) as CSSProperties;

/** Per-path draw index, as the stylesheet's `--i` multiplier. */
export function drawIndex(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}
