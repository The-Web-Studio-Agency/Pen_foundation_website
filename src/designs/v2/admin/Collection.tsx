'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { saveContent, useToast, useUnsavedGuard } from './ContentEditor';
import { blank, JsonEditor, type Json } from './JsonEditor';

type Item = { [key: string]: Json };

export interface CollectionMeta {
  id: string;
  key: string;
  titleKey: string;
  hrefPrefix: string;
  singular: string;
  /** Admin route for this collection, e.g. /web-admin/blogs. */
  base: string;
}

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

/** Drop `{ src: '' }` images left empty on a new item, so no page shows a broken image. */
function prune(value: Json): Json {
  if (Array.isArray(value)) return value.map(prune);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => !(v && typeof v === 'object' && !Array.isArray(v) && v.src === ''))
        .map(([k, v]) => [k, prune(v)]),
    );
  }
  return value;
}

async function fetchList(id: string): Promise<Item[]> {
  const res = await fetch(`/api/cms/content/${encodeURIComponent(id)}`);
  const body = (await res.json()) as { value: Item[] };
  return body.value;
}

/** Blog articles or projects: a list with add, edit, open and delete. */
export function CollectionList({ meta, items }: { meta: CollectionMeta; items: Item[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { show, node } = useToast();

  const shown = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.trim().toLowerCase()),
  );

  const remove = async (slug: string, title: string) => {
    if (!window.confirm(`Delete “${title}”? Its page will stop existing.`)) return;
    try {
      const list = await fetchList(meta.id);
      await saveContent(
        meta.id,
        list.filter((item) => item[meta.key] !== slug),
      );
      show({ text: 'Deleted.' });
      router.refresh();
    } catch (e) {
      show({ text: (e as Error).message, error: true });
    }
  };

  return (
    <>
      <div className={s.searchRow}>
        <input
          className={s.input}
          placeholder={`Search ${meta.singular}s…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={s.panel}>
        {shown.length === 0 ? (
          <p className={s.empty}>Nothing here yet.</p>
        ) : (
          <ul className={s.list}>
            {shown.map((item) => {
              const slug = String(item[meta.key] ?? '');
              const title = String(item[meta.titleKey] ?? slug) || 'Untitled';
              return (
                <li key={slug}>
                  <div className={s.grow}>
                    <Link
                      href={`${meta.base}/${encodeURIComponent(slug)}`}
                      className={s.cardTitle}
                      style={{ color: 'inherit' }}
                    >
                      {title}
                    </Link>
                    <div className={cx(s.muted, s.mono)} style={{ fontSize: '0.75rem' }}>
                      {meta.hrefPrefix}
                      {slug}
                    </div>
                  </div>
                  <Link
                    href={`${meta.base}/${encodeURIComponent(slug)}`}
                    className={cx(s.btn, s.secondary, s.small)}
                  >
                    Edit
                  </Link>
                  <a
                    href={`${meta.hrefPrefix}${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(s.btn, s.secondary, s.small)}
                  >
                    View ↗
                  </a>
                  <button
                    type="button"
                    className={cx(s.btn, s.danger, s.small)}
                    onClick={() => remove(slug, title)}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {node}
    </>
  );
}

/** One article or project. `slug` is null for a new one, built from `template`. */
export function CollectionItemEditor({
  meta,
  slug,
  initial,
  template,
}: {
  meta: CollectionMeta;
  slug: string | null;
  initial: Item | null;
  template: Item;
}) {
  const router = useRouter();
  const start = useMemo(() => initial ?? (blank(template) as Item), [initial, template]);
  const [value, setValue] = useState<Json>(start);
  const [saved, setSaved] = useState(JSON.stringify(start));
  const [busy, setBusy] = useState(false);
  const { show, node } = useToast();
  const dirty = JSON.stringify(value) !== saved;
  useUnsavedGuard(dirty && slug !== null);

  const item = value as Item;

  const save = async () => {
    const title = String(item[meta.titleKey] ?? '').trim();
    let nextSlug = String(item[meta.key] ?? '').trim();
    if (!title)
      return show({ text: `Give the ${meta.singular} a ${meta.titleKey} first.`, error: true });
    if (!nextSlug) nextSlug = slugify(title);
    nextSlug = slugify(nextSlug);
    if (!nextSlug) return show({ text: 'The page address needs letters or numbers.', error: true });

    setBusy(true);
    try {
      const list = await fetchList(meta.id);
      const clash = list.some((other) => other[meta.key] === nextSlug && other[meta.key] !== slug);
      if (clash) throw new Error(`Another ${meta.singular} already uses “${nextSlug}”.`);
      const next = prune({ ...item, [meta.key]: nextSlug }) as Item;
      const updated =
        slug === null
          ? [next, ...list]
          : list.map((other) => (other[meta.key] === slug ? next : other));
      await saveContent(meta.id, updated);
      setSaved(JSON.stringify(next));
      setValue(next);
      show({ text: slug === null ? 'Published.' : 'Saved.' });
      if (nextSlug !== slug) router.replace(`${meta.base}/${encodeURIComponent(nextSlug)}`);
      router.refresh();
    } catch (e) {
      show({ text: (e as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  const currentSlug = String(item[meta.key] ?? '');

  return (
    <>
      <div className={s.editorBar}>
        <button
          type="button"
          className={cx(s.btn, s.primary)}
          onClick={save}
          disabled={busy || (!dirty && slug !== null)}
        >
          {busy ? 'Saving…' : slug === null ? `Publish ${meta.singular}` : 'Save changes'}
        </button>
        {dirty && <span className={s.dirty}>Unsaved changes</span>}
        <span className={s.grow} />
        {slug !== null && (
          <a
            href={`${meta.hrefPrefix}${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(s.btn, s.secondary)}
          >
            View on site ↗
          </a>
        )}
      </div>
      <p className={s.hint}>
        The <b>{meta.key}</b> field is the page address: {meta.hrefPrefix}
        <b>{currentSlug || '(made from the ' + meta.titleKey + ')'}</b>. Leave it empty on a new{' '}
        {meta.singular} and it is made from the {meta.titleKey}.
      </p>
      <JsonEditor value={value} onChange={setValue} />
      {node}
    </>
  );
}
