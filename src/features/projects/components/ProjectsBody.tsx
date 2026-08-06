'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/layout';
import { Figure, Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { PROJECTS } from '@/content/data/projects';

const INDUSTRIES = ['All', 'Residential', 'Commercial', 'Solar', 'Eco Resort'] as const;

export function ProjectsBody() {
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]>('All');

  const filtered = useMemo(
    () => (industry === 'All' ? PROJECTS : PROJECTS.filter((p) => p.industry === industry)),
    [industry],
  );

  return (
    <div className="relative">
      <Section id="explorer">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="—" label="Deployment explorer" />
            <Statement size="lg" className="mt-6 max-w-[18ch] text-ink">
              Where PEN is already ground.
            </Statement>
          </Reveal>

          {/* animated stat strip */}
          <Reveal stagger={0.1} className="mt-14 grid max-w-2xl grid-cols-3 gap-10">
            <Figure value={String(PROJECTS.length)} caption="Deployments shown" size="md" />
            <Figure value="[X]" caption="Total installs to date" size="md" />
            <Figure value="80%" caption="Avg. concrete saved" size="md" />
          </Reveal>

          {/* filter rail */}
          <div className="mt-16 flex flex-wrap gap-3 border-t border-ink/12 pt-8">
            {INDUSTRIES.map((i) => (
              <button
                key={i}
                onClick={() => setIndustry(i)}
                className={`border px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  industry === i
                    ? 'border-ink bg-ink text-paper'
                    : 'border-ink/20 text-ink-soft hover:border-ink/50'
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          {/* filmstrip */}
          <Reveal
            key={industry}
            stagger={0.06}
            className="-mx-1 mt-12 flex gap-6 overflow-x-auto px-1 pb-6"
          >
            {filtered.map((p) => (
              <RevealItem key={p.slug} className="w-[320px] flex-shrink-0">
                <Link href={`/projects/${p.slug}`} className="group block">
                  <MediaFrame
                    label={`${p.location.toUpperCase()}`}

                    aspect="aspect-[4/3]"
                  />
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-tight text-ink transition-colors group-hover:text-teal">
                      {p.name}
                    </h3>
                    <Mono className="text-ink/40">{p.industry}</Mono>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    <Mono className="text-ink-soft">{p.installDuration}</Mono>
                    <Mono className="text-ink-soft">{p.capacity} capacity</Mono>
                    <Mono className="text-ink-soft">{p.concreteSaved} less concrete</Mono>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </Reveal>

          {filtered.length === 0 && (
            <p className="mt-12 font-mono text-sm text-ink-soft">
              No deployments match that filter yet.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
