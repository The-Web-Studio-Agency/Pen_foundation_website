import type {
  AudienceBlock,
  AudienceClosing,
  ContrastRow,
} from '@/content/data/application-audiences';

import { FaqSection } from '../../components/FaqSection';
import { SectionHead } from '../../components/page/SectionHead';
import { ButtonLink, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { ASSESSMENT } from '../projects/content';
import s from './audience.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

function Closing({ closing, dark }: { closing: AudienceClosing; dark: boolean }) {
  return (
    <div className={cx(s.closing, dark && s.closingDark)} data-reveal>
      <div className={s.closingText}>
        <p className={s.closingHeading}>{closing.heading}</p>
        {closing.lead && <p className={s.closingLead}>{closing.lead}</p>}
      </div>
      <ButtonLink href={ASSESSMENT.href} tone="solid">
        {closing.label}
      </ButtonLink>
    </div>
  );
}

function Bar({ row }: { row: ContrastRow }) {
  const width = `${Math.max(row.scale ?? 1, 0) * 100}%`;
  return (
    <div className={cx(s.row, row.tone === 'pen' ? s.rowPen : s.rowConventional)} data-reveal>
      <div className={s.rowHead}>
        <span className={cx(t.mono, s.rowLabel)}>{row.label}</span>
        <span className={s.rowTitle}>{row.title}</span>
      </div>
      <div className={s.track}>
        {row.stages ? (
          <ol className={s.bar} style={{ width }}>
            {row.stages.map((stage) => (
              <li
                key={stage.label}
                className={cx(s.stage, (stage.weight ?? 0) >= 10 && s.stageLong)}
                style={{ flexGrow: stage.weight ?? 1 }}
              >
                <span>{stage.label}</span>
              </li>
            ))}
          </ol>
        ) : (row.scale ?? 1) >= 1 ? (
          <p className={s.solidFull}>{row.text}</p>
        ) : (
          <div className={s.solid}>
            <span className={s.solidBar} style={{ width }} aria-hidden />
            {row.text && <span className={s.solidText}>{row.text}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ block, index }: { block: AudienceBlock; index: number }) {
  const id = `app-audience-${index}`;
  const dark = block.ground === 'dark';

  if (block.kind === 'contrast') {
    return (
      <section className={cx(p.section, p[block.ground])} aria-labelledby={id}>
        <div className={t.gutter}>
          <SectionHead chip={block.chip} heading={block.heading} lead={block.lead} split id={id} />
          {block.points && (
            <p className={s.points} data-reveal>
              {block.points}
            </p>
          )}

          <div className={s.contrast}>
            {block.rowsHeading && (
              <h3 className={cx(t.h3, s.rowsHeading)} data-reveal>
                {block.rowsHeading}
              </h3>
            )}
            {block.rows.map((row) => (
              <Bar key={row.label} row={row} />
            ))}
            {block.note && (
              <p className={cx(t.mono, s.note)} data-reveal>
                {block.note}
              </p>
            )}
          </div>

          {block.cards && (
            <ul className={cx(s.cards, block.ground === 'paper' && s.cardsOnPaper)}>
              {block.cards.map((card, i) => (
                <li key={card.title} className={s.card} data-reveal style={stagger(i)}>
                  <h4 className={s.cardTitle}>{card.title}</h4>
                  {card.body && <p className={s.cardBody}>{card.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  if (block.kind === 'cards') {
    return (
      <section className={cx(p.section, p[block.ground])} aria-labelledby={id}>
        <div className={t.gutter}>
          <SectionHead chip={block.chip} heading={block.heading} lead={block.lead} split id={id} />

          {block.tags && (
            <div className={s.tagsWrap} data-reveal>
              {block.tagsLabel && <p className={cx(t.mono, s.tagsLabel)}>{block.tagsLabel}</p>}
              <ul className={cx(s.tags, dark && s.tagsDark)}>
                {block.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          )}

          <ol
            className={cx(
              s.cards,
              dark && s.cardsDark,
              block.ground === 'paper' && s.cardsOnPaper,
              block.cards.length === 5 && s.cardsFive,
            )}
          >
            {block.cards.map((card, i) => (
              <li key={card.title} className={s.card} data-reveal style={stagger(i)}>
                {block.numbered && <span className={s.cardNum}>{pad(i + 1)}</span>}
                <h3 className={s.cardTitle}>{card.title}</h3>
                {card.body && <p className={s.cardBody}>{card.body}</p>}
              </li>
            ))}
          </ol>

          {block.caption && (
            <p className={s.caption} data-reveal>
              {block.caption}
            </p>
          )}
          {block.closing && <Closing closing={block.closing} dark={dark} />}
        </div>
      </section>
    );
  }

  // The FAQ uses the site's FAQ section, as on the homepage; the closing
  // call sits under its heading as the homepage's intro and button do.
  return (
    <FaqSection
      titleId={id}
      chip={block.chip}
      heading={block.heading}
      body={
        block.closing
          ? [block.closing.heading, block.closing.lead].filter(Boolean).join(' ')
          : undefined
      }
      cta={block.closing ? { label: block.closing.label, href: ASSESSMENT.href } : undefined}
      tabs={[
        {
          id: 'faq',
          label: block.chip,
          entries: block.items.map((item) => ({ question: item.q, answer: item.a })),
        },
      ]}
    />
  );
}

/**
 * The audience sections an application page adds from the client's V3
 * handoff (content/data/application-audiences.ts). `offset` keeps section
 * ids unique when the page renders two runs of them.
 */
export function AudienceSections({
  blocks,
  offset = 0,
}: {
  blocks: AudienceBlock[];
  offset?: number;
}) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} index={offset + i} />
      ))}
    </>
  );
}
