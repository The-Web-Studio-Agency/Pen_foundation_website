'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { ARTICLES, type Article as ArticleType } from '@/content/data/research';

export function Article({ article }: { article: ArticleType }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="relative bg-paper">
      {/* reading progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-[2px] bg-ink/8">
        <div className="h-full origin-left bg-teal" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* header */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 md:px-0">
        <Kicker n={article.category} label={`${article.readTime} read`} />
        <Statement size="lg" className="mt-6 max-w-[22ch] text-ink">
          {article.title}
        </Statement>
        <p className="mt-6 max-w-[54ch] text-lg text-ink-soft">{article.dek}</p>
        <Mono className="mt-6 block text-ink-soft">
          {article.author} · {article.date}
        </Mono>
        <MediaFrame label={article.cover} aspect="aspect-[16/9]" className="mt-10" />
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-10 px-6 pb-32 md:px-0">
        {/* sticky TOC */}
        <aside className="col-span-3 hidden md:block">
          <div className="sticky top-24 space-y-3 border-l border-ink/12 pl-6">
            <Mono className="mb-2 block text-ink-soft">Contents</Mono>
            {article.body.map((b) => (
              <a
                key={b.heading}
                href={`#${b.heading.replace(/\s+/g, '-').toLowerCase()}`}
                className="block font-mono text-[11px] tracking-[0.05em] text-ink-soft transition-colors hover:text-teal"
              >
                {b.heading}
              </a>
            ))}
          </div>
        </aside>

        {/* body */}
        <div ref={bodyRef} className="col-span-12 max-w-[65ch] md:col-span-9">
          {article.body.map((b, i) => (
            <section
              key={b.heading}
              id={b.heading.replace(/\s+/g, '-').toLowerCase()}
              className="mb-14 scroll-mt-24"
            >
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-ink">{b.heading}</h2>
              <p className="text-lg leading-relaxed text-ink-soft">{b.text}</p>

              {i === 1 && article.pullQuote && (
                <blockquote className="my-14 border-l-2 border-teal pl-6 text-3xl leading-tight font-light text-ink md:text-4xl">
                  &ldquo;{article.pullQuote}&rdquo;
                </blockquote>
              )}

              {b.note && (
                <details className="mt-6 border border-ink/12 px-5 py-4">
                  <summary className="cursor-pointer font-mono text-[11px] tracking-[0.2em] text-teal uppercase">
                    Engineering note
                  </summary>
                  <p className="mt-4 font-mono text-sm leading-relaxed text-ink-soft">{b.note}</p>
                </details>
              )}
            </section>
          ))}

          <a
            href="#"
            className="mt-4 inline-block border-b border-teal/40 pb-2 font-mono text-[11px] tracking-[0.3em] text-teal uppercase transition-colors hover:border-ink hover:text-ink"
          >
            Get the spec sheet →
          </a>
        </div>
      </div>

      {/* related research */}
      <div className="border-t border-ink/12 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-[1500px]">
          <Kicker n="—" label="Related research" />
          <Reveal stagger={0.08} className="mt-10 flex gap-6 overflow-x-auto pb-4">
            {related.map((a) => (
              <RevealItem key={a.slug} className="w-[300px] flex-shrink-0">
                <Link href={`/research/${a.slug}`} className="group block">
                  <MediaFrame label={a.cover} aspect="aspect-[4/3]" />
                  <h3 className="mt-4 text-lg font-medium tracking-tight text-ink transition-colors group-hover:text-teal">
                    {a.title}
                  </h3>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
