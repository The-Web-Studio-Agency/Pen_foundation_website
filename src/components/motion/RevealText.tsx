'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * The reference site's signature heading treatment: text is split into words,
 * each word into characters, and every character warms from a faint gray
 * through lime to the final colour on a short stagger. It plays once when the
 * heading enters the viewport and does not reverse on the way back up.
 *
 * The colour ramp itself lives in `globals.css` as the `color-transition`
 * keyframes, copied verbatim from the original.
 */

/** Milliseconds added per character index. */
const STAGGER = 22;
/** Length of one character's own transition. */
const DURATION = 850;

export interface RevealTextProps {
  text: string;
  /** Swaps the ramp for the light-on-dark variant used by the site footer. */
  onDark?: boolean;
  /** Characters already elapsed, so multi-line headings keep one continuous wave. */
  indexOffset?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Splits into words carrying the running character index, so each character's
 * delay is derived rather than accumulated during render.
 */
function splitWords(text: string, offset: number) {
  const words = text.split(' ');
  let cursor = offset;
  return words.map((word) => {
    const start = cursor;
    // +1 for the space that follows the word.
    cursor += word.length + 1;
    return { word, start };
  });
}

export function RevealText({
  text,
  onDark = false,
  indexOffset = 0,
  className,
  as: Tag = 'span',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const words = splitWords(text, indexOffset);

  return (
    <Tag ref={ref as React.Ref<never>} className={cn(inView && 'reveal-active', className)}>
      {words.map(({ word, start }, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="inline-block">
            {Array.from(word).map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="reveal-char"
                data-on-dark={onDark || undefined}
                style={{
                  animationDelay: `${(start + i) * STAGGER}ms`,
                  animationDuration: `${DURATION}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
