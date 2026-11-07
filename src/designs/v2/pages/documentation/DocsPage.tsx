import { certificate, documents } from '@/features/resources';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowDown, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import s from './docs.module.css';
import { RelatedLinks } from './RelatedLinks';

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
        kicker="Docs"
        title={documents.heading}
        lead="Certificates, datasheets and guides for the PEN Foundation system. Each file is listed here as soon as it is published."
        actions={[{ label: 'Browse the library', href: '#library' }]}
        facts={[
          { label: 'Available now', value: String(published.length) },
          { label: 'In preparation', value: String(pending) },
        ]}
      />

      <section
        id="library"
        className={cx(p.section, p.paper, s.library)}
        aria-labelledby="docs-library-title"
      >
        <div className={t.gutter}>
          <SectionHead
            id="docs-library-title"
            chip="Library"
            heading="Every document in one place"
            lead="Available files open as PDFs. The rest are being prepared and will appear here once they are published."
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
                      {live ? 'Available' : 'Coming soon'}
                    </span>
                  </div>
                  <div className={s.cardText}>
                    <h3 className={s.title}>{doc.title}</h3>
                    <p className={cx(t.mono, s.meta)}>{doc.meta}</p>
                  </div>
                  {live && (
                    <span className={cx(t.mono, s.action)} aria-hidden>
                      Download
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
          { label: 'Blogs', href: '/blogs', body: 'Notes from the engineering journal' },
        ]}
      />
    </>
  );
}
