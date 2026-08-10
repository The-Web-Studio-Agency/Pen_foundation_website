'use client';

import { motion } from 'framer-motion';

import { EASE_OUT_EXPO } from '@/lib/motion';
import { Logo } from '@/components/shared/icons/Logo';
import styles from './preloader.module.css';

/**
 * The PEN mark at the centre of the field, cleared out of a mask.
 *
 * IT IS SMALL AND IT HAS NOTHING AROUND IT. No card, no ring, no plate, no
 * shadow — the drawing behind it is already doing the work of placing it, and
 * anything drawn around it would turn a mark set out on a construction into a
 * logo in a box. The only thing that touches it is the line that cuts the mask.
 *
 * THE REVEAL IS A MASK, NOT A FADE. The mark does not arrive; it is uncovered,
 * bottom to top, by a clip that a hairline travels with. That hairline is the
 * whole idea: the same instrument that drew the field is what draws the mark
 * out of the ground, and it overruns the mark on both sides the way a
 * measuring line overruns what it measures. Mask and line are welded together
 * in the stylesheet — same box, same duration, same delay, same curve — so no
 * amount of retuning can separate them.
 *
 * WHY NEITHER THE REVEAL NOR THE WIPE IS IN HERE. Both are CSS, in
 * preloader.module.css. The reveal has to be, because this panel is painted
 * before the bundle arrives (see timeline.ts) — and once the stylesheet owns
 * `clip-path` through a filling animation, no inline style Framer writes can
 * take it back, so the wipe has to be a second animation rather than a second
 * opinion. Framer is left with `opacity` and `scale`, which nothing else wants.
 *
 * `priority` on the logo: it is the single asset the entry cannot do without,
 * and the preload link it emits is what gets it into the same paint as the
 * panel rather than into the middle of its own reveal.
 */

/**
 * The stage fading out behind the wipe.
 *
 * Slightly longer than `MARK_CLEAR_MS`, so the fade is still finishing as the
 * wipe lands rather than racing it — two edges arriving on the same frame reads
 * as a cut. `scale` is the small settle that stops a fade looking like a
 * dropped frame; it is well under a percent of movement.
 */
const MARK_CLEAR_S = 0.52;

export function PreloaderMark({ clearing }: { clearing: boolean }) {
  return (
    <div className={styles.markWrap} aria-hidden>
      <motion.div
        className={styles.markStage}
        /* The panel is server-rendered and already on screen; an entrance
           animation here would be a fade over the thing it is covering. */
        initial={false}
        /* Resting state is opacity alone: a `scale: 1` here would be
           server-rendered as a `transform`, which Framer under `reducedMotion`
           refuses to write on the client, and the two trees would disagree.
           The settle is only wanted on the way out, so it only appears there. */
        animate={clearing ? { opacity: 0, scale: 0.97 } : { opacity: 1 }}
        transition={{ duration: MARK_CLEAR_S, ease: EASE_OUT_EXPO }}
      >
        <span className={styles.markClip} data-clearing={clearing ? 'true' : undefined}>
          <Logo className={styles.markImage} priority />
        </span>
        <span className={styles.scan} />
      </motion.div>
    </div>
  );
}
