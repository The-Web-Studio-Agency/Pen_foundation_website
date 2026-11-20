import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import s from '@/designs/v2/admin/admin.module.css';
import { ContentEditor } from '@/designs/v2/admin/ContentEditor';
import type { Json } from '@/designs/v2/admin/JsonEditor';
import { defaultsFor, getEntry } from '@/designs/v2/admin/registry';
import { requireAdmin } from '@/lib/cms/auth';
import { readContent } from '@/lib/cms/server';

export const metadata: Metadata = { title: 'Edit section' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const entry = getEntry(decodeURIComponent(id));
  if (!entry || entry.collection) notFound();
  const saved = readContent(entry.id);
  const value = (saved ?? defaultsFor(entry.id)) as Json;

  return (
    <>
      <div className={s.head}>
        <div>
          <p className={s.crumb}>
            <Link href="/web-admin/content">Page content</Link> / {entry.page}
          </p>
          <h1 className={s.title}>{entry.title}</h1>
          {entry.hint && <p className={s.sub}>{entry.hint}</p>}
        </div>
      </div>
      <ContentEditor
        key={entry.id}
        id={entry.id}
        initial={value}
        edited={saved !== undefined}
        path={entry.path}
        hidden={entry.hidden}
        fixedLength={entry.fixedLength}
      />
    </>
  );
}
