'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { GalleryCategory } from '@/content/data/gallery';

import { cx, stagger } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import { FilterPills } from '../blogs/FilterPills';
import s from './gallery.module.css';

export interface GalleryTile {
  id: string;
  label: string;
  category: GalleryCategory;
  photo?: { src: string; alt: string };
}

const ALL = 'All';

function CameraGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7.5h4l1.5-2.25h7L17 7.5h4v11.25H3z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function FilmGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * Category filter over the archive. Every tile is rendered once and hidden
 * rather than unmounted, so the site's reveal observer (which scans on route
 * change only) still owns each one. Every fifth visible tile runs wide.
 */
export function GalleryGrid({ tiles }: { tiles: GalleryTile[] }) {
  const categories = [ALL, ...Array.from(new Set(tiles.map((x) => x.category)))];
  const [category, setCategory] = useState(ALL);

  const counts = Object.fromEntries(
    categories.map((c) => [
      c,
      c === ALL ? tiles.length : tiles.filter((x) => x.category === c).length,
    ]),
  );
  const visible = tiles.filter((x) => category === ALL || x.category === category);

  return (
    <div>
      <div className={s.toolbar} data-reveal>
        <FilterPills
          label="Filter the archive by category"
          options={categories}
          value={category}
          onChange={setCategory}
          counts={counts}
          tone="dark"
        />
        <p className={cx(t.mono, s.count)} aria-live="polite">
          {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <ul className={s.grid}>
        {tiles.map((tile, i) => {
          const position = visible.indexOf(tile);
          const wide = position !== -1 && position % 5 === 0 && visible.length > 1;
          const isFilm = tile.category === 'Videos';
          return (
            <li
              key={tile.id}
              hidden={position === -1}
              className={cx(s.item, wide && s.wide)}
              data-reveal
              style={stagger(i % 3)}
            >
              <figure className={cx(s.tile, !tile.photo && s.pending)}>
                {tile.photo ? (
                  <>
                    <Image
                      src={tile.photo.src}
                      alt={tile.photo.alt}
                      fill
                      sizes="(min-width: 64rem) 66vw, (min-width: 48rem) 100vw, 100vw"
                      className={s.photo}
                    />
                    <span className={s.shade} aria-hidden />
                  </>
                ) : (
                  <>
                    <span className={s.floor} aria-hidden />
                    <span className={s.glyph} aria-hidden>
                      {isFilm ? <FilmGlyph /> : <CameraGlyph />}
                    </span>
                  </>
                )}
                <span className={cx(t.mono, s.category)}>{tile.category}</span>
                <figcaption className={s.caption}>
                  <span className={s.label}>{tile.label}</span>
                  {!tile.photo && (
                    <span className={cx(t.mono, s.status)}>
                      {isFilm ? 'Film to come' : 'Photograph to come'}
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
