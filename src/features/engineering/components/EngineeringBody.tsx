'use client';

import Link from 'next/link';

import { Section } from '@/components/layout';
import { Body, Figure, Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { Calculator } from './Calculator';
import { PenModelViewer } from '@/components/three/PenModelViewer';
import { specification } from '@/content/data/specification';

const VS: { label: string; conventional: string; pen: string }[] = [
  { label: 'Concrete volume', conventional: '100%', pen: '20%' },
  { label: 'Excavation', conventional: 'Full footprint', pen: '0 m³' },
  { label: 'Install time', conventional: 'Weeks', pen: '2 hours' },
  { label: 'Bearing capacity', conventional: 'Baseline', pen: '2.6×' },
];

export function EngineeringBody() {
  return (
    <div className="relative pt-nav">
      {/* 01 — exploded / anatomy */}
      <Section id="anatomy">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="01" label="Anatomy of PEN" />
            {/* The route's `h1`. It renders identically to the `h2` it was —
                `Statement` only swaps the tag — but /engineering previously had
                no first-level heading at all, so its outline began at 2. */}
            <Statement as="h1" size="lg" className="mt-6 max-w-[16ch] text-ink">
              Every part, in place.
            </Statement>
            <Body className="mt-6 max-w-[54ch] text-ink-soft">
              Drag to orbit the actual model. One precast node, four cast-in sleeves set at 26°,
              four helical nails driven — not poured — into bearing soil.
            </Body>
          </Reveal>
          <Reveal className="mt-14">
            <PenModelViewer />
          </Reveal>
        </div>
      </Section>

      {/* 02 — assembly spec.
          The homepage names these parts in prose and routes here; this is where
          the figures themselves are printed. They come from the shared
          `specification` module, transcribed from the brief — the array that
          used to sit inline here quoted a Ø90 sleeve at 26°, against a
          specified 32 mm OD pipe at 40–51°. */}
      <Section id="assembly">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            {/* `as="h2"`: this section's only naming copy is its kicker, so
                without a level here the part terms below (`h3`) hung directly
                off the page's `h1` and the outline jumped 1 → 3. */}
            <Kicker as="h2" n="02" label="Assembly" />
          </Reveal>
          <Reveal stagger={0.08} className="mt-12 border-t border-ink/12">
            {specification.parts.map((part, index) => (
              <RevealItem key={part.term}>
                <div className="grid grid-cols-12 items-baseline gap-4 border-b border-ink/12 py-8">
                  <Mono className="col-span-2 text-ink/40">
                    {String(index + 1).padStart(2, '0')}
                  </Mono>
                  <h3 className="col-span-10 text-2xl font-medium tracking-tight text-ink md:col-span-4 md:text-3xl">
                    {part.term}
                  </h3>
                  {/* Mono, like every other hard figure on this page: these are
                      measured values and an IS code, not prose. */}
                  <Mono className="col-span-12 text-ink-soft md:col-span-6 md:col-start-7">
                    {part.spec}
                  </Mono>
                </div>
              </RevealItem>
            ))}
          </Reveal>

          <Reveal className="mt-8">
            <Mono className="text-ink/50">{specification.note}</Mono>
          </Reveal>
        </div>
      </Section>

      {/* 03 — material science */}
      <Section id="material">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-y-10 md:gap-x-10">
          <Reveal className="col-span-12 md:col-span-5">
            <Kicker n="03" label="Material science" />
            <Statement size="md" className="mt-6 text-ink">
              Core steel. Zinc coating. A thread cut to bite.
            </Statement>
            <Body className="mt-6 text-ink-soft">
              Each nail is a hardened steel core with a galvanised coating rated for long-term soil
              exposure, and a helical thread that locks into strata rather than compressing it.
            </Body>
          </Reveal>
          <MediaFrame
            label="NAIL · CUTAWAY"

            aspect="aspect-[4/3]"
            className="col-span-12 md:col-span-6 md:col-start-7"
          />
        </div>
      </Section>

      {/* 04 — load transfer */}
      <Section id="load-transfer">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-y-10 md:gap-x-10">
          <MediaFrame
            label="LOAD PATH · DIAGRAM"

            aspect="aspect-[4/3]"
            className="col-span-12 md:col-span-6"
          />
          <Reveal className="col-span-12 md:col-span-5 md:col-start-8">
            <Kicker n="04" label="Load transfer" />
            <Figure
              value="2.6×"
              caption="Bearing capacity vs. conventional footing"
              size="md"
              className="mt-8"
            />
            <Body className="mt-6 text-ink-soft">
              Force disperses down four opposed angles instead of one vertical mass — the same
              principle as a tent stake set against the wind, at structural scale.
            </Body>
          </Reveal>
        </div>
      </Section>

      {/* 05 — installation simulation */}
      <Section id="installation">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="05" label="Installation, timed" />
          </Reveal>
          <Reveal stagger={0.1} className="mt-14 grid max-w-xl grid-cols-2 gap-10">
            <Figure value="Weeks" caption="Conventional excavate, form, pour, cure" size="md" />
            <Figure value="2 h" caption="PEN — set, drive, done" size="md" />
          </Reveal>
        </div>
      </Section>

      {/* 06 — soil interaction */}
      <Section id="soil">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-y-10 md:gap-x-10">
          <Reveal className="col-span-12 md:col-span-5">
            <Kicker n="06" label="Soil interaction" />
            <Statement size="md" className="mt-6 text-ink">
              Reads the ground it&apos;s driven into.
            </Statement>
            <Body className="mt-6 text-ink-soft">
              Each nail locks into the densest strata it reaches — the section below shows exactly
              where that grip happens for a given soil profile.
            </Body>
          </Reveal>
          <MediaFrame
            label="SOIL SECTION · STRATA"

            aspect="aspect-[4/3]"
            className="col-span-12 md:col-span-6 md:col-start-7"
          />
        </div>
      </Section>

      {/* 07 + 08 — structural performance & validation */}
      <Section id="validation">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="07" label="Structural performance & validation" />
            <Statement size="md" className="mt-6 max-w-[24ch] text-ink">
              Tested against vertical, lateral, and seismic load.
            </Statement>
          </Reveal>
          <Reveal stagger={0.08} className="mt-12 flex flex-wrap gap-4">
            {['[Standard 01]', '[Standard 02]', '[Standard 03]', '[Lab verification]'].map((c) => (
              <RevealItem key={c}>
                <div className="border border-ink/15 px-6 py-8 text-center">
                  <Mono className="text-ink-soft">{c}</Mono>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 09 — vs conventional */}
      <Section id="comparison">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="08" label="PEN vs. conventional" />
          </Reveal>
          <Reveal stagger={0.06} className="mt-12 border-t border-ink/12">
            {VS.map((row) => (
              <RevealItem key={row.label}>
                <div className="grid grid-cols-12 items-baseline gap-4 border-b border-ink/12 py-7">
                  <Mono className="col-span-12 text-ink-soft md:col-span-4">{row.label}</Mono>
                  <span className="col-span-6 font-mono text-lg text-ink/40 md:col-span-4">
                    {row.conventional}
                  </span>
                  <span className="col-span-6 font-mono text-lg text-teal md:col-span-4">
                    {row.pen}
                  </span>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 10 — interactive calculator (reused) */}
      <Calculator />

      {/* 11 — downloads */}
      <Section id="downloads">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="09" label="Downloads" />
          </Reveal>
          <Reveal stagger={0.06} className="mt-12 border-t border-ink/12">
            {/* Requests, not downloads — see the same note in CaseStudy. None
                of these three files exists yet; all three rows were `href="#"`. */}
            {['Spec sheet (PDF)', 'CAD block (DWG)', 'Test report (PDF)'].map((d) => (
              <RevealItem key={d}>
                <Link
                  href="/contact#contact-form"
                  aria-label={`Request ${d}`}
                  className="flex items-center justify-between border-b border-ink/12 py-6 font-mono text-sm tracking-[0.05em] text-ink transition-colors hover:text-teal"
                >
                  {d}
                  <span className="text-ink-soft">Request →</span>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
