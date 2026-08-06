import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MediaFrameProps {
  /** Shown in the corner so the slot reads as designed, never as a broken image. */
  label: string;
  /** Tailwind aspect utility. */
  aspect?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Art-directed placeholder for footage or renders that aren't wired yet.
 *
 * Deliberately not a generic <Image> wrapper: this is the "not built yet" slot,
 * and it should look intentional in a review. Real imagery uses next/image.
 */
export function MediaFrame({
  label,
  aspect = 'aspect-[4/3]',
  className,
  children,
}: MediaFrameProps) {
  const line = 'rgba(20,25,28,0.08)';

  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden rounded-sm bg-gradient-to-br from-neutral-100 to-neutral-200',
        aspect,
        className,
      )}
    >
      {/* drafting grid — reads as an engineered frame */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        <span className="font-mono text-[9px] tracking-[0.3em] text-ink/50 uppercase">{label}</span>
      </div>
      {children}
    </div>
  );
}
