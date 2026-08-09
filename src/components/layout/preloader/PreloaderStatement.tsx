'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { siteConfig } from '@/config/site';
import styles from './preloader.module.css';

/**
 * The statement, set in the hero's own type and revealed in four beats.
 *
 * The line breaks are not chosen here — they are `hero.sequence[0].lines`,
 * passed in, so the overlay breaks the sentence exactly where the hero breaks
 * it. That is what lets the two compositions sit on top of each other without
 * a reflow when the overlay dissolves.
 *
 * Within those lines the words arrive in groups, which is the progression the
 * brief asks for:
 *
 *   When → When was the last time → + a foundation → + surprised you?
 *
 * Each group rises into a mask. Two properties move — a clip window and a
 * translate — and nothing else: no fade on the words themselves, no scale, no
 * blur. Type being set, rather than an effects reel.
 */

/** Word counts that cut each line into its reveal groups, in order. */
const GROUPS_PER_LINE = [
  [1, 4], // "When" | "was the last time"
  [2, 2], // "a foundation" | "surprised you?"
];

const GROUP_DURATION = 0.55;
/** When each group starts, in seconds. The last lands at ~1.17s. */
const GROUP_DELAYS = [0, 0.18, 0.42, 0.62];

function splitIntoGroups(line: string, counts: number[]) {
  const words = line.split(' ');
  const groups: string[] = [];
  let cursor = 0;
  for (const count of counts) {
    groups.push(words.slice(cursor, cursor + count).join(' '));
    cursor += count;
  }
  // Anything the counts did not account for stays with the last group rather
  // than being dropped — the copy is locked, but this must not lose words if
  // it ever changes.
  if (cursor < words.length) {
    groups[groups.length - 1] = [groups[groups.length - 1], ...words.slice(cursor)].join(' ');
  }
  return groups.filter(Boolean);
}

export interface PreloaderStatementProps {
  /** `hero.sequence[0].lines` — the hero's own hand-broken composition. */
  lines: string[];
  /** Reduced motion: the finished composition, painted once. */
  still: boolean;
}

export function PreloaderStatement({ lines, still }: PreloaderStatementProps) {
  const sentence = lines.join(' ');

  /* Each group's delay is its position in the whole sentence, not in its line,
     so the four beats run continuously across the line break. Resolved here
     rather than counted during render — a running index mutated while
     rendering JSX is exactly what `react-hooks/immutability` exists to stop. */
  const composed = useMemo(() => {
    const perLine = lines.map((line, i) =>
      splitIntoGroups(line, GROUPS_PER_LINE[i] ?? [line.split(' ').length]),
    );
    // Where each line's first group falls in the sentence-wide beat order.
    const startOfLine = perLine.reduce<number[]>(
      (acc, groups, i) => [...acc, (acc[i] ?? 0) + groups.length],
      [0],
    );

    return perLine.map((groups, lineIndex) => ({
      line: lines[lineIndex] ?? '',
      groups: groups.map((text, i) => {
        const beat = (startOfLine[lineIndex] ?? 0) + i;
        return { text, delay: GROUP_DELAYS[Math.min(beat, GROUP_DELAYS.length - 1)] ?? 0 };
      }),
    }));
  }, [lines]);

  return (
    <div>
      <h1 className={styles.statement}>
        {/* The readable sentence. The groups below are decorative twins, the
            same split the hero uses for its per-character spans. */}
        <span className={styles.srOnly}>{sentence}</span>

        {composed.map(({ line, groups }) => (
          <span key={line} className={styles.line} aria-hidden>
            {groups.map(({ text, delay }, i, all) => (
              <span key={text}>
                <span className={styles.group}>
                  <motion.span
                    className={styles.groupInner}
                    initial={still ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: GROUP_DURATION, delay, ease: EASE_OUT_EXPO }}
                  >
                    {text}
                  </motion.span>
                </span>
                {/* The groups are inline-block masks, so the space between them
                    has to sit outside the mask or it gets clipped along with
                    the words. */}
                {i < all.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* Arrives after the sentence has finished, so it reads as a signature
          rather than as part of the statement. */}
      <motion.div
        className={styles.caption}
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: still ? 0 : 1.05, ease: EASE_OUT_EXPO }}
        aria-hidden
      >
        <motion.span
          className={styles.rule}
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: still ? 0 : 1.05, ease: EASE_OUT_EXPO }}
        />
        <span className={styles.captionText}>{siteConfig.tagline}</span>
      </motion.div>
    </div>
  );
}
