'use client';

import { cn } from '@/lib/utils';

/**
 * The filter rail control used by /projects, /research and /gallery.
 *
 * All three had their own copy of the same button, and the copies had already
 * drifted: projects and research at `px-5 py-2.5 text-[11px]`, gallery at
 * `px-4 py-2 text-[10px]` — the same control at two sizes on three pages of
 * one site. One definition now, so the next change lands everywhere.
 *
 * `min-h-11` is the addition rather than a transcription: every copy rendered
 * a 32–36px tall target, under the 44px a finger needs, and these rails are
 * the primary way of navigating those three routes on a phone.
 *
 * `aria-pressed` rather than a `role`: this is a toggle button whose state has
 * to reach a screen reader, and the selected chip is otherwise distinguished
 * only by colour.
 */
export interface FilterChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function FilterChip({ label, selected, onSelect, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-11 items-center border px-5 font-mono text-[11px] tracking-[0.2em] uppercase',
        'transition-colors duration-200',
        selected
          ? 'border-ink bg-ink text-paper'
          : 'border-ink/20 text-ink-soft fine:hover:border-ink/50 fine:hover:text-ink',
        className,
      )}
    >
      {label}
    </button>
  );
}
