import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { ContentIndex } from '@/designs/v2/admin/ContentIndex';
import { ENTRIES, PAGES } from '@/designs/v2/admin/registry';
import { requireAdmin } from '@/lib/cms/auth';
import { readContent } from '@/lib/cms/server';

export const metadata: Metadata = { title: 'Page content' };

export default async function Page() {
  await requireAdmin();
  const entries = ENTRIES.filter((e) => !e.collection).map((e) => ({
    id: e.id,
    title: e.title,
    page: e.page,
    hint: e.hint ?? '',
    edited: readContent(e.id) !== undefined,
  }));
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Page content</h1>
          <p className={s.sub}>
            Every section of every page: headings, paragraphs, button text, images and lists. Pick a
            section to edit it; changes show on the website as soon as you save.
          </p>
        </div>
      </div>
      <ContentIndex pages={[...PAGES]} entries={entries} />
    </>
  );
}
