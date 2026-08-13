'use client';

import { type RefObject, useEffect } from 'react';

import { clamp01 } from './heroAnimation';
import type { HeroProgressSource } from './useHeroProgress';

/**
 * Drives a video's timeline from the hero scrub.
 *
 * The video is not a background loop that happens to sit under the headings —
 * it is the same animation. It never plays: `useHeroProgress` owns the clock,
 * and this hook does nothing but map that one damped value onto
 * `video.currentTime`. Text and footage therefore cannot drift, and reversing
 * the scroll runs both backwards together.
 *
 * The mapping is linear across the whole scrub, which is the correct
 * correspondence rather than a coincidence: `headingProgress` splits the same
 * 0→1 range evenly between the headings, so progress 0.25 is both the end of
 * the first heading's window and a quarter of the way through the footage.
 *
 * Like the character reveal, this subscribes rather than renders — a full
 * scrub costs zero React renders.
 */

/**
 * Seek granularity, in seconds: one frame of the 15fps hero.mp4.
 *
 * A seek finer than the frame grid cannot change the picture, so it buys
 * nothing and costs a decode round trip. Measured over a full slow scrub, a
 * sub-frame threshold issued 180 seeks to paint 140 distinct frames — roughly
 * a fifth of them landing on the frame already on screen. Sizing the threshold
 * to the grid removes those without moving the image.
 *
 * The film is encoded at 15fps deliberately: for a scrub, frame rate is scroll
 * granularity rather than motion smoothness, and 626 frames across the pinned
 * range is already a new frame every few pixels of scroll.
 *
 * This constant is therefore tied to the encode, not a free tuning knob: it has
 * to match the `fps` in `Hero.tsx`'s ffmpeg recipe. Set it finer than the frame
 * grid and the extra seeks cannot change the picture; set it coarser and the
 * scrub visibly skips frames the file actually has.
 */
const SEEK_EPSILON = 1 / 15;

/**
 * Held back from the very end of the timeline. Seeking exactly to `duration`
 * fires `ended` and can blank the final frame; a hair short holds it instead.
 */
const TAIL_GUARD = 0.05;

/** Where in the footage a given scrub position sits. */
function timeFor(progress: number, duration: number) {
  return clamp01(progress) * Math.max(0, duration - TAIL_GUARD);
}

export function useHeroVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: HeroProgressSource,
  enabled = true,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Nothing in this hook ever resumes playback. Pausing up front covers the
    // element arriving from bfcache mid-play, and guarantees a running decode
    // loop is never competing with the seeks below for the timeline.
    video.pause();

    /** 0 until metadata lands, which is also the "cannot seek yet" signal. */
    let duration = 0;
    /** Latest position the scrub has asked for, issued or not. */
    let wanted = 0;

    /**
     * Issues the pending seek, if one is worth issuing.
     *
     * `video.seeking` is browser truth rather than a flag of our own, so an
     * aborted or failed seek cannot wedge this permanently. Coalescing matters
     * more than it looks: a fast drag asks for a new position every frame,
     * and stacking those makes the browser service a queue of stale seeks
     * instead of the one the user can actually see.
     */
    const flush = () => {
      if (!duration || video.seeking) return;
      if (Math.abs(video.currentTime - wanted) <= SEEK_EPSILON) return;
      video.currentTime = wanted;
    };

    // The scrub has almost always moved on while a seek was in flight; without
    // this retry a quick flick settles on whichever frame happened to be in
    // transit rather than the one matching where scrolling stopped.
    const onSeeked = () => flush();

    const onMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration <= 0) return;
      wanted = timeFor(progress.current(), duration);
      flush();
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onMetadata);
    // Metadata can already be in by the time the effect runs — warm cache, or
    // a remount — in which case the event has been and gone.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();

    // Reduced motion: the poster frame stands in for the whole sequence, so
    // there is no subscription and no seeking at all.
    const unsubscribe = enabled
      ? progress.subscribe((value) => {
          if (!duration) return;
          wanted = timeFor(value, duration);
          flush();
        })
      : undefined;

    let cancelled = false;

    if (enabled) {
      /*
       * The one and only play call, and it is not what drives the hero — it is
       * a decoder unlock. iOS Safari paints nothing for a video that has never
       * played, so seeking one shows the poster forever and the scrub appears
       * dead on every iPhone. Playing a muted inline video is permitted there;
       * we pause on the very next tick and hand the timeline straight back to
       * the scrub, which then seeks to wherever scrolling actually is.
       *
       * Refusal (low power mode) is fine and expected: the poster stays up,
       * and desktop browsers never needed the unlock in the first place.
       */
      void video
        .play()
        .then(() => {
          if (cancelled) return;
          video.pause();
          flush();
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
    };
  }, [videoRef, progress, enabled]);
}
