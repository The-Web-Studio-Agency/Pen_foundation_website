'use client';

import { useMemo, useState } from 'react';
import { Kicker, Mono } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { CATEGORIES, GALLERY_ITEMS, type GalleryCategory } from '@/content/data/gallery';
import { FilterChip } from '@/components/shared/FilterChip';

export function GalleryBody() {
  const [category, setCategory] = useState<GalleryCategory | 'All'>('All');
  const [activeId, setActiveId] = useState(GALLERY_ITEMS[0].id);

  const items = useMemo(
    () =>
      category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === category),
    [category],
  );
  const active = items.find((i) => i.id === activeId) ?? items[0];

  const step = (dir: 1 | -1) => {
    const idx = items.findIndex((i) => i.id === active?.id);
    const next = items[(idx + dir + items.length) % items.length];
    if (next) setActiveId(next.id);
  };

  return (
    <div className="relative min-h-screen bg-ink pt-nav">
      <div className="mx-auto max-w-[1500px] px-6 pt-10 md:px-16">
        {/* The route's `h1`. /gallery had no heading of any level, so its
            outline consisted of the footer's. */}
        <Kicker as="h1" n="—" label="The archive" className="text-ink-soft" />
        <div className="mt-6 flex flex-wrap gap-2">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <FilterChip key={c} label={c} selected={category === c} onSelect={() => setCategory(c)} />
          ))}
        </div>
      </div>

      {/* fullscreen-ish viewer */}
      <div className="relative mx-auto mt-10 max-w-[1500px] px-6 md:px-16">
        {active && (
          <div className="relative">
            <MediaFrame label={active.label.toUpperCase()} aspect="aspect-[16/8]" />
            <button
              onClick={() => step(-1)}
              aria-label="Previous"
              className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/20 bg-paper/70 text-ink transition-colors hover:border-teal hover:text-teal"
            >
              ←
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next"
              className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/20 bg-paper/70 text-ink transition-colors hover:border-teal hover:text-teal"
            >
              →
            </button>
            <div className="mt-4 flex items-baseline justify-between">
              <Mono className="text-ink-soft">{active.category}</Mono>
              <Mono className="text-ink-soft">{active.label}</Mono>
            </div>
          </div>
        )}
      </div>

      {/* filmstrip */}
      <div className="mx-auto mt-10 flex max-w-[1500px] gap-3 overflow-x-auto px-6 pb-16 md:px-16">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`w-[160px] flex-shrink-0 transition-opacity ${
              item.id === active?.id ? 'opacity-100' : 'opacity-45 hover:opacity-80'
            }`}
          >
            <MediaFrame label={item.category.toUpperCase()} aspect="aspect-[4/3]" />
          </button>
        ))}
      </div>
    </div>
  );
}
