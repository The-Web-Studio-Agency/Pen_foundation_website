'use client';

import { useRef } from 'react';

import styles from './hero.module.css';
import type { HeroProgressSource } from './useHeroProgress';
import { useHeroVideo } from './useHeroVideo';

interface HeroBackgroundProps {
  src: string;
  /** Still shown before the video has data, and while motion is reduced. */
  poster?: string;
  /** The legibility scrim over the footage. */
  overlay: boolean;
  /** The hero scrub — the same value the headings read. */
  progress: HeroProgressSource;
  /** Reduced motion: hold the poster frame, never seek. */
  frozen: boolean;
}

/**
 * The pinned visual layer.
 *
 * The reference paints a scroll-scrubbed frame sequence into a `<canvas>` here.
 * This keeps the geometry identical — sticky, one viewport tall, black behind,
 * media covering — and puts PEN's own film in the slot, scrubbed off the same
 * progress value rather than played.
 *
 * There is no `loop` and no `autoplay`: both would fight the scrubber for the
 * timeline. The element is a decoding surface that `useHeroVideo` seeks.
 */
export function HeroBackground({ src, poster, overlay, progress, frozen }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useHeroVideo(videoRef, progress, !frozen);

  return (
    <div className={styles.background} aria-hidden>
      <div className={styles.stage}>
        <div className={styles.media}>
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            poster={poster}
            muted
            playsInline
            /*
             * `auto`, not `metadata`. Seeking into a range that has not been
             * fetched stalls on a range request mid-scrub, which reads as the
             * video sticking while the text keeps moving. The scrub shows every
             * frame of the file, so all of it is wanted regardless.
             */
            preload="auto"
            tabIndex={-1}
          />
          {overlay ? <div className={styles.scrim} /> : null}
        </div>
      </div>
    </div>
  );
}
