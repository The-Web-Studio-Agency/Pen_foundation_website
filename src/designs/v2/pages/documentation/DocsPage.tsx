import { certificate, documents } from '@/features/resources';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowDown, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import s from './docs.module.css';
import { RelatedLinks } from './RelatedLinks';
import { docsPageCopy } from '../pageCopy';

function FileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 2.75h8.5L19.25 7.5v13.75H6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.25 2.75V7.75h5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12.5h7M9 16h5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * /docs — technical documentation and downloads.
 *
 *   dark   hero
 *   paper  the document library: live files download, files not yet
 *          published show as "Coming soon" (no dead links)
 *   white  related resources
 */
export function DocsPage() {
  const published = documents.items.filter((d) => !d.pending && d.file);
  const pending = documents.items.length - published.length;

  return (
    <>
      <PageHero
        kicker={docsPageCopy.hero.kicker}
        title={documents.heading}
        lead={docsPageCopy.hero.lead}
        actions={[{ label: docsPageCopy.hero.action, href: '#library' }]}
        facts={[
          { label: docsPageCopy.hero.availableLabel, value: String(published.length) },
          { label: docsPageCopy.hero.pendingLabel, value: String(pending) },
        ]}
        image={docsPageCopy.hero.image}
      />

      <section
        id="library"
        className={cx(p.section, p.paper, s.library)}
        aria-labelledby="docs-library-title"
      >
        <div className={t.gutter}>
          <SectionHead
            id="docs-library-title"
            chip={docsPageCopy.library.chip}
            heading={docsPageCopy.library.heading}
            lead={docsPageCopy.library.lead}
            split
          />

          <ul className={s.grid}>
            {documents.items.map((doc, i) => {
              const live = !doc.pending && Boolean(doc.file);
              const inner = (
                <>
                  <div className={s.cardTop}>
                    <span className={cx(s.icon, !live && s.iconMuted)}>
                      <FileIcon />
                    </span>
                    <span className={cx(t.mono, s.status, live ? s.statusLive : s.statusSoon)}>
                      {live ? docsPageCopy.library.available : docsPageCopy.library.soon}
                    </span>
                  </div>
                  <div className={s.cardText}>
                    <h3 className={s.title}>{doc.title}</h3>
                    <p className={cx(t.mono, s.meta)}>{doc.meta}</p>
                  </div>
                  {live && (
                    <span className={cx(t.mono, s.action)} aria-hidden>
                      {docsPageCopy.library.download}
                      <span className={s.actionIcon}>
                        <ArrowDown size={14} />
                      </span>
                    </span>
                  )}
                </>
              );

              return (
                <li key={doc.title} data-reveal style={stagger(i % 4)}>
                  {live ? (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx(s.card, s.cardLive)}
                    >
                      {inner}
                      <span className={t.srOnly}> (PDF, opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className={cx(s.card, s.cardSoon)}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <RelatedLinks
        id="docs-related-title"
        items={[
          { label: 'Certifications', href: '/certifications', body: certificate.heading },
          { label: 'Blogs', href: '/blogs', body: docsPageCopy.related.blogsBody },
        ]}
      />
    </>
  );
}
