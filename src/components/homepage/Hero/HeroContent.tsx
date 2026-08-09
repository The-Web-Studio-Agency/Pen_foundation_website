'use client';

import styles from './hero.module.css';
import { HeroHeadline } from './HeroHeadline';
import type { HeroProgressSource } from './useHeroProgress';
import type { HeroSequenceItem } from '@/types/homepage';

interface HeroContentProps {
  sequence: HeroSequenceItem[];
  progress: HeroProgressSource;
  /** Reduced motion: render the opening heading only, already revealed. */
  frozen?: boolean;
}

/**
 * The text layer over the pinned stage.
 *
 * Every heading is mounted at once and stacked in the same absolute slot — the
 * scrub decides which one is legible. That is what lets a two-line and a
 * four-line heading share a bottom edge without any measuring: they are all
 * laid out against the same flex-end/centre static position.
 *
 * The layer is inert (`pointer-events: none`), so the cursor indicator and the
 * fixed SiteHeader above the hero keep receiving events.
 */
export function HeroContent({ sequence, progress, frozen = false }: HeroContentProps) {
  const visible = frozen ? sequence.slice(0, 1) : sequence;

  return (
    <div className={styles.content}>
      <div className={styles.stageContent}>
        {visible.map((item, index) => (
          <HeroHeadline
            key={index}
            lines={item.lines}
            index={index}
            count={sequence.length}
            progress={progress}
            as={index === 0 ? 'h1' : 'p'}
            frozen={frozen}
          />
        ))}
      </div>
    </div>
  );
}
