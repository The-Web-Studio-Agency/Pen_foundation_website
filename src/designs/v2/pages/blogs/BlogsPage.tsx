import { ARTICLES } from '@/content/data/research';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { cx } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { toCard } from './article';
import { BlogIndex } from './BlogIndex';
import { blogsPageCopy } from '../pageCopy';

/**
 * /blogs — the engineering journal's index.
 *
 *   dark   hero
 *   white  every article, filterable by subject
 */
export function BlogsPage() {
  const subjects = new Set(ARTICLES.map((a) => a.category)).size;

  return (
    <>
      <PageHero
        kicker={blogsPageCopy.hero.kicker}
        title={blogsPageCopy.hero.title}
        lead={blogsPageCopy.hero.lead}
        facts={[
          { label: 'Articles', value: String(ARTICLES.length) },
          { label: 'Subjects', value: String(subjects) },
        ]}
        image={blogsPageCopy.hero.image}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="blogs-index-title">
        <div className={t.gutter}>
          <SectionHead
            id="blogs-index-title"
            chip={blogsPageCopy.index.chip}
            heading={blogsPageCopy.index.heading}
          />
          <BlogIndex articles={ARTICLES.map(toCard)} />
        </div>
      </section>
    </>
  );
}
