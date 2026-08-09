'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/layout';
import { Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { ARTICLES, type Category } from '@/content/data/research';
import { FilterChip } from '@/components/shared/FilterChip';

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Engineering',
  'Innovation',
  'Construction',
  'Research',
  'Sustainability',
  'Testing',
];

export function ResearchBody() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const [cover, ...rest] = ARTICLES;
  const filtered = useMemo(
    () => (category === 'All' ? rest : rest.filter((a) => a.category === category)),
    [category, rest],
  );

  return (
    <div className="relative pt-nav">
      {/* masthead */}
      <Section id="masthead">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Mono className="text-ink-soft">Issue №07 · [Date] · Ground, reconsidered</Mono>
            <Statement size="lg" className="mt-6 max-w-[18ch] text-ink">
              The Research Journal
            </Statement>
          </Reveal>

          {/* cover story */}
          <Reveal className="mt-16">
            <Link href={`/research/${cover.slug}`} className="group block">
              <MediaFrame label={cover.cover} aspect="aspect-[21/9]" />
              <div className="mt-6 flex items-baseline justify-between gap-6">
                <Mono className="text-teal">{cover.category}</Mono>
                <Mono className="text-ink-soft">{cover.readTime} read</Mono>
              </div>
              <Statement
                size="lg"
                className="mt-4 max-w-[20ch] text-ink transition-colors group-hover:text-teal"
              >
                {cover.title}
              </Statement>
              <p className="mt-3 max-w-[54ch] text-lg text-ink-soft">{cover.dek}</p>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* category rail + featured / notes */}
      <Section id="issue">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-wrap gap-3 border-b border-ink/12 pb-8">
            {CATEGORIES.map((c) => (
              <FilterChip key={c} label={c} selected={category === c} onSelect={() => setCategory(c)} />
            ))}
          </div>

          <Reveal key={category} stagger={0.08} className="mt-12 grid grid-cols-12 gap-8">
            {filtered.map((a, i) => (
              <RevealItem
                key={a.slug}
                className={i === 0 ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-span-5'}
              >
                <Link href={`/research/${a.slug}`} className="group block">
                  <MediaFrame
                    label={a.cover}

                    aspect={i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}
                  />
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <Mono className="text-ink-soft">{a.category}</Mono>
                    <Mono className="text-ink-soft">{a.readTime}</Mono>
                  </div>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-teal md:text-3xl">
                    {a.title}
                  </h3>
                </Link>
              </RevealItem>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-12 font-mono text-sm text-ink-soft">
                No notes filed under this category yet.
              </p>
            )}
          </Reveal>
        </div>
      </Section>

      {/* archive spine */}
      <Section id="archive">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="—" label="Back issues" />
          </Reveal>
          <Reveal stagger={0.05} className="mt-10 flex gap-4 overflow-x-auto pb-4">
            {['06', '05', '04', '03', '02', '01'].map((n) => (
              <RevealItem key={n} className="flex-shrink-0">
                <div className="flex h-40 w-14 items-end justify-center border border-ink/15 pb-4 transition-transform hover:-translate-y-1">
                  <Mono className="text-ink-soft [writing-mode:vertical-rl]">Issue №{n}</Mono>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
