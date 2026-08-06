'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { cn, sectionNotchPath } from '@/lib/utils';

/**
 * A dark band whose top and/or bottom edge is clipped into the site's notch
 * profile — shallow shoulders at the far corners with a recessed middle.
 *
 * The original regenerates the SVG path from the element's measured size, so
 * this does too: the shoulders stay a fixed distance from the corners while the
 * flat middle stretches to fill whatever width is available.
 */
export interface NotchedBandProps {
  height?: number;
  dip: number;
  shoulder: number;
  run: number;
  radius: number;
  edges?: { top?: boolean; bottom?: boolean };
  className?: string;
  children?: React.ReactNode;
}

export function NotchedBand({
  height,
  dip,
  shoulder,
  run,
  radius,
  edges = { top: true },
  className,
  children,
}: NotchedBandProps) {
  const clipId = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: height ?? 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setSize({ width: box.width, height: height ?? box.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [height]);

  const ready = size.width > 0 && size.height > 0;
  const path = ready
    ? sectionNotchPath({
        width: size.width,
        height: size.height,
        dip,
        shoulder,
        run,
        radius,
        edges,
      })
    : '';

  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={height ? { height } : undefined}
    >
      {ready ? (
        <svg aria-hidden className="pointer-events-none absolute size-0" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={path} />
            </clipPath>
          </defs>
        </svg>
      ) : null}
      <div className="size-full" style={ready ? { clipPath: `url(#${clipId})` } : undefined}>
        {children}
      </div>
    </div>
  );
}
