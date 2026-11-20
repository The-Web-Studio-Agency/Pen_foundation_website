import Image from 'next/image';

import { anchors, validationV2 } from '../content';
import s from '../styles/validation.module.css';
import t from '../styles/theme.module.css';
import { SectionHead } from './page/SectionHead';
import { cx, stagger } from './primitives';

/**
 * Laid out as the About page's research and industry ecosystem: a split
 * head (heading left, lead right) over a grid of white logo tiles. The three
 * institutions the heading names come first; the supporters follow as their
 * own labelled group, so no supporter reads as a technical validator.
 */
export function Validation() {
  return (
    <section id={anchors.validation} className={s.section} aria-labelledby="hv2-validation-title">
      <div className={t.gutter}>
        <SectionHead
          id="hv2-validation-title"
          chip={validationV2.chip}
          heading={validationV2.heading}
          lead={validationV2.lead}
          split
          className={s.head}
        />

        <ul className={s.logos} aria-label="Validated by">
          {validationV2.logos.map((logo, i) => (
            <li key={logo.src} className={s.logo} data-reveal style={stagger(i)}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                sizes="12rem"
                className={s.logoImg}
              />
            </li>
          ))}
        </ul>

        <p className={cx(t.mono, s.groupLabel)} data-reveal>
          {validationV2.supportersLabel}
        </p>
        <ul className={s.logos} aria-label={validationV2.supportersLabel}>
          {validationV2.supporters.map((logo, i) => (
            <li
              key={logo.src}
              className={cx(s.logo, logo.onDark && s.logoDark)}
              data-reveal
              style={stagger(i % 4)}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                sizes="12rem"
                className={s.logoImg}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
