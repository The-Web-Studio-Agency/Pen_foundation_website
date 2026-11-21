'use client';

import { useEffect, useRef, useState } from 'react';

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
 *
 * Nothing is downloaded, not even the poster, until the film is within about
 * a screen of the viewport, so films further down never compete with the
 * first screen for bandwidth.
 */
export function LoopVideo({ src, poster, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '120% 0px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !near) return;

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
  }, [near]);

  return (
    <video
      ref={ref}
      className={className}
      src={near ? src : undefined}
      poster={near ? poster : undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
    />
  );
}
