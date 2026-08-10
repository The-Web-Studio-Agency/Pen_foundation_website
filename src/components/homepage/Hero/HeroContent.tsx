'use client';

import styles from './hero.module.css';
import { HeroHeadline } from './HeroHeadline';
import type { HeroProgressSource } from './useHeroProgress';
import type { HeroSequenceItem } from '@/types/homepage';

interface HeroContentProps {
  sequence: HeroSequenceItem[];
  progress: HeroProgressSource;
  /**
   * Reduced motion: hold the opening heading revealed and leave the rest
   * hidden. NOT "render fewer headings" — see the note in the component.
   */
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
  /*
   * The FULL sequence, whatever the motion preference.
   *
   * Reduced motion used to render `sequence.slice(0, 1)` here. That is one
   * child where the server sent six, and because `useReducedMotion()` reports
   * false on the server and true on the client's first render, React hit a
   * hydration mismatch on every reduced-motion load. `HeroHeadline` handles the
   * frozen case instead, by revealing the opening heading and holding the rest
   * at zero opacity — a decision made in an effect, after hydration, where it
   * cannot disagree with the HTML.
   *
   * The hidden headings keep their screen-reader twins, so the copy a
   * reduced-motion reader is offered is now the same copy everyone else gets
   * rather than just the first line of it.
   */
  return (
    <div className={styles.content}>
      <div className={styles.stageContent}>
        {sequence.map((item, index) => (
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
