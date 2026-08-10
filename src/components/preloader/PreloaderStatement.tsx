'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { siteConfig } from '@/config/site';
import styles from './preloader.module.css';

/**
 * One beat of the statement, written a word at a time over the drawing.
 *
 * The line breaks are chosen in `preloaderSequence` and passed in, not left to
 * the measure: this sets type, it does not flow it, and a beat that rewraps
 * between viewports stops being a composition.
 *
 * The words arrive one at a time, in reading order, straight through the line
 * break:
 *
 *   When · was · the · last · time · a · foundation · surprised · you?
 *
 * Each word rises into its own mask. Two properties move — a clip window and a
 * translate — and nothing else: no fade on the words themselves, no scale, no
 * blur. Type being set, rather than an effects reel.
 *
 * The stagger is deliberately tighter than the per-word duration, so a word is
 * still arriving as the next one starts. Words that waited for each other to
 * finish would read as nine separate events instead of one sentence being
 * written.
 */

/** Gap between one word starting and the next, in seconds. */
const WORD_STAGGER = 0.09;
/** How long a single word takes to rise into place. */
const WORD_DURATION = 0.55;
/**
 * Extra beat held after a word that ends in an ellipsis.
 *
 * "about foundations... was wrong?" is written with the pause in it, so the
 * reveal has to observe it — otherwise the three dots are just characters and
 * the line reads at an even clip, which is the opposite of what they ask for.
 */
const ELLIPSIS_PAUSE = 0.34;
/** The beat between the sentence landing and the caption signing it. */
const CAPTION_GAP = 0.12;
const CAPTION_DURATION = 0.5;

function wordsOf(line: string) {
  return line.trim().split(/\s+/).filter(Boolean);
}

/**
 * Each word's start time, in seconds, laid out line by line.
 *
 * Accumulated rather than `index * WORD_STAGGER` because the ellipsis makes the
 * spacing uneven — once one gap can differ, position no longer determines time.
 * The clock runs continuously across the line break, so a two-line beat is one
 * sentence being written rather than two lines being animated.
 */
function wordDelays(lines: string[]) {
  let elapsed = 0;
  return lines.map((line) =>
    wordsOf(line).map((word) => {
      const start = elapsed;
      elapsed += WORD_STAGGER + (/(\.{3}|…)$/.test(word) ? ELLIPSIS_PAUSE : 0);
      return { text: word, delay: start };
    }),
  );
}

/** When the last word has settled, in seconds. */
function sentenceRevealSeconds(lines: string[]) {
  const last = wordDelays(lines).flat().at(-1);
  return (last?.delay ?? 0) + WORD_DURATION;
}

/**
 * The reveal's own length, in ms.
 *
 * Exported because the Preloader has to know when the sentence is finished in
 * order to time its hold, and that number used to be a literal copied into
 * Preloader.tsx. Any change to the stagger here silently desynchronised the
 * two; now it cannot.
 */
export function statementRevealMs(lines: string[]) {
  return Math.round(sentenceRevealSeconds(lines) * 1000);
}

export interface PreloaderStatementProps {
  /** One beat's hand-broken composition, from `preloaderSequence`. */
  lines: string[];
  /** Reduced motion: the finished composition, painted once. */
  still: boolean;
  /**
   * Draws the rule and the system name under the sentence.
   *
   * Only the closing beat sets this. Repeating the signature under all three
   * would make it part of the type rather than the sign-off it is, and the
   * sequence would read as three captioned slides instead of one argument.
   */
  signed?: boolean;
}

export function PreloaderStatement({ lines, still, signed }: PreloaderStatementProps) {
  const sentence = lines.join(' ');

  /* Resolved here rather than counted during render — a running index mutated
     while rendering JSX is exactly what `react-hooks/immutability` exists to
     stop. `wordDelays` keeps its accumulator to itself. */
  const composed = useMemo(
    () =>
      wordDelays(lines).map((words, lineIndex) => ({
        line: lines[lineIndex] ?? '',
        words,
      })),
    [lines],
  );

  /* Follows the sentence rather than sitting on a literal of its own, so it
     stays put if the copy or the stagger changes. */
  const captionDelay = still ? 0 : sentenceRevealSeconds(lines) + CAPTION_GAP;

  return (
    <div>
      <h1 className={styles.statement}>
        {/* The readable sentence. The groups below are decorative twins, the
            same split the hero uses for its per-character spans. */}
        <span className={styles.srOnly}>{sentence}</span>

        {composed.map(({ line, words }) => (
          <span key={line} className={styles.line} aria-hidden>
            {words.map(({ text, delay }, i, all) => (
              // Keyed on both, because a sentence may repeat a word.
              <span key={`${text}-${i}`}>
                <span className={styles.group}>
                  <motion.span
                    className={styles.groupInner}
                    initial={still ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: WORD_DURATION, delay, ease: EASE_OUT_EXPO }}
                  >
                    {text}
                  </motion.span>
                </span>
                {/* The words are inline-block masks, so the space between them
                    has to sit outside the mask or it gets clipped along with
                    the word itself. */}
                {i < all.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {!signed ? null : (
        // Arrives after the sentence has finished, so it reads as a signature
        // rather than as part of the statement.
        <motion.div
          className={styles.caption}
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: CAPTION_DURATION, delay: captionDelay, ease: EASE_OUT_EXPO }}
          aria-hidden
        >
          <motion.span
            className={styles.rule}
            initial={still ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: captionDelay, ease: EASE_OUT_EXPO }}
          />
          <span className={styles.captionText}>{siteConfig.tagline}</span>
        </motion.div>
      )}
    </div>
  );
}
