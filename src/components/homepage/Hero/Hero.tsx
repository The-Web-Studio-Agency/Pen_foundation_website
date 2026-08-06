'use client';

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';

import { RevealText } from '@/components/motion';
import { hero } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * The scroll-scrubbed opening of the home page.
 *
 * The reference pins a stage (`position: sticky; top: 0; height: 100svh`)
 * inside a 300svh sizer and drives two things off the same scroll progress: a
 * frame sequence painted to a `<canvas>`, and four headings that hand over to
 * one another. The geometry and the timing are the original's; the canvas is
 * swapped for the 24 exported frames stacked on top of each other and
 * cross-faded by opacity, so scrubbing never waits on a network request.
 *
 * The section deliberately runs underneath the fixed `SiteHeader` — the
 * original has no top padding here either.
 *
 * Frames are plain images rather than `next/image`: they are SVG, which the
 * image optimiser refuses without `dangerouslyAllowSVG`, and all 24 have to sit
 * in the DOM at once for the cross-fade regardless. `motion.img` is used so the
 * per-frame opacity can be a MotionValue and never triggers a React render.
 */

/** Exported frames of the original's canvas sequence. */
const FRAME_COUNT = 24;
/** Held still when the visitor has asked for reduced motion — mid-sequence. */
const STATIC_FRAME_INDEX = 12;
/** Distance, in pixels, an incoming heading travels up as it fades in. */
const HEADING_RISE = 40;
/** Share of a heading's window spent fading in, and again spent fading out. */
const HEADING_FADE = 0.25;
/** Measured ends of the per-character tint on the scroll indicator. */
const INDICATOR_FROM = [222, 222, 222] as const;
const INDICATOR_TO = [161, 161, 161] as const;
/** Progress at which the indicator has finished getting out of the way. */
const INDICATOR_HIDDEN_AT = 0.05;

/**
 * The reference's `.title-sequence`. The class name is kept for traceability;
 * the declarations themselves live in the utilities beside it because the
 * min() clamps have no equivalent on Tailwind's scale.
 */
const HEADING_CLASS = cn(
  'title-sequence w-[90%] text-center text-[3.625rem] leading-[0.95] font-normal',
  'lg:w-auto lg:text-[min(5.729vw,146.6666666667px)]',
  'lg:tracking-[min(-0.057vw,-1.4666666667px)]',
);

const FRAME_CLASS = 'absolute inset-0 size-full object-cover';

function frameSrc(index: number) {
  return `/media/images/homepage/hero-frame-${String(index).padStart(2, '0')}.svg`;
}

/**
 * Pairs each line with the number of characters that precede it, so a
 * multi-line heading keeps one continuous reveal wave. The +1 stands in for the
 * line break, matching how RevealText counts the space between words.
 */
function withOffsets(lines: string[]) {
  let cursor = 0;
  return lines.map((line) => {
    const offset = cursor;
    cursor += line.length + 1;
    return { line, offset };
  });
}

