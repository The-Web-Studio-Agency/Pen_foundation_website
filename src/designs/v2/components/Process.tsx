import { anchors, processV2 } from '../content';
import s from '../styles/process.module.css';
import t from '../styles/theme.module.css';
import { cx, stagger } from './primitives';

/** Centred heading over a 2×2 grid of rounded step cards with lime numerals. */
export function Process() {
  return (
    <section id={anchors.process} className={s.section} aria-labelledby="hv2-process-title">
      <div className={t.gutter}>
        <header className={s.head}>
          <h2 id="hv2-process-title" className={cx(t.h2, s.title)} data-reveal>
            {processV2.heading}
          </h2>
          <p className={cx(t.lead, s.lead)} data-reveal style={stagger(1)}>
            {processV2.lead}
          </p>
        </header>

        <ol className={s.grid}>
          {processV2.steps.map((step, i) => (
            <li key={step.number} className={s.card} data-reveal style={stagger(i)}>
              <span className={s.num}>{step.number}</span>
              <div className={s.text}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
