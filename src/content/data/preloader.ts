/**
 * Entry-overlay copy.
 *
 * Its own module rather than an addition to `homepage.ts`, for two reasons.
 * The hero block there is marked LOCKED — approved as-is, not to be edited —
 * and the overlay used to borrow `hero.sequence[0]` from it, which quietly made
 * the locked block a dependency of a layout component. And the Preloader mounts
 * in the root layout, not on the homepage, so its words are not homepage copy
 * even though that is the only place a visitor meets them.
 *
 * NOT a factual claim between them: this is the argument the site makes stated
 * as a proposition, and the numbers that back it live in the sections below the
 * fold. "For over 100 years" is the one figure here, and it is the same century
 * the `statement` and `whyPen` blocks refer to (a cast-in-situ footing's 21-day
 * curing cycle, unchanged for a century) — not a new claim.
 */

export interface PreloaderBeat {
  /**
   * Hand-broken lines. Break points are chosen here rather than left to the
   * measure so the composition is the same at every viewport that fits it —
   * the overlay sets type, it does not flow it.
   */
  lines: string[];
}

/**
 * Three beats, written one word at a time and separated by a pause.
 *
 * The turn is the point: two sentences that state the settled position, then a
 * two-word reversal. "Until now." is deliberately short — it lands in well
 * under a second where the others take a beat over one, so the rhythm breaks
 * exactly where the argument does.
 *
 * The ellipsis in "foundations..." is load-bearing, not punctuation: the
 * reveal holds on it before releasing the rest of the line. See
 * `ELLIPSIS_PAUSE` in PreloaderStatement.tsx.
 */
export const preloaderSequence: PreloaderBeat[] = [
  { lines: ['What if everything you knew', 'about foundations... was wrong?'] },
  { lines: ['For over 100 years,', "we've built the same way."] },
  { lines: ['Until now.'] },
];
