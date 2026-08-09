import type { ValueProofPoint } from '@/types/values';

/**
 * One figure in a card's proof list.
 *
 * Renders the `<dt>`/`<dd>` pair the reference uses, which is the correct
 * semantic anyway: the figure is the term and the caption defines it. The
 * wrapping `<div>` is what a `<dl>` permits between the list and its pairs, and
 * is what lets each pair be a flex column of its own.
 *
 * The figure is painted by clipping a teal ramp to the glyphs — the reference
 * does the same with its lime, and a flat fill loses the light the section is
 * built around.
 */
export function ValueItem({ value, label }: ValueProofPoint) {
  return (
    // Shares the row below `lg` — two figures side by side — then stops growing
    // once the list becomes a column beside the glyph.
    <div className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-none">
      <dt className="bg-[linear-gradient(90deg,var(--color-teal)_0%,var(--color-teal-bright)_100%)] bg-clip-text text-[1.75rem] leading-none font-medium text-transparent lg:text-[2.25rem]">
        {value}
      </dt>
      <dd className="text-[0.75rem] leading-[1.3] tracking-[-0.0075rem] text-[var(--c-dark-green)] opacity-70 lg:text-[1rem] lg:tracking-[-0.01rem]">
        {label}
      </dd>
    </div>
  );
}
