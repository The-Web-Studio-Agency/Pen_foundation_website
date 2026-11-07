import Link from 'next/link';

import { ArrowRight, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import { blogHref, type ArticleCardData } from './article';
import s from './blogs.module.css';

/**
 * The article's cover. No article has artwork yet — each record names the
 * picture it will get ("LOAD PATH · HERO DIAGRAM") — so the cover is a
 * labelled forest tile in the hero's language, with that caption on it.
 */
export function ArticleCover({
  label,
  category,
  className,
}: {
  label: string;
  category: string;
  className?: string;
}) {
  return (
    <div className={cx(s.cover, className)}>
      <span className={s.coverFloor} aria-hidden />
      <span className={s.coverTint} aria-hidden />
      <span className={cx(t.mono, s.coverCategory)}>{category}</span>
      <span className={cx(t.mono, s.coverLabel)}>{label}</span>
    </div>
  );
}

/**
 * One article as a card: cover tile, mono meta, title and dek. The whole card
 * is the link; on hover the cover washes lime, as the homepage's cards do.
 * No hooks, so it renders on the server and inside the client filter alike.
 */
export function ArticleCard({
  article,
  feature,
  headingLevel = 'h3',
}: {
  article: ArticleCardData;
  /** Wide layout: cover beside the copy on large screens. */
  feature?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  return (
    <Link href={blogHref(article.slug)} className={cx(s.card, feature && s.cardFeature)}>
      <ArticleCover label={article.cover} category={article.category} className={s.cardCover} />
      <div className={s.cardText}>
        <p className={cx(t.mono, s.cardMeta)}>
          <span>{article.category}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime} read</span>
        </p>
        <Heading className={s.cardTitle}>{article.title}</Heading>
        <p className={s.cardDek}>{article.dek}</p>
        <span className={cx(t.mono, s.cardMore)} aria-hidden>
          Read article
          <span className={s.cardArrow}>
            <ArrowRight size={14} />
          </span>
        </span>
      </div>
    </Link>
  );
}
