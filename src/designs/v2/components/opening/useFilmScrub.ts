'use client';

import { type RefObject, useEffect } from 'react';

import type { ProgressSource } from '../scroll/useScrollProgress';

/**
 * Seek granularity: one frame of hero.mp4, which is encoded at 15fps for
 * scrubbing (see the live homepage's Hero.tsx). Finer seeks cannot change the
 * picture; they only queue decodes.
 */
const SEEK_EPSILON = 1 / 15;
/** Seeking exactly to `duration` fires `ended` and can blank the last frame. */
const TAIL_GUARD = 0.05;

/**
 * Maps a 0→1 value onto `video.currentTime`. The video never plays; scroll is
 * the clock, so reversing the scroll runs the film backwards.
 *
 * Seeks are coalesced: while one is in flight, newer positions overwrite the
 * pending target and a single follow-up seek is issued on `seeked`, so a fast
 * flick lands on the frame matching where scrolling stopped rather than
 * working through a queue of stale ones.
 *
 * `toFilm` converts the shared opening progress into film progress.
 */
export function useFilmScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: ProgressSource,
  toFilm: (p: number) => number,
  enabled: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    video.pause();
    let duration = 0;
    let wanted = 0;

    const timeFor = (p: number) => Math.min(Math.max(p, 0), 1) * Math.max(0, duration - TAIL_GUARD);

    const flush = () => {
      if (!duration || video.seeking) return;
      if (Math.abs(video.currentTime - wanted) <= SEEK_EPSILON) return;
      video.currentTime = wanted;
    };

    const onSeeked = () => flush();
    const onMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) return;
      wanted = timeFor(toFilm(progress.current()));
      flush();
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onMetadata);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();

    const unsubscribe = progress.subscribe((p) => {
      if (!duration) return;
      wanted = timeFor(toFilm(p));
      flush();
    });

    // iOS Safari paints nothing for a video that has never played, so a
    // seek-only scrub would show the poster forever. One muted play, paused on
    // the next tick, unlocks the decoder; refusal (low-power mode) just keeps
    // the poster.
    let cancelled = false;
    void video
      .play()
      .then(() => {
        if (cancelled) return;
        video.pause();
        flush();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      unsubscribe();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
    };
  }, [videoRef, progress, toFilm, enabled]);
}