function mixChannel(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

/** Left-to-right interpolation of the indicator's grey ramp. */
function indicatorTint(index: number, total: number) {
  const amount = total > 1 ? index / (total - 1) : 0;
  const r = mixChannel(INDICATOR_FROM[0], INDICATOR_TO[0], amount);
  const g = mixChannel(INDICATOR_FROM[1], INDICATOR_TO[1], amount);
  const b = mixChannel(INDICATOR_FROM[2], INDICATOR_TO[2], amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function SequenceFrame({ progress, index }: { progress: MotionValue<number>; index: number }) {
  // Progress is cut into FRAME_COUNT equal slices, so the sequence advances
  // continuously with the scroll rather than in step with the four headings.
  const opacity = useTransform(progress, (value) =>
    Math.min(FRAME_COUNT - 1, Math.floor(value * FRAME_COUNT)) === index ? 1 : 0,
  );

  return (
    <motion.img
      src={frameSrc(index)}
      alt=""
      width={1440}
      height={900}
      loading="eager"
      decoding="async"
      draggable={false}
      style={{ opacity }}
      className={FRAME_CLASS}
    />
  );
}

interface SequenceHeadingProps {
  progress: MotionValue<number>;
  lines: string[];
  index: number;
  count: number;
  /**
   * Mounting the lines is what starts RevealText's one-shot character wave, so
   * a heading's text is withheld until its own window has been reached — every
   * heading is otherwise permanently in view and would burn its reveal on load.
   */
  revealed: boolean;
}

function SequenceHeading({ progress, lines, index, count, revealed }: SequenceHeadingProps) {
  const span = 1 / count;
  const start = index * span;
  const end = start + span;
  const fade = span * HEADING_FADE;
  const isFirst = index === 0;

  // The first heading is legible at rest — the page lands on it and its own
  // character reveal is the entrance. The rest fade and rise into their window.
  const opacity = useTransform(
    progress,
    isFirst ? [start, end - fade, end] : [start, start + fade, end - fade, end],
    isFirst ? [1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, start + fade], [isFirst ? 0 : HEADING_RISE, 0]);

  const Heading = isFirst ? 'h1' : 'p';

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {revealed ? (
        <Heading className={HEADING_CLASS}>
          {withOffsets(lines).map(({ line, offset }, lineIndex) => (
            <RevealText
              key={`${index}-${lineIndex}`}
              text={line}
              indexOffset={offset}
              className="block"
            />
          ))}
        </Heading>
      ) : null}
    </motion.div>
  );
}

function ScrollIndicator({ progress, label }: { progress: MotionValue<number>; label: string }) {
  const opacity = useTransform(progress, [INDICATOR_HIDDEN_AT / 2, INDICATOR_HIDDEN_AT], [1, 0]);
  const characters = Array.from(label);

  return (
    <motion.div
      style={{ opacity }}
      className="label-4 pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 select-none"
    >
      {/* Split per character for the gradient, so the label is announced once
          from the copy that is not cut up. */}
      <span className="sr-only">{label}</span>
      <span aria-hidden className="uppercase">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="whitespace-pre"
            style={{ color: indicatorTint(index, characters.length) }}
          >
            {character}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

export function Hero() {
  const sizerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sizerRef,
    offset: ['start start', 'end end'],
  });
  const [revealed, setRevealed] = useState(0);

  // The only state driven by scroll, and it settles after three changes: React
  // bails out when the index has not grown, so no render happens per frame.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const index = Math.min(hero.sequence.length - 1, Math.floor(value * hero.sequence.length));
    setRevealed((current) => (index > current ? index : current));
  });

  if (prefersReducedMotion) {
    // No scrubbing to do, so the sizer collapses to one viewport and the
    // sequence resolves to its closing heading over a mid-sequence frame.
    const closing = hero.sequence[hero.sequence.length - 1];

    return (
      <section className="relative overflow-clip bg-[var(--c-white)]">
        <div className="relative h-[100svh] w-full">
          <div aria-hidden className="absolute inset-0">
            <motion.img
              src={frameSrc(STATIC_FRAME_INDEX)}
              alt=""
              width={1440}
              height={900}
              draggable={false}
              className={FRAME_CLASS}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] flex touch-none items-center justify-center select-none">
            <h1 className={HEADING_CLASS}>
              {withOffsets(closing.lines).map(({ line, offset }, lineIndex) => (
                <RevealText
                  key={`closing-${lineIndex}`}
                  text={line}
                  indexOffset={offset}
                  className="block"
                />
              ))}
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-clip bg-[var(--c-white)]">
      {/* `.content-sizer`: three viewport heights of scroll, two of which the
          stage below spends pinned. */}
      <div ref={sizerRef} className="h-[300svh] w-full">
        <div className="sticky top-0 h-[100svh] w-full overflow-clip">
          <div aria-hidden className="absolute inset-0">
            {Array.from({ length: FRAME_COUNT }, (_, index) => (
              <SequenceFrame key={index} progress={scrollYProgress} index={index} />
            ))}
          </div>

          {/* `.homepage-scroll-content`: sits over the frames and stays inert. */}
          <div className="pointer-events-none absolute inset-0 z-[1] touch-none select-none">
            {hero.sequence.map((item, index) => (
              <SequenceHeading
                key={index}
                progress={scrollYProgress}
                lines={item.lines}
                index={index}
                count={hero.sequence.length}
                revealed={index <= revealed}
              />
            ))}
          </div>

          <ScrollIndicator progress={scrollYProgress} label={hero.scrollLabel} />
        </div>
      </div>
    </section>
  );
}
