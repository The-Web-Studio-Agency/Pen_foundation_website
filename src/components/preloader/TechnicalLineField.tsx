import { drawIndex } from './timeline';
import styles from './preloader.module.css';

/**
 * The line system behind the mark: a setting-out drawing, part-visible.
 *
 * Not a grid. A grid is a texture — it says the same thing at every point and
 * has no centre. This is construction geometry laid out about a single point,
 * which happens to be where the mark sits: broken centre lines that stop on the
 * inner circle, concentric setting-out circles, two rounded elbows entering
 * from opposite edges, long arcs struck at radii several times the viewport,
 * and chords that pass the centre at a fixed offset. Everything is drawn about
 * one origin, so the composition reads as having been set out rather than
 * tiled, and the mark is where the drawing resolves.
 *
 * THE SCALE IS THE EFFECT. Most of these radii are larger than the viewBox, so
 * only arcs of them are ever on screen and they read as fragments of something
 * much bigger continuing past the edges. The paths that do fit deliberately
 * begin and end outside it, so they enter from an edge rather than starting in
 * open space.
 *
 * WHY A SQUARE viewBox AND `slice`. The crop has to take the geometry away from
 * a different pair of edges on a phone than on a desktop while keeping the
 * centre — and the mark — dead centre on both. A square box under `slice` does
 * exactly that: a desktop loses the top and bottom of the field, a phone loses
 * the left and right, and the inner two circles survive on everything.
 *
 * WHY NOT `TechnicalGridBackground`. That is the site's section backdrop and it
 * is a repeating grid with travelling traces — correct behind copy, wrong as
 * the subject. This owes it the teal trace and nothing else.
 *
 * All of it is drawn by CSS (`.draw`), staggered on `--i`. The indices below
 * are the drawing order — axes first, then the circles they terminate on, then
 * the geometry that arrives from outside — and they are the only thing that
 * decides it. See timeline.ts.
 */

/** The drawing's own coordinate space. Square: see the note above. */
const VIEW = 1440;
/**
 * The origin everything is set out about, and the point the mark sits on.
 *
 * The two drifting groups pivot on this in the stylesheet, where it has to be
 * written as a literal (`transform-origin: 720px`). Change one, change both.
 */
const C = VIEW / 2;

/** Radius the centre lines break at, so they terminate on the inner circle. */
const CORE_R = 250;
/** The circle the registration ticks and the live trace are struck on. */
const RING_R = 430;

/** Just outside the box on each side, so nothing appears to start on an edge. */
const OUT = 60;

/**
 * Broken centre lines — the drawing's axes.
 *
 * Left open across the middle rather than run through it: an ISO centre line is
 * interrupted where it crosses what it locates, and here what it locates is the
 * mark. It also means no line is ever drawn across the logo.
 */
const AXES = [
  { d: `M ${-OUT} ${C} H ${C - CORE_R}`, i: 0 },
  { d: `M ${C + CORE_R} ${C} H ${VIEW + OUT}`, i: 1 },
  { d: `M ${C} ${-OUT} V ${C - CORE_R}`, i: 2 },
  { d: `M ${C} ${C + CORE_R} V ${VIEW + OUT}`, i: 3 },
] as const;

/**
 * Rounded elbows entering from the left and right edges.
 *
 * The pair is one path rotated 180° about the centre, so the composition is
 * balanced without being mirrored — a mirror would put a false axis of symmetry
 * through the drawing. Each arc is struck tangent to both of its straights
 * (centre at 300,540 and 1140,900), so the turn is a true fillet rather than a
 * curve that happens to land near the ends: at hairline weight the difference
 * between those two is the whole difference between a drawing and a doodle.
 */
const ELBOWS = [
  { d: `M ${-OUT} 330 H 300 A 210 210 0 0 1 510 540 V ${VIEW + OUT}`, i: 6 },
  { d: `M ${VIEW + OUT} 1110 H 1140 A 210 210 0 0 1 930 900 V ${-OUT}`, i: 7 },
] as const;

/** Arcs struck at more than twice the viewport, so only a shallow part shows. */
const SWEEPS = [
  { d: `M -100 1180 A 1750 1750 0 0 1 ${VIEW + 100} 940`, i: 10 },
  { d: `M -100 260 A 1750 1750 0 0 0 ${VIEW + 100} 500`, i: 11 },
] as const;

/**
 * Chords running corner to corner, offset so they clear the inner circle.
 *
 * Both pass 311 units from the centre — outside `CORE_R`, inside `RING_R` — so
 * they cross the ring and never the mark. Equal offsets on opposite sides is
 * what stops two diagonals reading as an X drawn over the logo.
 */
const CHORDS = [
  { d: `M -100 340 L 1100 ${VIEW + 100}`, i: 12 },
  { d: `M ${VIEW + 100} 1100 L 340 -100`, i: 13 },
] as const;

