'use client';

import { useEffect, useRef } from 'react';

import s from './blogs.module.css';

/**
 * A thin lime bar along the top of the viewport that fills as the article
 * body (`targetId`) is read. Written straight to the element's transform on
 * an animation frame — no React state, so scrolling never re-renders.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const paint = () => {
      frame = 0;
      const el = document.getElementById(targetId);
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const read = Math.min(Math.max(-rect.top + window.innerHeight * 0.5, 0), Math.max(total, 1));
      bar.style.transform = `scaleX(${total > 0 ? read / total : 0})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div className={s.progress} aria-hidden>
      <div ref={barRef} className={s.progressBar} />
    </div>
  );
}
