import { cn } from '@/lib/utils';

const SIZES = {
  md: 'text-[clamp(3rem,7vw,5rem)]',
  lg: 'text-[clamp(4rem,12vw,9rem)]',
  xl: 'text-[clamp(5rem,20vw,15rem)]',
} as const;

interface FigureProps {
  value: string;
  unit?: string;
  caption?: string;
  size?: keyof typeof SIZES;
  className?: string;
  /** CSS colour for the unit. Defaults to inherited text colour. */
  accent?: string;
}

/** A headline number — the figure dominates, unit and caption ride alongside. */
export function Figure({ value, unit, caption, size = 'lg', className, accent }: FigureProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <span
          className={cn('font-mono leading-[0.85] font-medium tracking-[-0.03em]', SIZES[size])}
        >
          {value}
        </span>
        {unit && (
          <span
            className="mt-2 font-mono text-sm tracking-[0.15em] md:text-base"
            style={accent ? { color: accent } : undefined}
          >
            {unit}
          </span>
        )}
      </div>
      {caption && (
        <p className="mt-4 max-w-[22ch] font-mono text-[10px] tracking-[0.3em] uppercase opacity-70 md:text-[11px]">
          {caption}
        </p>
      )}
    </div>
  );
}
