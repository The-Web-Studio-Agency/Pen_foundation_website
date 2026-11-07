'use client';

import { useEffect, useRef, useState } from 'react';

import { FOOTER_NOTCH, sectionNotchPath } from '@/lib/utils';

/**
 * Clips its child's top edge into the previous site's footer notch: raised
 * shoulders at both corners, a recessed flat middle. Same geometry as the old
 * footer (`FOOTER_NOTCH`), but the shoulder and slope shrink with the width so
 * the profile keeps its proportions on phones instead of colliding in the
 * middle.
 *
 * The wrapper pulls itself up by the dip (see `.notched` in
 * closing.module.css) so the cut-away strip shows the section above, not a
 * blank band.
 */
export function NotchedTop({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      // At 1470px the original reads 201px shoulder + 72px slope; scale both
      // down below that, keep them fixed above it.
      const k = Math.min(1, width / 1470);
      setPath(
        sectionNotchPath({
          width,
          height,
          dip: FOOTER_NOTCH.dip * Math.max(0.6, k),
          shoulder: FOOTER_NOTCH.shoulder * k,
          run: FOOTER_NOTCH.run * Math.max(0.6, k),
          radius: FOOTER_NOTCH.radius * Math.max(0.6, k),
          edges: { top: true },
        }),
      );
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={path ? { clipPath: `path('${path}')` } : undefined}
    >
      {children}
    </div>
  );
}
