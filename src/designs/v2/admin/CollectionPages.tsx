import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAdmin } from '@/lib/cms/auth';
import { readContent } from '@/lib/cms/server';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { CollectionItemEditor, CollectionList, type CollectionMeta } from './Collection';
import type { Json } from './JsonEditor';
import { defaultsFor, getEntry } from './registry';

type Item = { [key: string]: Json };

function metaFor(id: string, base: string): CollectionMeta {
  const entry = getEntry(id);
  if (!entry?.collection) throw new Error(`Not a collection: ${id}`);
  return { id, base, ...entry.collection };
}

const listFor = (id: string) => (readContent(id) ?? defaultsFor(id)) as Item[];

/** Server: the list screen for blog articles or projects. */
export async function CollectionIndexPage({
  id,
  base,
  title,
  intro,
}: {
  id: string;
  base: string;
  title: string;
  intro: string;
}) {
  await requireAdmin();
  const meta = metaFor(id, base);
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>{title}</h1>
          <p className={s.sub}>{intro}</p>
        </div>
        <div className={s.headActions}>
          <Link href={`${base}/new`} className={cx(s.btn, s.primary)}>
            + New {meta.singular}
          </Link>
        </div>
      </div>
      <CollectionList meta={meta} items={listFor(id)} />
    </>
  );
}

/** Server: edit one item, or `new` for a blank one. */
export async function CollectionItemPage({
  id,
  base,
  title,
  slug,
}: {
  id: string;
  base: string;
  title: string;
  slug: string;
}) {
  await requireAdmin();
  const meta = metaFor(id, base);
  const list = listFor(id);
  const isNew = slug === 'new';
  const item = isNew ? null : (list.find((i) => i[meta.key] === decodeURIComponent(slug)) ?? null);
  if (!isNew && !item) notFound();
  // New items take the shape of the first existing one.
  const template = (list[0] ?? (defaultsFor(id) as Item[])[0]) as Item;

  return (
    <>
      <div className={s.head}>
        <div>
          <p className={s.crumb}>
            <Link href={base}>{title}</Link> / {isNew ? `New ${meta.singular}` : 'Edit'}
          </p>
          <h1 className={s.title}>
            {isNew ? `New ${meta.singular}` : String(item?.[meta.titleKey] ?? '')}
          </h1>
        </div>
      </div>
      <CollectionItemEditor
        key={slug}
        meta={meta}
        slug={isNew ? null : decodeURIComponent(slug)}
        initial={item}
        template={template}
      />
    </>
  );
}
