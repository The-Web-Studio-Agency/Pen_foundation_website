'use client';

import { useRef, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { isImageUrl, isVideoUrl, MediaPicker, MediaThumb, uploadFile } from './MediaPicker';

/**
 * A form for any content object, built from its shape:
 *
 *   text          a line, or a box for longer copy
 *   image / video a preview with "Choose from library" and "Upload"
 *   number, on/off
 *   object        a group of fields; nested groups fold
 *   list          items that fold, with add, remove and move up/down
 *
 * The shape itself is fixed by the site's code, so an edit can never leave a
 * page without a field it needs. Lists named in `fixedLength` keep their
 * length (each item is tied to something fixed, such as a film shot).
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Path = (string | number)[];

const MEDIA_KEYS = /^(src|image|poster|photo|cover|logo|thumbnail|avatar|icon|video|film)$/i;
const LONG_KEYS =
  /(body|lead|answer|intro|quote|description|text|challenge|summary|dek|note|caption|story|lessons|approach|conditions|copy|paragraph|support|result)/i;
const TITLE_KEYS = [
  'title',
  'name',
  'heading',
  'label',
  'question',
  'chip',
  'term',
  'value',
  'slug',
  'src',
  'id',
];

export function humanize(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}

/** A one-line description of a list item, for its folded header. */
function summary(value: Json): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of TITLE_KEYS) {
      const v = value[key];
      if (typeof v === 'string' && v.trim()) return v;
      if (Array.isArray(v) && typeof v[0] === 'string') return v.join(' ');
    }
    for (const v of Object.values(value)) if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

/** An empty copy of a value with the same shape, for "Add item". */
export function blank(value: Json): Json {
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  if (value === null) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return typeof value[0] === 'object' && value[0] !== null ? [blank(value[0])] : [];
  }
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]));
}

function setAt(root: Json, path: Path, next: Json): Json {
  if (path.length === 0) return next;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = root.slice();
    copy[head as number] = setAt(copy[head as number], rest, next);
    return copy;
  }
  const obj = (root ?? {}) as Record<string, Json>;
  return { ...obj, [head]: setAt(obj[head as string], rest, next) };
}

const pathKey = (path: Path) => path.filter((p) => typeof p === 'string').join('.');

interface Ctx {
  root: Json;
  onChange: (next: Json) => void;
  hidden: Set<string>;
  fixed: Set<string>;
}

export function JsonEditor({
  value,
  onChange,
  hidden = [],
  fixedLength = [],
}: {
  value: Json;
  onChange: (next: Json) => void;
  hidden?: string[];
  fixedLength?: string[];
}) {
  const ctx: Ctx = { root: value, onChange, hidden: new Set(hidden), fixed: new Set(fixedLength) };
  return <Node ctx={ctx} value={value} path={[]} depth={0} />;
}

function Node({
  ctx,
  value,
  path,
  depth,
  label,
}: {
  ctx: Ctx;
  value: Json;
  path: Path;
  depth: number;
  label?: string;
}) {
  const set = (next: Json) => ctx.onChange(setAt(ctx.root, path, next));

  if (Array.isArray(value)) {
    return <ListNode ctx={ctx} value={value} path={path} depth={depth} label={label} />;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(
      ([key]) => !(depth === 0 && ctx.hidden.has(key)) && !ctx.hidden.has([...path, key].join('.')),
    );
    const simple = entries.filter(([, v]) => v === null || typeof v !== 'object');
    const complex = entries.filter(([, v]) => v !== null && typeof v === 'object');
    const body = (
      <div className={s.node}>
        {simple.length > 0 && (
          <div className={s.fields}>
            {simple.map(([key, v]) => (
              <Leaf key={key} ctx={ctx} name={key} value={v} path={[...path, key]} />
            ))}
          </div>
        )}
        {complex.map(([key, v]) =>
          isMediaObject(v) ? (
            <div key={key} className={s.fields}>
              <MediaObject ctx={ctx} name={key} value={v} path={[...path, key]} />
            </div>
          ) : (
            <Node
              key={key}
              ctx={ctx}
              value={v}
              path={[...path, key]}
              depth={depth + 1}
              label={key}
            />
          ),
        )}
      </div>
    );
    if (depth === 0) return body;
    return (
      <details className={s.section} open={depth <= 1}>
        <summary>{humanize(label ?? '')}</summary>
        <div className={s.sectionBody}>{body}</div>
      </details>
    );
  }

  return <Leaf ctx={ctx} name={label ?? ''} value={value} path={path} onSet={set} />;
}

