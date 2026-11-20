'use client';

import { useRef, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { useToast } from './ContentEditor';
import { formatBytes, MediaThumb, uploadFile, useMedia } from './MediaPicker';

/** Upload, browse, copy and delete media. The site's own files are read-only. */
export function MediaLibrary() {
  const { items, reload } = useMedia();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'uploaded' | 'site'>('all');
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { show, node } = useToast();

  const upload = async (files: FileList | File[] | null | undefined) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    let done = 0;
    for (const file of Array.from(files)) {
      try {
        await uploadFile(file);
        done += 1;
      } catch (e) {
        show({ text: `${file.name}: ${(e as Error).message}`, error: true });
      }
    }
    setBusy(false);
    if (done) show({ text: `Uploaded ${done} file${done === 1 ? '' : 's'}.` });
    reload();
  };

  const copy = async (url: string) => {
    await navigator.clipboard?.writeText(url).catch(() => {});
    show({ text: 'Path copied.' });
  };

  const remove = async (url: string) => {
    if (!window.confirm('Delete this file? Any page still using it will show a broken image.'))
      return;
    const res = await fetch(`/api/cms/media?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    if (!res.ok) return show({ text: 'Could not delete.', error: true });
    show({ text: 'Deleted.' });
    reload();
  };

  const shown = (items ?? []).filter(
    (item) =>
      (filter === 'all' || (filter === 'uploaded') === item.uploaded) &&
      item.url.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <div
        className={cx(s.dropzone, over && s.dropzoneActive)}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void upload(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
      >
        <b>{busy ? 'Uploading…' : 'Drop files here, or click to upload'}</b>
        <span className={s.muted}>Images, MP4/WebM video or PDF · up to 15 MB each</span>
        <input
          ref={fileRef}
          type="file"
          multiple
          className={s.fileInput}
          accept="image/*,video/mp4,video/webm,application/pdf"
          onChange={(e) => void upload(e.target.files)}
        />
      </div>

      <div className={s.searchRow}>
        <input
          className={s.input}
          placeholder="Search by file name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={s.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All files</option>
          <option value="uploaded">Uploaded in the admin</option>
          <option value="site">The site’s own</option>
        </select>
        <span className={s.muted} style={{ alignSelf: 'center' }}>
          {shown.length} files
        </span>
      </div>

      {items === null ? (
        <p className={s.muted}>Loading…</p>
      ) : (
        <div className={s.mediaGrid}>
          {shown.map((item) => (
            <div key={item.url} className={s.mediaItem}>
              <span className={s.mediaThumb}>
                <MediaThumb url={item.url} />
              </span>
              <span className={s.mediaName} title={item.url}>
                {item.name}
              </span>
              <span className={s.mediaMeta}>
                <span className={s.muted} style={{ fontSize: '0.75rem' }}>
                  {formatBytes(item.size)}
                </span>
                {item.uploaded && <span className={cx(s.badge, s.badgeOk)}>Uploaded</span>}
              </span>
              <span className={s.mediaMeta}>
                <button
                  type="button"
                  className={cx(s.btn, s.secondary, s.small)}
                  onClick={() => copy(item.url)}
                >
                  Copy path
                </button>
                {item.uploaded && (
                  <button
                    type="button"
                    className={cx(s.btn, s.danger, s.small)}
                    onClick={() => remove(item.url)}
                  >
                    Delete
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
      {node}
    </>
  );
}
