'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/layout';
import { Kicker, Mono, Statement } from '@/components/typography';
import { Reveal } from '@/components/motion';

const TYPES = ['Residential', 'Commercial', 'Solar', 'Eco Resort'] as const;
const SOILS = ['Laterite', 'Clay', 'Sand mix', 'Water-rich'] as const;
const DEFAULT_POINTS: Record<(typeof TYPES)[number], number> = {
  Residential: 12,
  Commercial: 60,
  Solar: 240,
  'Eco Resort': 36,
};

/**
 * 14 — PROJECT CALCULATOR (functional, cream). Directional estimates from
 * source-supported assumptions: ~2 h/point, 6× faster deployment, ~100 kg CO₂-eq
 * avoided/unit. Every output is labelled an estimate; exact figures need a site
 * assessment. Editorial, not a dashboard.
 */
export function Calculator() {
  const [type, setType] = useState<(typeof TYPES)[number]>('Residential');
  const [points, setPoints] = useState(DEFAULT_POINTS.Residential);
  const [soil, setSoil] = useState<(typeof SOILS)[number]>('Laterite');

  const out = useMemo(() => {
    const penPerDay = 6; // ~2 h/point, working day, single crew
    const penDays = Math.max(1, Math.ceil(points / penPerDay));
    const tradDays = penDays * 6; // 6× faster deployment
    const savedDays = tradDays - penDays;
    const savedPct = Math.round((savedDays / tradDays) * 100);
    const co2 = points * 100; // kg CO₂-eq avoided per unit
    return { penDays, tradDays, savedDays, savedPct, co2 };
  }, [points]);

  const co2Display = out.co2 >= 1000 ? `${(out.co2 / 1000).toFixed(1)} t` : `${out.co2} kg`;

  return (
    <Section id="calculator">
      <div className="mx-auto w-full max-w-[1500px]">
        <Reveal>
          <Kicker n="—" label="Project calculator" />
          <Statement size="lg" className="mt-8 max-w-[14ch] text-ink">
            What could your
            <br />
            project <span className="text-neutral-500">save?</span>
          </Statement>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-y-16 md:mt-24 md:gap-x-20">
          {/* inputs */}
          <div className="col-span-12 space-y-12 lg:col-span-5">
            <div>
              <Mono className="text-ink/50">Project type</Mono>
              <div className="mt-4 flex flex-wrap gap-3">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      setPoints(DEFAULT_POINTS[t]);
                    }}
                    className={`border px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      type === t
                        ? 'border-neutral-800 bg-neutral-900 text-white'
                        : 'border-ink/20 text-ink/60 hover:border-ink/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <Mono className="text-ink/50">Foundation points</Mono>
                <span className="font-mono text-2xl text-ink">{points}</span>
              </div>
              <input
                type="range"
                min={4}
                max={500}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                aria-label="Number of foundation points"
                className="mt-4 w-full accent-neutral-800"
              />
            </div>

            <div>
              <Mono className="text-ink/50">Soil type</Mono>
              <div className="mt-4 flex flex-wrap gap-3">
                {SOILS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSoil(s)}
                    className={`border px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      soil === s
                        ? 'border-neutral-800 text-neutral-500'
                        : 'border-ink/20 text-ink/50 hover:border-ink/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* live results */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              <Result label="Traditional time" value={`${out.tradDays}`} unit="days" muted />
              <Result label="PEN time" value={`${out.penDays}`} unit="days" accent />
              <Result
                label="Time saved"
                value={`${out.savedDays}`}
                unit={`days · ${out.savedPct}%`}
                big
              />
              <Result label="CO₂-eq avoided" value={co2Display} unit="est." big />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/12 pt-8">
              <span className="border border-neutral-800/40 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
                ~93% less cement
              </span>
              <span className="border border-ink/20 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-ink/60 uppercase">
                0 m³ soil displaced
              </span>
            </div>

            <p className="mt-8 max-w-[46ch] text-sm text-ink/45">
              Directional estimate from published PEN assumptions (~2 h/point, 6× faster deployment,
              ~100 kg CO₂-eq avoided per unit). Actual figures depend on site conditions.
            </p>

            <a
              href="#contact"
              className="mt-8 inline-block bg-neutral-900 px-8 py-4 font-mono text-xs tracking-[0.25em] text-white uppercase transition-colors hover:bg-neutral-700"
            >
              Get an exact site assessment →
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Result({
  label,
  value,
  unit,
  muted,
  accent,
  big,
}: {
  label: string;
  value: string;
  unit: string;
  muted?: boolean;
  accent?: boolean;
  big?: boolean;
}) {
  const color = muted ? 'text-ink/40' : accent ? 'text-neutral-500' : big ? 'text-ink' : 'text-ink';
  return (
    <motion.div layout>
      <Mono className="block text-ink/50">{label}</Mono>
      <div
        className={`mt-3 font-mono leading-none ${big ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'} ${color}`}
      >
        {value}
      </div>
      <Mono className="mt-3 block text-ink/40">{unit}</Mono>
    </motion.div>
  );
}
