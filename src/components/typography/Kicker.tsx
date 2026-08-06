import { cn } from '@/lib/utils';

interface KickerProps {
  /** Section number, e.g. "01" — or "—" when unnumbered. */
  n: string;
  label: string;
  className?: string;
}

/** Numbered editorial label: "01 —— THE OLD WAY". */
export function Kicker({ n, label, className }: KickerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 font-mono text-[10px] tracking-[0.4em] text-neutral-500 uppercase md:text-[11px]',
        className,
      )}
    >
      <span>{n}</span>
      <span className="h-px w-8 bg-current opacity-50" />
      <span className="opacity-80">{label}</span>
    </div>
  );
}
