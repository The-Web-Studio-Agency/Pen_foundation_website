'use client';

import { useEffect, useRef } from 'react';

interface LoopVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Muted, looping background film.
 *
 * Plays only while on screen (several of these sit on one page, and decoding
 * films nobody can see costs battery), and never plays under
 * `prefers-reduced-motion` — the poster frame stands in. Decorative: hidden
 * from assistive tech, because every section that uses one carries its message
 * in text.
 */
export function LoopVideo({ src, poster, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can be refused (low-power mode). The poster stays up.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
    />
  );
}
