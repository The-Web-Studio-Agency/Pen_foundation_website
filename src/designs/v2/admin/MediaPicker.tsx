'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';

export interface MediaItem {
  url: string;
  name: string;
  size: number;
  uploaded: boolean;
  modified: number;
}

export const isImageUrl = (url: string) => /\.(png|jpe?g|webp|avif|gif|svg)(\?|#|$)/i.test(url);
export const isVideoUrl = (url: string) => /\.(mp4|webm)(\?|#|$)/i.test(url);

export const formatBytes = (n: number) =>
  n > 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;

/** Upload one file; resolves to its URL. */
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/cms/upload', { method: 'POST', body: form });
  const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !body.url) throw new Error(body.error ?? 'Upload failed.');
  return body.url;
}

/** A thumbnail for any media URL: the image, a video frame, or the file type. */
export function MediaThumb({ url, className }: { url: string; className?: string }) {
  if (!url) return <div className={s.thumbEmpty}>No image</div>;
  if (isImageUrl(url)) {
    return (
      <Image
        src={url}
        alt=""
        fill
        unoptimized
        sizes="12rem"
        className={cx(s.thumbImg, className)}
      />
    );
  }
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }
  return <div className={s.thumbEmpty}>{url.split('.').pop()?.toUpperCase()}</div>;
}

export function useMedia() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let alive = true;
    fetch('/api/cms/media')
      .then((res) => res.json() as Promise<{ items?: MediaItem[] }>)
      .then((body) => alive && setItems(body.items ?? []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [version]);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { items, reload };
}

/** Modal library: pick any image (uploaded or the site's own), or upload a new one. */
export function MediaPicker({
  onPick,
  onClose,
  kind = 'image',
}: {
  onPick: (url: string) => void;
  onClose: () => void;
  kind?: 'image' | 'any';
}) {
  const { items, reload } = useMedia();
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      reload();
      onPick(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const shown = (items ?? []).filter(
    (item) =>
      (kind === 'any' || isImageUrl(item.url)) &&
      item.url.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className={s.modalBackdrop} onClick={onClose} role="presentation">
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Media library"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.modalHead}>
          <h2 className={s.panelTitle} style={{ margin: 0 }}>
            Choose {kind === 'image' ? 'an image' : 'a file'}
          </h2>
          <div className={s.headActions}>
            <button
              type="button"
              className={cx(s.btn, s.primary, s.small)}
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              {busy ? 'Uploading…' : 'Upload new'}
            </button>
            <button type="button" className={cx(s.btn, s.secondary, s.small)} onClick={onClose}>
              Close
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            className={s.fileInput}
            accept={kind === 'image' ? 'image/*' : 'image/*,video/mp4,video/webm,application/pdf'}
            onChange={(e) => void upload(e.target.files?.[0])}
          />
        </div>
        <div>
          {error && <p className={s.error}>{error}</p>}
          <input
            className={s.input}
            placeholder="Search by file name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={s.modalBody}>
          {items === null ? (
            <p className={s.muted}>Loading…</p>
          ) : (
            <div className={s.mediaGrid}>
              {shown.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  className={s.mediaItem}
                  onClick={() => onPick(item.url)}
                >
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