/** `{ src, alt, … }`: an image with its description, edited as one field. */
function isMediaObject(v: Json): v is { [key: string]: Json } {
  return (
    !!v &&
    typeof v === 'object' &&
    !Array.isArray(v) &&
    typeof v.src === 'string' &&
    Object.values(v).every((x) => x === null || typeof x !== 'object')
  );
}

function MediaObject({
  ctx,
  name,
  value,
  path,
}: {
  ctx: Ctx;
  name: string;
  value: { [key: string]: Json };
  path: Path;
}) {
  return (
    <fieldset className={cx(s.section, s.wide)} style={{ padding: '0.9rem 1rem', margin: 0 }}>
      <legend className={s.fieldLabel} style={{ padding: '0 0.3rem' }}>
        {humanize(name)}
      </legend>
      <div className={s.fields}>
        {Object.entries(value).map(([key, v]) => (
          <Leaf key={key} ctx={ctx} name={key} value={v} path={[...path, key]} />
        ))}
      </div>
    </fieldset>
  );
}

function ListNode({
  ctx,
  value,
  path,
  depth,
  label,
}: {
  ctx: Ctx;
  value: Json[];
  path: Path;
  depth: number;
  label?: string;
}) {
  const set = (next: Json[]) => ctx.onChange(setAt(ctx.root, path, next));
  const fixed = ctx.fixed.has(pathKey(path));
  const primitive = value.every((v) => v === null || typeof v !== 'object');

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const copy = value.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    set(copy);
  };
  const remove = (i: number) => {
    if (!window.confirm('Remove this item?')) return;
    set(value.filter((_, k) => k !== i));
  };
  const add = () => {
    const template = value.length ? blank(value[value.length - 1]) : '';
    set([...value, template]);
  };

  const tools = (i: number) => (
    <span className={s.itemTools} onClick={(e) => e.preventDefault()}>
      <button
        type="button"
        className={cx(s.btn, s.secondary, s.icon)}
        onClick={() => move(i, -1)}
        disabled={i === 0}
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        className={cx(s.btn, s.secondary, s.icon)}
        onClick={() => move(i, 1)}
        disabled={i === value.length - 1}
        aria-label="Move down"
      >
        ↓
      </button>
      {!fixed && (
        <button
          type="button"
          className={cx(s.btn, s.danger, s.icon)}
          onClick={() => remove(i)}
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </span>
  );

  const body = (
    <div className={s.items}>
      {value.length === 0 && <p className={s.muted}>No items yet.</p>}
      {value.map((item, i) =>
        primitive ? (
          <div key={i} className={s.primitiveRow}>
            <div className={s.grow}>
              <Leaf ctx={ctx} name={label ?? ''} value={item} path={[...path, i]} bare />
            </div>
            {tools(i)}
          </div>
        ) : (
          <details key={i} className={s.section}>
            <summary>
              <span className={cx(s.grow, s.ellipsis)}>
                <span className={s.muted}>{String(i + 1).padStart(2, '0')}</span>{' '}
                {summary(item) || 'New item'}
              </span>
              {tools(i)}
            </summary>
            <div className={s.sectionBody}>
              {isMediaObject(item) ? (
                <div className={s.fields}>
                  <MediaObject ctx={ctx} name={`Item ${i + 1}`} value={item} path={[...path, i]} />
                </div>
              ) : (
                <Node ctx={ctx} value={item} path={[...path, i]} depth={0} />
              )}
            </div>
          </details>
        ),
      )}
      {!fixed && (
        <div className={s.addRow}>
          <button type="button" className={cx(s.btn, s.secondary, s.small)} onClick={add}>
            + Add {primitive ? 'line' : 'item'}
          </button>
        </div>
      )}
    </div>
  );

  if (depth === 0 && !label) return body;
  return (
    <details className={s.section} open={depth <= 1}>
      <summary>
        {humanize(label ?? '')}
        <span className={s.badge}>{value.length}</span>
      </summary>
      <div className={s.sectionBody}>{body}</div>
    </details>
  );
}

function Leaf({
  ctx,
  name,
  value,
  path,
  onSet,
  bare,
}: {
  ctx: Ctx;
  name: string;
  value: Json;
  path: Path;
  onSet?: (v: Json) => void;
  bare?: boolean;
}) {
  const set = onSet ?? ((next: Json) => ctx.onChange(setAt(ctx.root, path, next)));
  const id = `f-${path.join('-')}`;
  const labelEl = !bare && (
    <label htmlFor={id} className={s.fieldLabel}>
      {humanize(name)}
    </label>
  );

  if (typeof value === 'boolean') {
    return (
      <label className={s.check}>
        <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
        <span className={s.fieldLabel}>{humanize(name)}</span>
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className={s.field}>
        {labelEl}
        <input
          id={id}
          type="number"
          className={s.input}
          value={Number.isFinite(value) ? value : 0}
          step="any"
          onChange={(e) => set(e.target.value === '' ? 0 : Number(e.target.value))}
        />
      </div>
    );
  }

  const text = value ?? '';
  const isMedia =
    typeof text === 'string' &&
    (isImageUrl(text) || isVideoUrl(text) || (MEDIA_KEYS.test(name) && text.startsWith('/')));
  if (isMedia || (MEDIA_KEYS.test(name) && text === '')) {
    return <MediaField id={id} label={labelEl} value={String(text)} onChange={set} />;
  }

  const long = LONG_KEYS.test(name) || String(text).length > 70 || String(text).includes('\n');
  return (
    <div className={cx(s.field, long && s.wide)}>
      {labelEl}
      {long ? (
        <textarea
          id={id}
          className={s.textarea}
          value={String(text)}
          rows={Math.min(10, Math.max(3, Math.ceil(String(text).length / 90)))}
          onChange={(e) => set(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className={s.input}
          value={String(text)}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </div>
  );
}

function MediaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const video = isVideoUrl(value);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cx(s.field, s.wide)}>
      {label}
      <div className={s.imageField}>
        <div className={s.thumb}>
          <MediaThumb url={value} />
        </div>
        <div>
          <input
            id={id}
            className={cx(s.input, s.mono)}
            value={value}
            placeholder="/uploads/… or /media/…"
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: '0.8125rem' }}
          />
          <div className={s.imageActions}>
            <button
              type="button"
              className={cx(s.btn, s.secondary, s.small)}
              onClick={() => setPicking(true)}
            >
              Choose from library
            </button>
            <button
              type="button"
              className={cx(s.btn, s.dark, s.small)}
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              {busy ? 'Uploading…' : 'Upload new'}
            </button>
            <input
              ref={fileRef}
              type="file"
              className={s.fileInput}
              accept={
                video ? 'video/mp4,video/webm' : 'image/*,video/mp4,video/webm,application/pdf'
              }
              onChange={(e) => void upload(e.target.files?.[0])}
            />
          </div>
          {error && (
            <p className={s.error} style={{ marginTop: '0.5rem' }}>
              {error}
            </p>
          )}
        </div>
      </div>
      {picking && (
        <MediaPicker
          kind={video ? 'any' : 'image'}
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
