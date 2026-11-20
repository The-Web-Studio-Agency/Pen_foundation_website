import { askAiV2 } from '../content';
import s from '../styles/askai.module.css';
import t from '../styles/theme.module.css';
import { ChevronRight, Chip, cx, stagger } from './primitives';

/**
 * Closing call after the FAQ: open Claude or ChatGPT in a new tab (or the
 * app, where the phone hands the link to it) with a question about PEN
 * already typed in. The question is shown as it will arrive.
 */
export function AskAi() {
  return (
    <section className={s.section} aria-labelledby="hv2-ask-title">
      <div className={t.gutter}>
        <div className={s.panel} data-reveal>
          <div className={s.copy}>
            <Chip>{askAiV2.chip}</Chip>
            <h2 id="hv2-ask-title" className={cx(t.h2, s.title)}>
              {askAiV2.heading}
            </h2>
            <p className={s.lead}>{askAiV2.lead}</p>
          </div>

          <div className={s.ask}>
            <p className={s.prompt} data-reveal style={stagger(1)}>
              <span className={cx(t.mono, s.promptLabel)} aria-hidden>
                Prompt
              </span>
              <span className={s.promptText}>{askAiV2.prompt}</span>
            </p>
            <div className={s.actions} data-reveal style={stagger(2)}>
              {askAiV2.assistants.map((assistant, i) => (
                <a
                  key={assistant.href}
                  href={assistant.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(t.btn, i === 0 ? t.solid : t.onDark, s.button)}
                >
                  <span>{assistant.label}</span>
                  <span className={t.btnIcon}>
                    <ChevronRight />
                  </span>
                  <span className={s.srOnly}> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
