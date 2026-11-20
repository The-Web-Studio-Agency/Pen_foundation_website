'use client';

import Link from 'next/link';
import { useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';

interface Row {
  id: string;
  title: string;
  page: string;
  hint: string;
  edited: boolean;
}

/** Every editable section, grouped by page, with a search. */
export function ContentIndex({ pages, entries }: { pages: string[]; entries: Row[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const match = (e: Row) => !q || `${e.title} ${e.page} ${e.hint}`.toLowerCase().includes(q);

  return (
    <>
      <div className={s.searchRow}>
        <input
          className={s.input}
          placeholder="Find a section, e.g. “footer”, “FAQ”, “hero”…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {pages.map((page) => {
        const rows = entries.filter((e) => e.page === page && match(e));
        if (rows.length === 0) return null;
        return (
          <section key={page} className={s.group}>
            <h2 className={s.groupTitle}>{page}</h2>
            <div className={s.cards}>
              {rows.map((row) => (
                <Link key={row.id} href={`/web-admin/content/${row.id}`} className={s.card}>
                  <span className={s.cardTop}>
                    <span className={s.cardTitle}>{row.title}</span>
                    {row.edited && <span className={cx(s.badge, s.badgeEdited)}>Edited</span>}
                  </span>
                  {row.hint && <span className={s.cardHint}>{row.hint}</span>}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
