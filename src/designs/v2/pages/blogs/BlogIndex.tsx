'use client';

import { useState } from 'react';

import { cx, stagger } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import type { ArticleCardData } from './article';
import { ArticleCard } from './ArticleCard';
import s from './blogs.module.css';
import { FilterPills } from './FilterPills';

const ALL = 'All';

/**
 * Subject filter over every article. All cards are rendered once and hidden
 * rather than unmounted, so the site's single reveal observer (which scans on
 * route change only) still owns every one of them. The first visible card
 * takes the wide "feature" slot.
 */
export function BlogIndex({ articles }: { articles: ArticleCardData[] }) {
  const subjects = [ALL, ...Array.from(new Set(articles.map((a) => a.category)))];
  const [subject, setSubject] = useState(ALL);

  const counts = Object.fromEntries(
    subjects.map((c) => [
      c,
      c === ALL ? articles.length : articles.filter((a) => a.category === c).length,
    ]),
  );
  const visible = articles.filter((a) => subject === ALL || a.category === subject);

  return (
    <div>
      <div className={s.toolbar} data-reveal>
        <FilterPills
          label="Filter articles by subject"
          options={subjects}
          value={subject}
          onChange={setSubject}
          counts={counts}
        />
        <p className={cx(t.mono, s.toolbarCount)} aria-live="polite">
          {visible.length} {visible.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      <ul className={s.grid}>
        {articles.map((article, i) => {
          const position = visible.indexOf(article);
          return (
            <li
              key={article.slug}
              hidden={position === -1}
              className={cx(s.gridItem, position === 0 && visible.length > 1 && s.gridFeature)}
              data-reveal
              style={stagger(i % 3)}
            >
              <ArticleCard article={article} feature={position === 0 && visible.length > 1} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
