// components/PageWipeTransition.tsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { animate } from 'framer-motion';

/** Tapered "eye" wipe shape. progress 0 = flat line, 1 = full viewport. */
function eyePath(progress: number, width: number, height: number, hinge = 0.58) {
  const p = Math.max(0, Math.min(1, progress));
  const cy = height * hinge;
  const topY = cy - p * cy;
  const bottomY = cy + p * (height - cy);
  const xLeft = width * 0.12;
  const xRight = width * 0.88;
  return [
    `M 0 ${cy}`,
    `C ${xLeft} ${topY}, ${xRight} ${topY}, ${width} ${cy}`,
    `C ${xRight} ${bottomY}, ${xLeft} ${bottomY}, 0 ${cy}`,
    'Z',
  ].join(' ');
}

const OPEN_DURATION = 0.65;
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const CURTAIN_COLOR = '#E8E8E8';
const TINT_COLOR = '#111111';
const TINT_PEAK_OPACITY = 0.55;

export default function PageWipeTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const isFirstRender = useRef(true);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Snap the curtain on BEFORE paint so there's no flash of the new page.
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    stop.current?.();
    setVisible(true);
    setProgress(0);
  }, [pathname]);

  // Then play the reveal.
  useEffect(() => {
    if (!visible) return;
    const controls = animate(0, 1, {
      duration: OPEN_DURATION,
      ease: EASE,
      onUpdate: setProgress,
      onComplete: () => setVisible(false),
    });
    stop.current = controls.stop;
    return () => controls.stop();
  }, [visible]);

  const showOverlay = visible && size.width > 0 && size.height > 0;
  const d = showOverlay ? eyePath(progress, size.width, size.height) : '';

  return (
    <>
      {children}
      {showOverlay && (
        <svg
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[999]"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          <defs>
            <mask
              id="wipe-hole-mask"
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={size.width}
              height={size.height}
            >
              <rect width={size.width} height={size.height} fill="white" />
              <path d={d} fill="black" />
            </mask>
          </defs>
          <rect
            width={size.width}
            height={size.height}
            fill={CURTAIN_COLOR}
            mask="url(#wipe-hole-mask)"
            opacity={1 - progress}
          />
          <path d={d} fill={TINT_COLOR} opacity={TINT_PEAK_OPACITY * (1 - progress)} />
        </svg>
      )}
    </>
  );
}
