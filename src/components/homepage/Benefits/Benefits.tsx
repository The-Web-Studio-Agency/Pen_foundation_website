'use client';

import Image from 'next/image';
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';

import { benefits } from '@/content/data/homepage';
import { cn } from '@/lib/utils';
import type { Benefit } from '@/types/homepage';

/**
 * `fullscreen-features` — one pinned, full-height panel whose background and
 * copy swap as you scroll past it.
 *
 * The reference gives every item its own 130vh band of scroll
 * (`section { height: calc(var(--vh,1vh) * 130 * var(--items-count)) }`) behind
 * a `position: sticky; top: 0; height: calc(var(--svh,1svh)*100)` wrapper — so
 * three items measure 3510px at a 900px viewport. Nothing here is *triggered*:
 * every transition is scrubbed straight off scroll progress, which is why the
 * values are MotionValues rather than CSS transitions or React state.
 */

/** Scroll budget per benefit, in vh. The original's `130`. */
const SCROLL_PER_ITEM_VH = 130;

/**
 * Overlap between two neighbouring bands, as a fraction of the whole section's
 * progress. Sized so the swap reads at the pace of the reference's
 * `transition: opacity .5s var(--ease-out)` on the media at a normal scroll
 * speed (0.055 × 390vh ≈ 21vh of travel).
 */
const FADE = 0.055;

/**
 * The reference's lime bar carries no transition at all — it snaps to full
 * width — while the bar stacked above it animates `transform .2s`. Scrubbed by
 * scroll that becomes a near-instant lime wipe with the settling bar trailing
 * it, and the trailing bar covering the lime is what produces the flash.
 */
const LIME_WIPE = 0.008;
const SETTLE_WIPE = 0.04;

/** `--ease-out` from the reference, the curve its media cross-fade runs on. */
const EASE_OUT = cubicBezier(0, 0, 0.58, 1);

/** Geometry shared by both underline bars, verbatim from the reference. */
const UNDERLINE_BAR = 'absolute bottom-0 left-0 block h-[min(.156vw,4px)] w-full origin-left';

interface BenefitLayerProps {
  benefit: Benefit;
  index: number;
  count: number;
  progress: MotionValue<number>;
  isActive: boolean;
  reduced: boolean;
}

/**
 * One item's opacity envelope, as progress stops and the values to hold at them.
 *
 * These stops become Web Animations keyframe offsets, because Framer Motion
 * hands scroll-linked opacity and transform values to the compositor. WAAPI
 * requires offsets to sit inside [0,1] and to be strictly ordered; a stop
 * outside that range throws at mount, and a degenerate (zero-width) pair leaves
 * the item stuck on screen.
 *
 * So no stop is ever generated out of range in the first place: the first item
 * is already lit when the section pins and only fades out, the last fades in and
 * stays, and the ones between get the full fade-in / hold / fade-out.
 */
function fadeEnvelope(index: number, count: number): { stops: number[]; outputs: number[] } {
  const start = index / count;
  const end = (index + 1) / count;

  if (index === 0) return { stops: [end - FADE, end], outputs: [1, 0] };
  if (index === count - 1) {
    return { stops: [start - FADE, start], outputs: [0, 1] };
  }
  return {
    stops: [start - FADE, start, end - FADE, end],
    outputs: [0, 1, 1, 0],
  };
}

function BenefitMedia({ benefit, index, count, progress, isActive, reduced }: BenefitLayerProps) {
  const { stops, outputs } = fadeEnvelope(index, count);
  const opacity = useTransform(progress, stops, outputs, { ease: EASE_OUT });

  return (
    <motion.div
      aria-hidden
      style={reduced ? undefined : { opacity }}
      className={cn('absolute inset-0', reduced && (isActive ? 'opacity-100' : 'opacity-0'))}
    >
      {/* Decorative: the copy over it carries all of the meaning. */}
      <Image src={benefit.media.src} alt="" fill sizes="100vw" className="object-cover" />
    </motion.div>
  );
}

