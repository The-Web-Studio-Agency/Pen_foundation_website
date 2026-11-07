import Image from 'next/image';

import { anchors, validationV2 } from '../content';
import s from '../styles/validation.module.css';
import t from '../styles/theme.module.css';
import { Chip, cx, stagger } from './primitives';

/**
 * The three validating institutions as large white cards, then every
 * supporter on a slow marquee. The marquee list is rendered twice so the loop
 * is seamless; the copy is `aria-hidden` so screen readers hear each name once.
 */
export function Validation() {
  const reel = validationV2.supporters;

  return (
    <section id={anchors.validation} className={s.section} aria-labelledby="hv2-validation-title">
      <div className={t.gutter}>
        <div data-reveal>
          <Chip>{validationV2.chip}</Chip>
        </div>
        <h2 id="hv2-validation-title" className={cx(t.h2, s.title)} data-reveal style={stagger(1)}>
          {validationV2.heading}
        </h2>

        <ul className={s.logos}>
          {validationV2.logos.map((logo, i) => (
            <li key={logo.src} className={s.logoCard} data-reveal style={stagger(i)}>
              <Image src={logo.src} alt={logo.alt} width={320} height={160} className={s.logoImg} />
            </li>
          ))}
        </ul>
      </div>

      <div className={s.marqueeBlock}>
        <p className={cx(t.mono, t.gutter, s.marqueeLabel)}>{validationV2.supportersLabel}</p>
        <div className={s.marquee}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={s.reel} aria-hidden={copy === 1 || undefined}>
              {reel.map((logo) => (
                <li key={logo.src} className={cx(s.reelItem, logo.onDark && s.reelItemDark)}>
                  <Image
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ''}
                    width={200}
                    height={100}
                    className={s.reelImg}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
