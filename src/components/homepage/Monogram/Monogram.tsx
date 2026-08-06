'use client';

import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Fragment, useEffect, useRef, useState } from 'react';

import { RevealText } from '@/components/motion';
import { DotGrid } from '@/components/homepage/shared/DotGrid';
import { monogram } from '@/content/data/homepage';
import { cn } from '@/lib/utils';

/**
 * "That's the / Yard Control System." — the Y, C and S break out of the
 * sentence, scale up and converge into the giant YCS™ monogram.
 *
 * The original pins a 100svh stage inside a 200svh section and drives every
 * step from the section's own scroll progress, so this does the same: one
 * `useScroll` feeds MotionValues and nothing re-renders while you scroll.
 *
 * Each anchor letter exists twice — once inside the sentence (where it belongs
 * to the accessible text) and once in the decorative monogram. The monogram
 * copy starts scaled and translated onto its in-sentence twin, so the pair
 * cross-fades in place before the giant letter travels to its final slot.
 */

const { subTitle, sentence, anchorIndexes, trademark } = monogram;

/** The sub-title and the sentence share one continuous reveal wave. */
const SENTENCE_OFFSET = subTitle.length + 1;

/** Scroll progress at which the anchors begin lifting out of the sentence… */
const LIFT_START = 0.45;
/** …and where they have landed as the monogram. */
const LIFT_END = 0.8;
/** The letter and its twin swap over in the first slice of the lift. */
const CROSSFADE_END = 0.55;
/** Progress at which the ™ is switched on. */
const MARK_AT = 0.8;

/** `--ease-expo`, so the letters arrive the way the rest of the site does. */
const EASE_EXPO = cubicBezier(0.19, 1, 0.22, 1);

interface Segment {
  text: string;
  /** Index of the first character in `sentence`, so the reveal wave lines up. */
  start: number;
  /** Position in the monogram, or -1 for an ordinary run of text. */
  anchor: number;
}

/**
 * Splits the sentence into words, and each word into runs of plain text with
 * the anchor characters standing alone. Words stay whole (the original wraps
 * each one in an `inline-flex` `.heading__word-wrapper`) so a line can never
 * break between an anchor and the rest of its word.
 */
function buildWords(): Segment[][] {
  const order = new Map(
    [...anchorIndexes].sort((a, b) => a - b).map((index, position) => [index, position] as const),
  );
  const words: Segment[][] = [[]];

  Array.from(sentence).forEach((char, index) => {
    if (char === ' ') {
      words.push([]);
      return;
    }
    const word = words[words.length - 1];
    const anchor = order.get(index) ?? -1;
    const previous = word[word.length - 1];
    if (anchor === -1 && previous && previous.anchor === -1) {
      previous.text += char;
      return;
    }
    word.push({ text: char, start: index, anchor });
  });

  return words;
}

const WORDS = buildWords();

/** The monogram reads out of the sentence rather than being spelled twice. */
const ANCHOR_CHARS = [...anchorIndexes]
  .sort((a, b) => a - b)
  .map((index) => sentence.charAt(index));

interface Lift {
  x: number;
  y: number;
  scale: number;
}

/** Where every anchor ends up: its own slot, at its own size. */
const LANDED: Lift = { x: 0, y: 0, scale: 1 };

/**
 * Layout position relative to `root`, walked up the offset chain rather than
 * read from `getBoundingClientRect`, because the anchors carry their own
 * transforms and those must not feed back into the measurement.
 */