function BenefitCopy({ benefit, index, count, progress, isActive, reduced }: BenefitLayerProps) {
  const { stops, outputs } = fadeEnvelope(index, count);
  const start = index / count;

  const opacity = useTransform(progress, stops, outputs, { ease: EASE_OUT });
  // The rise only plays on the way in — once an item has landed it stays put
  // and only its opacity comes back down as the next one takes over. The first
  // item is already in place when the section pins, so it never rises.
  const y = useTransform(
    progress,
    index === 0 ? [0, 1] : [start - FADE, start],
    index === 0 ? [0, 0] : [28, 0],
  );
  const limeScale = useTransform(progress, [start, start + LIME_WIPE], [0, 1]);
  const settleScale = useTransform(
    progress,
    [start + LIME_WIPE, start + LIME_WIPE + SETTLE_WIPE],
    [0, 1],
  );

  return (
    <motion.div
      // Kept mounted so the panel never reflows mid-swap; hidden from assistive
      // tech only while it is invisible, so the three copies are not read as one
      // run-on block.
      aria-hidden={!isActive}
      style={reduced ? undefined : { opacity, y }}
      className={cn(
        'absolute inset-0 flex flex-col justify-center',
        !isActive && 'pointer-events-none',
        reduced && (isActive ? 'opacity-100' : 'opacity-0'),
      )}
    >
      <p className="label-4 font-semibold text-[var(--c-light-gray)] uppercase">
        {benefit.eyebrow}
      </p>

      <h2
        className={cn(
          'title-h2 font-[450] text-[var(--c-white)]',
          // Row gaps and line heights are this section's own, not the shared
          // scale's: `.title__wrapper` runs 4.103vw / min(.677vw,17.33px) and
          // the title sits at 1.14 rising to 1.2 from 1024px.
          'mt-[4.103vw] leading-[1.14] lg:mt-[min(.677vw,17.33px)] lg:leading-[1.2]',
        )}
      >
        {benefit.title}
        {benefit.emphasis ? <strong>{benefit.emphasis}</strong> : null}
        {benefit.titleAfter}
        {benefit.underline ? (
          <u className="relative no-underline">
            {benefit.underline}
            <motion.span
              aria-hidden
              style={reduced ? undefined : { scaleX: limeScale }}
              className={cn(UNDERLINE_BAR, 'z-[1] bg-[var(--c-accent)]', reduced && 'scale-x-100')}
            />
            <motion.span
              aria-hidden
              // The reference settles this bar on `--c-dark-green`; over the
              // dark scrim it has to be white to stay visible at all.
              style={reduced ? undefined : { scaleX: settleScale }}
              className={cn(UNDERLINE_BAR, 'z-[2] bg-[var(--c-white)]', reduced && 'scale-x-100')}
            />
          </u>
        ) : null}
      </h2>

      <p
        className={cn(
          'body-3 mt-[5.641vw] text-[var(--c-light-gray)]',
          // `.content__paragraph` is offset from the title and capped at
          // min(29.948vw, 766.667px) once the layout goes two-column.
          'lg:mt-[min(1.823vw,46.67px)] lg:max-w-[min(29.948vw,766.667px)]',
        )}
      >
        {benefit.body}
      </p>
    </motion.div>
  );
}

export function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const count = benefits.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // The integer band only drives `aria-hidden` and the reduced-motion fallback,
  // so it is committed to state solely when it actually changes — the visuals
  // stay on MotionValues and never re-render React.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(value * count)));
    setActiveIndex((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Benefits"
      className="relative w-full bg-[var(--c-dark-green)]"
      // 130vh of scroll per item, from the original's
      // `calc(var(--vh,1vh) * 130 * var(--items-count))`. The count comes from
      // the data, so this cannot be a static utility.
      style={{ height: `calc(${SCROLL_PER_ITEM_VH}vh * ${count})` }}
    >
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden lg:h-[100svh]">
        <div className="absolute inset-0">
          {benefits.map((benefit, index) => (
            <BenefitMedia
              key={benefit.eyebrow}
              benefit={benefit}
              index={index}
              count={count}
              progress={scrollYProgress}
              isActive={index === activeIndex}
              reduced={reduced}
            />
          ))}
        </div>

        {/* The reference's `.image-layout .overlay`: rgba(0,0,0,.65) over the
            footage, so light copy keeps its contrast whatever is playing. */}
        <div aria-hidden className="absolute inset-0 z-[1] bg-black/65" />

        <div className="site-gutter absolute inset-0 z-[2] flex items-stretch">
          <div className="relative w-full lg:w-1/2">
            {benefits.map((benefit, index) => (
              <BenefitCopy
                key={benefit.eyebrow}
                benefit={benefit}
                index={index}
                count={count}
                progress={scrollYProgress}
                isActive={index === activeIndex}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
