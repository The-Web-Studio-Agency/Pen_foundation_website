'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { JsonEditor, type Json } from './JsonEditor';

export function useToast() {
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);
  const node = toast ? (
    <div className={cx(s.toast, toast.error && s.toastError)} role="status">
      {toast.text}
    </div>
  ) : null;
  return { show: setToast, node };
}

/** Warn before leaving the page with unsaved changes. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}

export async function saveContent(id: string, value: Json) {
  const res = await fetch(`/api/cms/content/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'Could not save.');
  }
}

/** One page section: the form, Save, and Reset to the original. */
export function ContentEditor({
  id,
  initial,
  edited,
  path,
  hidden,
  fixedLength,
}: {
  id: string;
  initial: Json;
  edited: boolean;
  path: string;
  hidden?: string[];
  fixedLength?: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState<Json>(initial);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [busy, setBusy] = useState(false);
  const { show, node } = useToast();
  const dirty = JSON.stringify(value) !== saved;
  useUnsavedGuard(dirty);

  const save = async () => {
    setBusy(true);
    try {
      await saveContent(id, value);
      setSaved(JSON.stringify(value));
      show({ text: 'Saved. The website shows the change now.' });
      router.refresh();
    } catch (e) {
      show({ text: (e as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (
      !window.confirm(
        'Put this section back to the original content? Your edits here will be lost.',
      )
    )
      return;
    setBusy(true);
    const res = await fetch(`/api/cms/content/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) return show({ text: 'Could not reset.', error: true });
    show({ text: 'Back to the original.' });
    router.refresh();
    window.location.reload();
  };

  return (
    <>
      <div className={s.editorBar}>
        <button
          type="button"
          className={cx(s.btn, s.primary)}
          onClick={save}
          disabled={busy || !dirty}
        >
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          className={cx(s.btn, s.secondary)}
          onClick={() => setValue(JSON.parse(saved) as Json)}
          disabled={busy || !dirty}
        >
          Discard
        </button>
        {dirty ? (
          <span className={s.dirty}>Unsaved changes</span>
        ) : (
          edited && <span className={cx(s.badge, s.badgeEdited)}>Edited</span>
        )}
        <span className={s.grow} />
        <a href={path} target="_blank" rel="noopener noreferrer" className={cx(s.btn, s.secondary)}>
          View on site ↗
        </a>
        {edited && (
          <button type="button" className={cx(s.btn, s.danger)} onClick={reset} disabled={busy}>
            Reset to original
          </button>
        )}
      </div>

      <JsonEditor value={value} onChange={setValue} hidden={hidden} fixedLength={fixedLength} />
      {node}
    </>
  );
}
