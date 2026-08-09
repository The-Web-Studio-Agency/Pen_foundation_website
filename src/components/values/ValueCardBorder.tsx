'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  BORDER_STROKE_OPACITY,
  BORDER_STROKE_WIDTH,
  CARD_VIEWBOX,
  COMET_GLOW_DEVIATION,
  COMET_LAP_SECONDS,
  COMET_TICK_LENGTH,
  COMET_TRAIL_FRACTION,
  borderDraw,
} from './ValuesAnimations';

/**
 * The card's outline, and the light that runs around it.
 *
 * Drawn as an overlay rather than a CSS border because the silhouette is
 * notched: `border` follows the box, and the box here has five inward cuts. The
 * viewBox is stretched (`preserveAspectRatio="none"`) so one path serves every
 * card size, at the cost of corner radii distorting with the aspect ratio —
 * which is what the reference does too.
 *
 * Three strokes ride the same path on one clock:
 *   · a wide, blurred head — the light itself
 *   · a short trail behind it
 *   · a dark tick just ahead, which is what stops the light reading as a smear
 *
 * All three are dash offsets rather than a point tweened along the curve. That
 * needs no per-frame path sampling, stays sharp at any card size, and lets the
 * whole effect stop by simply not rendering.
 */

interface ValueCardBorderProps {
  /** Outline for this card's silhouette, in `CARD_VIEWBOX` units. */
  d: string;
  /** `useId()` value from the section, so filter ids stay unique. */
  prefix: string;
  index: number;
}

export function ValueCardBorder({ d, prefix, index }: ValueCardBorderProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const reduceMotion = useReducedMotion();

  // The riders' dash pattern is expressed in path units, so the path has to be
  // measured before any of them can be drawn.
  useEffect(() => {
    const node = pathRef.current;
    if (node) setLength(node.getTotalLength());
  }, [d]);

  const glowId = `${prefix}-value-glow-${index}`;
  const trail = Math.max(length * COMET_TRAIL_FRACTION, 1);

  /** One lap, linear, forever — and only while the card is on screen. */
  const lap = (lead: number) => ({
    initial: { strokeDashoffset: -lead },
    whileInView: { strokeDashoffset: -length - lead },
    transition: {
      duration: COMET_LAP_SECONDS,
      ease: 'linear' as const,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
    // `once: false` so the loop unmounts its work when the card scrolls away;
    // `amount: 0` so it starts the moment any part of the card is visible.
    viewport: { once: false, amount: 0 },
  });

  const showComet = length > 0 && !reduceMotion;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      viewBox={`0 0 ${CARD_VIEWBOX.width} ${CARD_VIEWBOX.height}`}
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <filter
          id={glowId}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={COMET_GLOW_DEVIATION} />
        </filter>
      </defs>

      {/* The outline, drawing itself on once as the card arrives. */}
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="var(--c-dark-green)"
        strokeWidth={BORDER_STROKE_WIDTH}
        strokeOpacity={BORDER_STROKE_OPACITY}
        variants={borderDraw}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      />

      {showComet ? (
        <>
          {/* The light. Wide and heavily blurred, so it reads as a glow. */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-teal-bright)"
            strokeWidth={11}
            strokeLinecap="round"
            strokeOpacity={0.7}
            filter={`url(#${glowId})`}
            style={{ strokeDasharray: `1 ${length - 1}` }}
            {...lap(0)}
          />

          {/* Its trail — the reference runs ~1% of the perimeter. */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-teal-bright)"
            strokeWidth={BORDER_STROKE_WIDTH}
            strokeOpacity={0.8}
            strokeLinecap="round"
            filter={`url(#${glowId})`}
            style={{ strokeDasharray: `${trail} ${length - trail}` }}
            {...lap(trail)}
          />

          {/* The dark tick leading it. */}
          <motion.path
            d={d}
            fill="none"
            stroke="var(--c-dark-green)"
            strokeWidth={BORDER_STROKE_WIDTH}
            strokeLinecap="round"
            style={{ strokeDasharray: `${COMET_TICK_LENGTH} ${length - COMET_TICK_LENGTH}` }}
            {...lap(-COMET_TICK_LENGTH * 1.5)}
          />
        </>
      ) : null}
    </svg>
  );
}
