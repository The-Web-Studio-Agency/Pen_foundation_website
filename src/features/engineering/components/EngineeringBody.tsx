'use client';

import { Section } from '@/components/layout';
import { Body, Figure, Kicker, Mono, Statement } from '@/components/typography';
import { MediaFrame } from '@/components/shared/media/MediaFrame';
import { Reveal, RevealItem } from '@/components/motion';
import { Calculator } from './Calculator';
import { PenModelViewer } from '@/components/three/PenModelViewer';

const PARTS: { n: string; name: string; spec: string }[] = [
  { n: '01', name: 'Precast node', spec: 'Safety-yellow precast concrete, square frustum' },
  { n: '02', name: 'Steel cap plate', spec: 'Galvanised, load-bearing interface to structure' },
  { n: '03', name: 'GI sleeve × 4', spec: 'Ø90 galvanised iron, cast in at 26°' },
  { n: '04', name: 'Helical nail × 4', spec: 'Driven, not poured — hardened steel tip' },
];

const VS: { label: string; conventional: string; pen: string }[] = [
  { label: 'Concrete volume', conventional: '100%', pen: '20%' },
  { label: 'Excavation', conventional: 'Full footprint', pen: '0 m³' },
  { label: 'Install time', conventional: 'Weeks', pen: '2 hours' },
  { label: 'Bearing capacity', conventional: 'Baseline', pen: '2.6×' },
];

export function EngineeringBody() {
  return (
    <div className="relative">
      {/* 01 — exploded / anatomy */}
      <Section id="anatomy">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="01" label="Anatomy of PEN" />
            <Statement size="lg" className="mt-6 max-w-[16ch] text-ink">
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

      {/* 02 — assembly spec */}
      <Section id="assembly">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Kicker n="02" label="Assembly" />
          </Reveal>
          <Reveal stagger={0.08} className="mt-12 border-t border-ink/12">
            {PARTS.map((p) => (
              <RevealItem key={p.n}>
                <div className="grid grid-cols-12 items-baseline gap-4 border-b border-ink/12 py-8">
                  <Mono className="col-span-2 text-ink/40">{p.n}</Mono>
                  <h3 className="col-span-10 text-2xl font-medium tracking-tight text-ink md:col-span-4 md:text-3xl">
                    {p.name}
                  </h3>
                  <Body className="col-span-12 text-ink-soft md:col-span-6 md:col-start-7">
                    {p.spec}
                  </Body>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 03 — material science */}
      <Section id="material">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-10">
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
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-10">
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
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center gap-10">
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
            {['Spec sheet (PDF)', 'CAD block (DWG)', 'Test report (PDF)'].map((d) => (
              <RevealItem key={d}>
                <a
                  href="#"
                  className="flex items-center justify-between border-b border-ink/12 py-6 font-mono text-sm tracking-[0.05em] text-ink transition-colors hover:text-teal"
                >
                  {d}
                  <span className="text-ink-soft">↓</span>
                </a>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
