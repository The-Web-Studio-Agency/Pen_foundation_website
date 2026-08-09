'use client';

import Link from 'next/link';
import { Section } from '@/components/layout';
import { Body, Figure, Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { PROJECTS, type Project } from '@/content/data/projects';

export function CaseStudy({ project }: { project: Project }) {
  const related = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="relative pt-nav">
      {/* 00 — cold open */}
      <Section id="open" padded={false} className="flex min-h-[80vh] items-end">
        <MediaFrame
          label={`${project.location.toUpperCase()} · SITE`}

          aspect="aspect-auto"
          className="absolute inset-0 h-full"
        />
        <div className="relative z-10 px-6 pb-20 md:px-16">
          <Mono className="text-ink-soft">
            {project.location} · {project.year}
          </Mono>
          <Statement size="xl" className="mt-4 max-w-[16ch] text-ink">
            {project.name}
          </Statement>
        </div>
      </Section>

      {/* 01 — the challenge */}
      <Section id="challenge">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Kicker n="01" label="The challenge" />
            <Statement size="md" className="mt-6 text-ink">
              {project.challenge}
            </Statement>
          </Reveal>
        </div>
      </Section>

      {/* 02 — site conditions */}
      <Section id="site">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-10">
          <Reveal className="col-span-12 md:col-span-5">
            <Kicker n="02" label="Site conditions" />
            <Body className="mt-6 text-ink-soft">{project.siteConditions}</Body>
            <Mono className="mt-6 block text-ink-soft">{project.soilType}</Mono>
          </Reveal>
          <MediaFrame
            label="SOIL SECTION · SITE-SPECIFIC"

            aspect="aspect-[4/3]"
            className="col-span-12 md:col-span-6 md:col-start-7"
          />
        </div>
      </Section>

      {/* 03 — engineering approach */}
      <Section id="approach">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-10">
          <MediaFrame
            label="PLAN DRAWING · SLEEVE LAYOUT"

            aspect="aspect-[4/3]"
            className="col-span-12 md:col-span-6"
          />
          <Reveal className="col-span-12 md:col-span-5 md:col-start-8">
            <Kicker n="03" label="Engineering approach" />
            <Body className="mt-6 text-ink-soft">{project.approach}</Body>
            <Mono className="mt-6 block text-ink-soft">{project.foundationType}</Mono>
          </Reveal>
        </div>
      </Section>

      {/* 04 — installation + 05 drawings */}
      <Section id="installation">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="04" label="Installation" />
            <Statement size="md" className="mt-6 text-ink">
              Installed in {project.installDuration}.
            </Statement>
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <MediaFrame label="INSTALL · 01" aspect="aspect-[4/3]" />
            <MediaFrame label="INSTALL · 02" aspect="aspect-[4/3]" />
            <MediaFrame label="TECHNICAL DRAWING" aspect="aspect-[4/3]" />
          </Reveal>
        </div>
      </Section>

      {/* 06 — gallery */}
      <Section id="gallery" padded={false} className="py-16 md:py-24">
        <div className="px-6 md:px-16">
          <Reveal>
            <Kicker n="05" label="Construction gallery" />
          </Reveal>
        </div>
        <Reveal className="mt-8 flex gap-4 overflow-x-auto px-6 pb-4 md:px-16">
          {['01', '02', '03', '04', '05'].map((n) => (
            <RevealItem key={n} className="w-[280px] flex-shrink-0">
              <MediaFrame label={`FRAME ${n}`} aspect="aspect-[4/3]" />
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      {/* 07 — performance metrics */}
      <Section id="metrics">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="06" label="Performance" />
          </Reveal>
          <Reveal stagger={0.1} className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            <Figure
              value={project.installDuration.split(',')[0]}
              caption="Install duration"
              size="md"
            />
            <Figure value={project.capacity} caption="Bearing capacity achieved" size="md" />
            <Figure value={project.concreteSaved} caption="Concrete saved" size="md" />
            <Figure value="0 m³" caption="Soil excavated" size="md" />
          </Reveal>
        </div>
      </Section>

      {/* 09 — lessons learned */}
      <Section id="lessons">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Kicker n="07" label="Lessons learned" />
            <Body className="mt-6 text-ink-soft italic">{project.lessons}</Body>
          </Reveal>
        </div>
      </Section>

      {/* 10 — downloads */}
      <Section id="downloads">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="08" label="Downloads" />
          </Reveal>
          <Reveal stagger={0.06} className="mt-10 border-t border-ink/12">
            {['Site drawings (PDF)', 'Load report (PDF)'].map((d) => (
              <RevealItem key={d}>
                <a
                  href="#"
                  className="flex items-center justify-between border-b border-ink/12 py-6 font-mono text-sm text-ink transition-colors hover:text-teal"
                >
                  {d}
                  <span className="text-ink-soft">↓</span>
                </a>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 11 — related projects */}
      <Section id="related">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="09" label="Related projects" />
          </Reveal>
          <Reveal stagger={0.08} className="mt-10 flex gap-6 overflow-x-auto pb-4">
            {related.map((p) => (
              <RevealItem key={p.slug} className="w-[280px] flex-shrink-0">
                <Link href={`/projects/${p.slug}`} className="group block">
                  <MediaFrame label={p.location.toUpperCase()} aspect="aspect-[4/3]" />
                  <h3 className="mt-4 text-lg font-medium tracking-tight text-ink transition-colors group-hover:text-teal">
                    {p.name}
                  </h3>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
