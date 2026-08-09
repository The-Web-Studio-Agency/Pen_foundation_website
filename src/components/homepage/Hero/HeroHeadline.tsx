'use client';

import { useEffect, useMemo, useRef } from 'react';

import styles from './hero.module.css';
import { CHAR_REVEALED_COLOR, charState, headingProgress } from './heroAnimation';
import type { HeroProgressSource } from './useHeroProgress';

interface HeroHeadlineProps {
  /** One string per rendered line — the sequence breaks its lines by hand. */
  lines: string[];
  /** Position in the sequence — decides which slice of the scrub it owns. */
  index: number;
  count: number;
  progress: HeroProgressSource;
  /** The opening heading carries the `h1`; the rest are continuation copy. */
  as?: 'h1' | 'p';
  /** Reduced motion: paint the finished state once and never subscribe. */
  frozen?: boolean;
}

interface Applied {
  opacity: number;
  color: string;
}

/**
 * Splits the lines into per-character spans, keeping one continuous character
 * index across line breaks so a multi-line heading reveals as a single wave
 * rather than restarting on each line.
 *
 * Whitespace is rendered but never wrapped, matching the reference — its
 * "Scroll to explore" label has 17 characters and exactly 15 `--char` spans.
 * Spaces therefore cost nothing in the reveal cadence.
 */
function useSplitLines(lines: string[]) {
  return useMemo(() => {
    let cursor = 0;
    return lines.map((line) =>
      Array.from(line).map((character) => ({
        character,
        index: /\s/.test(character) ? -1 : cursor++,
      })),
    );
  }, [lines]);
}

/**
 * One heading of the sequence, revealed and erased one character at a time.
 *
 * Not `RevealText`. That component plays a one-shot CSS animation when the text
 * enters the viewport; this one is a pure scrub — every character's state is a
 * function of scroll position, so dragging back up runs both waves backwards.
 * The two cannot be reconciled, and `RevealText` stays as it is for the eleven
 * other places on the site that want the one-shot.
 */
export function HeroHeadline({
  lines,
  index,
  count,
  progress,
  as: Tag = 'p',
  frozen = false,
}: HeroHeadlineProps) {
  const split = useSplitLines(lines);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  // Mirrors what is currently on each span so a frame only writes what changed.
  const appliedRef = useRef<Applied[]>([]);

  useEffect(() => {
    const chars = charsRef.current;
    const total = chars.length;
    if (!total) return;

    appliedRef.current = [];

    if (frozen) {
      for (const span of chars) {
        if (!span) continue;
        span.style.opacity = '1';
        span.style.color = CHAR_REVEALED_COLOR;
      }
      return;
    }

    return progress.subscribe((value) => {
      const local = headingProgress(value, index, count);
      const applied = appliedRef.current;

      for (let i = 0; i < total; i += 1) {
        const span = chars[i];
        if (!span) continue;

        const next = charState(local, i, total);
        const previous = applied[i];

        // Quantised so a settling damped value stops writing once it is
        // visually still.
        const opacity = Math.round(next.opacity * 1000) / 1000;

        if (!previous || previous.opacity !== opacity) {
          span.style.opacity = String(opacity);
        }
        if (!previous || previous.color !== next.color) {
          span.style.color = next.color;
        }
        applied[i] = { opacity, color: next.color };
      }
    });
  }, [progress, index, count, frozen, split]);

  return (
    <Tag className={styles.headline}>
      {/*
       * The split spans are decorative, so the readable copy is carried by a
       * visually hidden twin rather than an `aria-label`: only the opening
       * heading is an `h1`, and on the `p`s that follow a label on a generic
       * role is dropped by most screen readers — the sequence would go silent
       * after its first line. Same affordance HeroScrollIndicator uses.
       */}
      <span className={styles.srOnly}>{lines.join(' ')}</span>
      {split.map((line, lineIndex) => (
        <span key={lineIndex} className={styles.line} aria-hidden>
          {line.map(({ character, index: charIndex }, position) =>
            charIndex < 0 ? (
              character
            ) : (
              <span
                key={position}
                className={styles.char}
                ref={(node) => {
                  charsRef.current[charIndex] = node;
                }}
              >
                {character}
              </span>
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}
