import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { SeoPagesEditor } from '@/designs/v2/admin/SeoAdmin';
import { siteConfig } from '@/config/site';
import { requireSeo } from '@/lib/cms/auth';
import { seoPages } from '@/lib/seo/settings';

import { DomainCheck } from './DomainCheck';
import { pagesWithDefaults } from '@/lib/seo/pageDefaults';

export const metadata: Metadata = { title: 'SEO · Page titles & meta' };

export default async function Page() {
  await requireSeo();
  const rows = await pagesWithDefaults();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Page titles &amp; meta</h1>
          <p className={s.sub}>
            The title and description Google shows for each page, the image shown when it is shared,
            and whether it appears in search at all. Leave a box empty to keep the page’s own text.
            New projects, articles and applications appear here by themselves.
          </p>
        </div>
      </div>
      <DomainCheck />
      <SeoPagesEditor rows={rows} initial={seoPages()} siteUrl={siteConfig.url} />
    </>
  );
}
