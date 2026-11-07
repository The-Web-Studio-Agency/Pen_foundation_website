import { ARTICLES, type Article } from '@/content/data/research';

import { PageHero, type PageHeroFact } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ButtonLink, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { isWritten, sectionId, toCard } from './article';
import { ArticleCard, ArticleCover } from './ArticleCard';
import s from './blogs.module.css';
import { ReadingProgress } from './ReadingProgress';

const BODY_ID = 'article-body';

/**
 * /blogs/[slug] — one article.
 *
 *   dark   hero: breadcrumb, subject, title, dek, key facts
 *   white  contents rail + body (pull quote after the second section,
 *          engineering notes as disclosures)
 *   paper  more from the journal
 *
 * Author, date and any note still holding a "[citation]" placeholder are left
 * out until they are written (see `isWritten`).
 */
export function ArticlePage({ article }: { article: Article }) {
  const facts: PageHeroFact[] = [
    { label: 'Subject', value: article.category },
    { label: 'Reading time', value: article.readTime },
  ];
  if (isWritten(article.author)) facts.push({ label: 'Author', value: article.author });
  if (isWritten(article.date)) facts.push({ label: 'Published', value: article.date });

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <ReadingProgress targetId={BODY_ID} />

      <PageHero
        crumbs={[{ label: 'Blogs', href: '/blogs' }, { label: article.title }]}
        kicker={article.category}
        title={article.title}
        lead={article.dek}
        facts={facts}
      />

      <section className={cx(p.section, p.light)}>
        <div className={cx(t.gutter, s.articleGrid)}>
          <nav className={s.toc} aria-label="Contents">
            <p className={cx(t.mono, s.tocLabel)}>Contents</p>
            <ol>
              {article.body.map((section, i) => (
                <li key={section.heading}>
                  <a href={`#${sectionId(section.heading)}`}>
                    <span className={s.tocNum}>{String(i + 1).padStart(2, '0')}</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article id={BODY_ID} className={s.body}>
            <ArticleCover
              label={article.cover}
              category={article.category}
              className={s.bodyCover}
            />

            {article.body.map((section, i) => (
              <section
                key={section.heading}
                id={sectionId(section.heading)}
                className={s.bodySection}
                data-reveal
              >
                <h2 className={cx(t.h3, s.bodyHeading)}>
                  <span className={cx(t.mono, s.bodyNum)}>{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                <p className={s.bodyText}>{section.text}</p>

                {isWritten(section.note) && (
                  <details className={s.note}>
                    <summary className={cx(t.mono, s.noteSummary)}>
                      Engineering note
                      <span className={s.notePlus} aria-hidden />
                    </summary>
                    <p className={s.noteText}>{section.note}</p>
                  </details>
                )}

                {i === 1 && article.pullQuote && (
                  <blockquote className={s.quote}>
                    <p>{article.pullQuote}</p>
                  </blockquote>
                )}
              </section>
            ))}

            <div className={s.bodyEnd} data-reveal>
              <ButtonLink href="/contact#contact-form" tone="onLight">
                Request the spec sheet
              </ButtonLink>
              <ButtonLink href="/blogs" tone="onLight">
                All articles
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className={cx(p.section, p.paper)} aria-labelledby="related-title">
          <div className={t.gutter}>
            <SectionHead id="related-title" chip="Keep reading" heading="More from the journal" />
            <ul className={s.relatedGrid}>
              {related.map((a, i) => (
                <li key={a.slug} data-reveal style={stagger(i)}>
                  <ArticleCard article={toCard(a)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
