'use client';

import { useReducedMotion } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroScrollIndicator } from './HeroScrollIndicator';
import styles from './hero.module.css';
import { useHeroProgress } from './useHeroProgress';
import { hero } from '@/content/data/homepage';

/**
 * The scroll-scrubbed opening of the home page.
 *
 * A stage pinned inside three viewport heights of scroll, over which each
 * heading in `hero.sequence` types itself in one character at a time and is
 * then wiped out again by a second wave running the same direction. The
 * character under the reveal front is tinted `--hero-accent` until it lands,
 * then turns white. Headings sit on a fixed bottom edge and grow upward, so the
 * two-line and four-line ones share a baseline.
 *
 * It is a pure scrub, not an entrance: scrolling back up runs the waves
 * backwards. Progress is damped (`useHeroProgress`), standing in for the
 * smoothed scroll value the reference reads from, and is published through a
 * subscription rather than React state — character opacity and colour are
 * written straight to the DOM, so a full scrub costs zero renders.
 *
 * That one damped value is the hero's only clock. It drives the reveal, the
 * erase, which heading is up — and the film's `currentTime`, which is why the
 * footage cannot drift out of step with the words and why reversing the scroll
 * reverses both. The video never plays; `useHeroVideo` seeks it.
 *
 * The geometry, timing and type scale are the reference's, measured off it. The
 * copy, the film and the accent are PEN's; where the reference paints a
 * scroll-scrubbed `<canvas>` frame sequence, `HeroBackground` scrubs the site's
 * own film in the identical slot.
 *
 * The section deliberately runs underneath the fixed `SiteHeader` — the
 * original has no top padding here either, and `src/app/page.tsx` omits the
 * usual `pt-nav` for the same reason.
 */

/**
 * PEN's own film. Not the reference's — that asset was never copied.
 *
 * This is a delivery encode, and the three settings that are not the usual
 * web-video defaults are all here to make the film seekable rather than
 * watchable — how a scrub feels is mostly a property of the file:
 *
 *   GOP 5      a seek decodes at most five frames. Sparse keyframes are what
 *              make scrubbing lurch, and reversing worst of all, because the
 *              decoder has to run forward from the previous one every time.
 *   15fps      for a scrub, frame rate is scroll granularity, not motion
 *              smoothness. 542 frames over the pinned range is already a new
 *              frame every few pixels; 30 would double the weight to no effect.
 *   faststart  `moov` ahead of `mdat`, so `duration` arrives early instead of
 *              after the download and the scrub can start mapping immediately.
 *
 * Cut from the 180MB 36s master with ffmpeg (720p, crf25) at ~15MB. The master
 * lives outside the repo, at TWS/media-masters/ — it is a mezzanine file and
 * was never servable: at 40Mbps the browser cannot fetch and decode it fast
 * enough to keep up with a scroll.
 */
const HERO_VIDEO = '/media/videos/hero.mp4';

/**
 * First frame of that film, held up while the video has no data and for the
 * whole of the reduced-motion rendering. Extracted from hero.mp4 itself, so it
 * is the same footage and never a mismatched still.
 */
const HERO_POSTER = '/media/images/homepage/hero-poster.webp';

/**
 * Scroll each heading owns, in `svh`.
 *
 * The runway was a flat `300svh`: one viewport for the stage plus 200 of scrub,
 * split evenly by however many headings there were — 50svh each at the original
 * four. The script is six beats now, and holding the runway flat would have
 * silently made every reveal a third faster rather than adding room for the two
 * new ones. Deriving it keeps one beat's pacing fixed no matter how long the
 * script gets, which is the property worth preserving: the scrub speed is the
 * reading speed.
 */
const SCRUB_PER_HEADING_SVH = 50;
const STAGE_SVH = 100;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  // `useReducedMotion` reports null until the media query has been read on the
  // client, which is the same "assume motion" default the rest of the site
  // renders with.
  const reducedMotion = useReducedMotion() === true;

  const progress = useHeroProgress(sizerRef, !reducedMotion);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label={hero.sequence[0]?.lines.join(' ')}
    >
      <div
        ref={sizerRef}
        className={styles.sizer}
        style={
          {
            '--hero-sizer-height': `${STAGE_SVH + hero.sequence.length * SCRUB_PER_HEADING_SVH}svh`,
          } as CSSProperties
        }
      >
        <HeroBackground
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          overlay
          progress={progress}
          frozen={reducedMotion}
        />

        <HeroContent sequence={hero.sequence} progress={progress} frozen={reducedMotion} />

        {/* Always rendered. It used to be omitted under reduced motion, which
            meant the client's first tree differed from the server's and React
            failed hydration; `hero.module.css` hides it in a media query
            instead, where the decision costs no markup. */}
        <HeroScrollIndicator
          label={hero.scrollLabel}
          progress={progress}
          sectionRef={sectionRef}
        />
      </div>
    </section>
  );
}