/** Registration ticks where the axes cross the ring. */
const TICK = 16;
const TICKS = [
  { d: `M ${C} ${C - RING_R - TICK} V ${C - RING_R + TICK}`, i: 14 },
  { d: `M ${C} ${C + RING_R - TICK} V ${C + RING_R + TICK}`, i: 15 },
  { d: `M ${C - RING_R - TICK} ${C} H ${C - RING_R + TICK}`, i: 16 },
  { d: `M ${C + RING_R - TICK} ${C} H ${C + RING_R + TICK}`, i: 17 },
] as const;

const INK = '#012c32';

/** `recede` holds the whole drawing back while the statement has the centre. */
export function TechnicalLineField({ recede }: { recede: boolean }) {
  return (
    <div className={styles.field} data-recede={recede ? 'true' : undefined} aria-hidden>
      <svg
        className={styles.fieldSvg}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke={INK}
        strokeWidth="1"
      >
        {/* Axes and the two circles they terminate on: the part of the drawing
            that is fully on screen at every viewport, and therefore the part
            that has to carry the composition on its own. */}
        <g strokeOpacity="0.12">
          {AXES.map((axis) => (
            <path key={axis.d} className={styles.draw} d={axis.d} pathLength={1} style={drawIndex(axis.i)} />
          ))}
        </g>

        <g strokeOpacity="0.16">
          <circle
            className={styles.draw}
            cx={C}
            cy={C}
            r={CORE_R}
            pathLength={1}
            style={drawIndex(4)}
          />
          <circle
            className={styles.draw}
            cx={C}
            cy={C}
            r={RING_R}
            pathLength={1}
            style={drawIndex(5)}
          />
        </g>

        <g strokeOpacity="0.3">
          {TICKS.map((tick) => (
            <path key={tick.d} className={styles.draw} d={tick.d} pathLength={1} style={drawIndex(tick.i)} />
          ))}
        </g>

        {/* The outer circles and the long arcs, breathing as one body. Scaling
            the group rather than each path keeps them concentric — they are
            struck about the same centre, and nothing about them should ever
            suggest otherwise. */}
        <g className={styles.breathe} strokeOpacity="0.09">
          <circle className={styles.draw} cx={C} cy={C} r={690} pathLength={1} style={drawIndex(8)} />
          <circle className={styles.draw} cx={C} cy={C} r={1010} pathLength={1} style={drawIndex(9)} />
          {SWEEPS.map((sweep) => (
            <path key={sweep.d} className={styles.draw} d={sweep.d} pathLength={1} style={drawIndex(sweep.i)} />
          ))}
        </g>

        {/* The geometry that arrives from outside, drifting by under two
            degrees over the best part of a minute. Enough that the field is
            never quite the same drawing twice; far too slow to look at. */}
        <g className={styles.drift}>
          <g strokeOpacity="0.14">
            {ELBOWS.map((elbow) => (
              <path key={elbow.d} className={styles.draw} d={elbow.d} pathLength={1} style={drawIndex(elbow.i)} />
            ))}
          </g>
          <g strokeOpacity="0.07">
            {CHORDS.map((chord) => (
              <path key={chord.d} className={styles.draw} d={chord.d} pathLength={1} style={drawIndex(chord.i)} />
            ))}
          </g>
        </g>

        {/* The one live element. It starts after the ring it runs on has
            finished drawing, so nothing appears to move along a line that is
            not there yet. */}
        <circle
          className={styles.trace}
          cx={C}
          cy={C}
          r={RING_R}
          pathLength={1}
          stroke="var(--c-accent, #057c86)"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * One corner registration bracket.
 *
 * Drawn once for the top-left and rotated into the other three by the
 * stylesheet, so the four are the same mark rather than four transcriptions of
 * it. The short ticks on each leg are the reason it reads as measured: without
 * them it is a rounded rectangle corner, with them it is a datum.
 *
 * `strokeWidth` is 1.4 in a 100-unit box rendered at 56–84px, which lands the
 * stroke between 0.8 and 1.2px — the same hairline range the field holds.
 */
export function CornerMark({ index }: { index: number }) {
  return (
    <svg
      className={styles.cornerSvg}
      viewBox="0 0 100 100"
      fill="none"
      stroke={INK}
      strokeWidth="1.4"
      strokeOpacity="0.22"
      aria-hidden
    >
      <path
        className={styles.draw}
        d="M 6 94 V 28 A 22 22 0 0 1 28 6 H 94"
        pathLength={1}
        style={drawIndex(index)}
      />
      <path
        className={styles.draw}
        d="M 58 6 v 9 M 6 58 h 9"
        pathLength={1}
        style={drawIndex(index)}
      />
    </svg>
  );
}