function offsetWithin(node: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = node;
  while (current && current !== root) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

const ANCHOR_LETTER_CLASS = cn(
  'mt-[-.625rem] inline-block origin-center',
  'text-[5.625rem] tracking-[.211875rem]',
  'md:text-[11.25rem] md:tracking-[-.125rem]',
  'lg:text-[11.3125rem]',
);

interface AnchorLetterProps {
  char: string;
  progress: MotionValue<number>;
  lift: Lift;
  reduced: boolean;
  onNode: (node: HTMLSpanElement | null) => void;
}

function AnchorLetter({ char, progress, lift, reduced, onNode }: AnchorLetterProps) {
  const options = { ease: EASE_EXPO };
  const x = useTransform(progress, [LIFT_START, LIFT_END], [lift.x, 0], options);
  const y = useTransform(progress, [LIFT_START, LIFT_END], [lift.y, 0], options);
  const scale = useTransform(progress, [LIFT_START, LIFT_END], [lift.scale, 1], options);
  const opacity = useTransform(progress, [LIFT_START, CROSSFADE_END], [0, 1]);

  return (
    <motion.span
      ref={onNode}
      className={ANCHOR_LETTER_CLASS}
      style={reduced ? { opacity: 1 } : { x, y, scale, opacity }}
    >
      {char}
    </motion.span>
  );
}

export function Monogram() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const twinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lifts, setLifts] = useState<Lift[]>(() => ANCHOR_CHARS.map(() => LANDED));
  const [markVisible, setMarkVisible] = useState(false);
  // `useReducedMotion` is null until it has read the media query on the client.
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const twinOpacity = useTransform(scrollYProgress, [LIFT_START, CROSSFADE_END], [1, 0]);

  // A single flip rather than per-frame state: the original toggles `.show` on
  // the ™ and lets a .1s CSS transition carry the fade.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setMarkVisible(value >= MARK_AT);
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const next = ANCHOR_CHARS.map((_, index) => {
        const twin = twinRefs.current[index];
        const slot = slotRefs.current[index];
        if (!twin || !slot) return LANDED;

        const from = offsetWithin(twin, stage);
        const to = offsetWithin(slot, stage);
        const twinSize = parseFloat(getComputedStyle(twin).fontSize);
        const slotSize = parseFloat(getComputedStyle(slot).fontSize);

        // Both boxes scale about their centre, so matching centres is what
        // makes the shrunk monogram letter sit exactly on its twin.
        return {
          x: from.x + twin.offsetWidth / 2 - (to.x + slot.offsetWidth / 2),
          y: from.y + twin.offsetHeight / 2 - (to.y + slot.offsetHeight / 2),
          scale: slotSize > 0 ? twinSize / slotSize : 1,
        };
      });

      setLifts((current) =>
        current.every(
          (lift, index) =>
            lift.x === next[index].x &&
            lift.y === next[index].y &&
            lift.scale === next[index].scale,
        )
          ? current
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    // Every metric above moves when the web font swaps in.
    void document.fonts.ready.then(measure);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200svh] w-full bg-[var(--c-dark-green)]">
      <div className="sticky top-0 flex h-[100svh] w-full justify-center">
        <DotGrid onDark />
        <div
          ref={stageRef}
          className={cn(
            'site-gutter relative flex h-full w-full flex-col items-center justify-center',
            'gap-y-8 text-center leading-[.95] text-[var(--c-white)]',
          )}
        >
          <RevealText
            as="p"
            text={subTitle}
            onDark
            className="text-[1.25rem] tracking-[-.0125rem] opacity-40"
          />

          <div className="relative">
            <h2 className="title-si">
              {WORDS.map((word, wordIndex) => (
                <Fragment key={word[0]?.start ?? wordIndex}>
                  {/* Keeps a word unbreakable, anchors and all. */}
                  <span className="relative inline-flex">
                    {word.map((segment) =>
                      segment.anchor >= 0 ? (
                        <motion.span
                          key={segment.start}
                          ref={(node) => {
                            twinRefs.current[segment.anchor] = node;
                          }}
                          className="inline-block"
                          style={reduced ? { opacity: 0 } : { opacity: twinOpacity }}
                        >
                          <RevealText
                            text={segment.text}
                            onDark
                            indexOffset={SENTENCE_OFFSET + segment.start}
                          />
                        </motion.span>
                      ) : (
                        <RevealText
                          key={segment.start}
                          text={segment.text}
                          onDark
                          indexOffset={SENTENCE_OFFSET + segment.start}
                        />
                      ),
                    )}
                  </span>
                  {wordIndex < WORDS.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </h2>

            {/* Decorative duplicate of three letters the sentence already
             * carries — hidden so they are not announced a second time. */}
            <div
              aria-hidden
              className="absolute top-full left-1/2 mt-4 -translate-x-1/2 whitespace-nowrap lg:mt-8"
            >
              {ANCHOR_CHARS.map((char, index) => (
                <AnchorLetter
                  key={char + index}
                  char={char}
                  progress={scrollYProgress}
                  lift={lifts[index] ?? LANDED}
                  reduced={reduced}
                  onNode={(node) => {
                    slotRefs.current[index] = node;
                  }}
                />
              ))}
              <span
                className={cn(
                  'absolute translate-x-[.8rem] text-[2rem] opacity-0 transition-opacity duration-100',
                  'lg:top-[.4rem] lg:right-[-.7rem] lg:translate-x-full lg:text-[3rem]',
                  (markVisible || reduced) && 'opacity-100',
                )}
              >
                {trademark}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
