import { highlightsV2 } from '../content';
import s from '../styles/opening.module.css';
import t from '../styles/theme.module.css';
import { LoopVideo } from './LoopVideo';
import { cx, stagger } from './primitives';

/**
 * The install film behind a frosted data card and a numbered accordion.
 *
 * The card shows the Enhancement Factor as a range on a 1×–3× scale — the only
 * "chart" here is the published figure itself, so nothing is plotted that was
 * not measured. The list is native <details>, so it works without script and
 * each row is reachable by keyboard.
 */
export function Highlights() {
  const { card } = highlightsV2;
  // 2.0–2.6 on a 1–3 scale → 50%..80% of the track.
  const from = ((2.0 - 1) / 2) * 100;
  const to = ((2.6 - 1) / 2) * 100;

  return (
    <section className={s.highlights} aria-labelledby="hv2-highlights-title">
      <LoopVideo
        src={highlightsV2.film.src}
        poster={highlightsV2.film.poster}
        className={s.mediaFilm}
      />
      <div className={s.highlightsShade} aria-hidden />

      <div className={cx(s.highlightsInner, t.gutter)}>
        <h2 id="hv2-highlights-title" className={cx(t.h3, s.highlightsTitle)} data-reveal>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {highlightsV2.heading}
        </h2>

        <div className={s.glassCard} data-reveal style={stagger(1)}>
          <p className={s.glassTitle}>{card.title}</p>
          <p className={cx(t.mono, s.glassCaption)}>{card.caption}</p>
          <p className={s.glassValue}>
            {card.value}
            <span className={s.glassUnit}>{card.unit}</span>
          </p>
          <div className={s.range} aria-hidden>
            <div className={s.rangeTrack}>
              <span className={s.rangeFill} style={{ left: `${from}%`, width: `${to - from}%` }} />
            </div>
            <div className={cx(t.mono, s.rangeScale)}>
              <span>1×</span>
              <span>2×</span>
              <span>3×</span>
            </div>
          </div>
        </div>

        <ol className={s.accordion} data-reveal style={stagger(2)}>
          {highlightsV2.items.map((item, i) => (
            <li key={item.title}>
              <details className={s.accItem}>
                <summary className={s.accSummary}>
                  <span className={cx(t.mono, s.accNum)}>{String(i + 1).padStart(2, '0')}.</span>
                  <span className={cx(t.mono, s.accTitle)}>{item.title}</span>
                  <span className={s.accPlus} aria-hidden />
                </summary>
                <p className={s.accBody}>{item.body}</p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
