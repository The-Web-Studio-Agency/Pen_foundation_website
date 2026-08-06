import { NotchedBand } from '@/components/shared/shapes/NotchedBand';
import { DIVIDER_NOTCH } from '@/lib/utils';

/**
 * The coloured lip that joins one section to the next.
 *
 * The reference wraps it in a zero-height element and pulls the 48px band up
 * over the outgoing section (`position:absolute; top:1px;
 * transform:translateY(-100%)`), so the lip belongs to the *incoming* section
 * and paints its background colour. This reproduces that exactly.
 */
export type NotchTone = 'white' | 'accent' | 'dark-green';

const TONE_CLASS: Record<NotchTone, string> = {
  white: 'bg-[var(--c-white)]',
  accent: 'bg-[var(--c-accent)]',
  'dark-green': 'bg-[var(--c-dark-green)]',
};

export function NotchSeparator({ tone = 'white' }: { tone?: NotchTone }) {
  return (
    <div aria-hidden className="relative top-0 h-0 w-full">
      <div className="pointer-events-none absolute top-px w-full -translate-y-full">
        <NotchedBand
          height={48}
          dip={DIVIDER_NOTCH.dip}
          shoulder={DIVIDER_NOTCH.shoulder}
          run={DIVIDER_NOTCH.run}
          radius={DIVIDER_NOTCH.radius}
          edges={{ top: true }}
        >
          <div className={`h-12 w-full ${TONE_CLASS[tone]}`} />
        </NotchedBand>
      </div>
    </div>
  );
}
