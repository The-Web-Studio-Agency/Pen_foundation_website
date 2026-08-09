import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

/**
 * An engineering-drawing backdrop: a very faint grid with a "+" at every
 * intersection, and short teal strokes travelling along the grid lines.
 *
 * Background only. It renders nothing but the grid and the traces, sets no
 * background colour of its own beyond the optional wash, and never affects
 * layout — it is `absolute inset-0`, `pointer-events-none` and `aria-hidden`.
 * Drop it inside any `position: relative` container and give the content above
 * it a stacking context (`relative z-10`, or anything that creates one).
 *
 * WHY SVG. The grid is a `<pattern>` in `userSpaceOnUse`, so the cell stays a
 * fixed pixel size at every viewport instead of stretching with the container
 * — an engineering grid whose squares change size per screen stops reading as
 * one. The traces are real geometry on the same coordinates, so they sit
 * exactly on the lines rather than approximately.
 *
 * WHY NOT the existing `GridBeam`. That is one wide gradient sweeping across a
 * surface — a light passing over the grid. This is the opposite: thin strokes
 * running *along* individual grid paths, which needs the paths themselves.
 *
 * PERFORMANCE. Six strokes, each a dash animated on `stroke-dashoffset` by
 * exactly one dash period, so every trace loops seamlessly. Different
 * durations and negative delays mean they neither march in step nor all begin
 * at page load. Keyframes live in globals.css (`grid-trace-run`), which also
 * carries the `prefers-reduced-motion` rule that stops them.
 */

/** Grid pitch in px. Large and evenly spaced, per the reference. */
const CELL = 120;
/** Half-length of each "+" arm. */
const ARM = 4;

/**
 * Dash geometry: a 130px lit stroke inside a 900px period, so a little over one
 * stroke is visible per 1440px line and several are on screen at once. The
 * period must match the offset in the `grid-trace-run` keyframes or the loop
 * will jump — change one and change the other.
 */
const TRACE_DASH = '130 770';

/**
 * Traces, in grid coordinates. Lines sit on the pattern's own centre lines
 * (CELL/2 + n·CELL), which is where the drawn grid actually is.
 *
 * `full` traces span the whole layer using percentage endpoints, so they cover
 * a container of any size. `turn` traces are fixed-size L-shaped paths — a
 * percentage cannot appear in path data, so a trace that changes direction has
 * to be given real coordinates. They are what makes the movement read as
 * following a route through the grid rather than sliding past it.
 */
const HALF = CELL / 2;
const at = (n: number) => HALF + n * CELL;

const FULL_TRACES = [
  { axis: 'h', pos: at(1), duration: 17, delay: -3 },
  { axis: 'h', pos: at(4), duration: 23, delay: -11 },
  { axis: 'v', pos: at(2), duration: 20, delay: -7 },
  { axis: 'v', pos: at(6), duration: 26, delay: -17 },
] as const;

const TURN_TRACES = [
  { d: `M ${at(0)} ${at(3)} H ${at(5)} V ${at(0)}`, duration: 19, delay: -5 },
  { d: `M ${at(8)} ${at(1)} V ${at(5)} H ${at(3)}`, duration: 24, delay: -13 },
] as const;

/**
 * Fades the layer out at the top and bottom edges, so the grid does not stop
 * on a hard line where the section does. Same stencil `DotGrid` uses — black
 * means keep; it feeds `mask-image` and is not a palette colour.
 */
const EDGE_MASK = 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)';

export interface TechnicalGridBackgroundProps {
  /**
   * Paints a white base under the grid. Off by default so the layer can sit on
   * a section that already has its own ground without doubling it.
   */
  withBase?: boolean;
  /** Drops the top/bottom falloff, for a layer that runs edge to edge. */
  hardEdges?: boolean;
  className?: string;
}

/**
 * Timing goes in as custom properties, never as an inline `animation`
 * shorthand: an inline declaration outranks the stylesheet, so the
 * `prefers-reduced-motion` rule in globals.css could not switch it off — the
 * traces would keep running and repainting, merely invisible.
 */
function traceStyle(duration: number, delay: number): CSSProperties {
  return {
    strokeDasharray: TRACE_DASH,
    '--trace-duration': `${duration}s`,
    '--trace-delay': `${delay}s`,
  } as CSSProperties;
}

export function TechnicalGridBackground({
  withBase,
  hardEdges,
  className,
}: TechnicalGridBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        withBase && 'bg-[var(--c-white)]',
        className,
      )}
      style={hardEdges ? undefined : { maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
    >
      <svg width="100%" height="100%" className="block">
        <defs>
          <pattern id="pen-technical-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            {/* Lines through the tile centre, so the crossing — and the "+"
                drawn on it — lands inside the tile rather than being clipped
                at its edge. */}
            <path
              d={`M ${HALF} 0 V ${CELL} M 0 ${HALF} H ${CELL}`}
              stroke="#012c32"
              strokeOpacity="0.06"
              strokeWidth="1"
              fill="none"
              shapeRendering="crispEdges"
            />
            {/* The marker, a touch stronger than the lines it sits on — in the
                reference the crosses read and the lines barely do. */}
            <path
              d={`M ${HALF - ARM} ${HALF} h ${ARM * 2} M ${HALF} ${HALF - ARM} v ${ARM * 2}`}
              stroke="#012c32"
              strokeOpacity="0.16"
              strokeWidth="1"
              fill="none"
              shapeRendering="crispEdges"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#pen-technical-grid)" />

        {/* Traces. `--color-teal` at low opacity and a round cap, so each reads
            as a lit stroke on the line rather than a bar drawn over it. */}
        <g
          className="grid-trace"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        >
          {FULL_TRACES.map((trace) => (
            <line
              key={`${trace.axis}-${trace.pos}`}
              className="grid-trace"
              x1={trace.axis === 'h' ? 0 : trace.pos}
              y1={trace.axis === 'h' ? trace.pos : 0}
              x2={trace.axis === 'h' ? '100%' : trace.pos}
              y2={trace.axis === 'h' ? trace.pos : '100%'}
              style={traceStyle(trace.duration, trace.delay)}
            />
          ))}

          {TURN_TRACES.map((trace) => (
            <path
              key={trace.d}
              className="grid-trace"
              d={trace.d}
              style={traceStyle(trace.duration, trace.delay)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
