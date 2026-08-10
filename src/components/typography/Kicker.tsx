import { cn } from '@/lib/utils';

interface KickerProps {
  /** Section number, e.g. "01" — or "—" when unnumbered. */
  n: string;
  label: string;
  className?: string;
  /**
   * Render as a heading where this label IS the page's title rather than a
   * caption above one.
   *
   * /gallery is the case it exists for: an immersive viewer whose only piece of
   * naming copy is the kicker "— THE ARCHIVE", so the route had no `h1` and in
   * fact no heading at all above the footer. Giving it a real level costs
   * nothing visually — the styling is on this element either way — and is more
   * honest than hiding a second, invisible title behind it.
   */
  as?: 'div' | 'h1' | 'h2';
}

/** Numbered editorial label: "01 —— THE OLD WAY". */
export function Kicker({ n, label, className, as: Tag = 'div' }: KickerProps) {
  return (
    <Tag
      className={cn(
        'flex items-center gap-4 font-mono text-[10px] tracking-[0.4em] text-neutral-500 uppercase md:text-[11px]',
        className,
      )}
    >
      <span>{n}</span>
      <span className="h-px w-8 bg-current opacity-50" />
      <span className="opacity-80">{label}</span>
    </Tag>
  );
}
