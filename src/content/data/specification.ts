import type { SpecificationContent } from '@/types/specification';

/**
 * The PEN system's technical specification.
 *
 * SOURCE: the specification table in `fetch_data_from_docs/
 * PEN_Foundation_Website_Brief.pdf`, which states that these figures "must
 * appear verbatim on the website wherever technical data is displayed. The
 * development team must not paraphrase, estimate, or substitute these values."
 * Every row below is transcribed, not summarised.
 *
 * Lives here rather than in `homepage.ts` because it is no longer homepage
 * copy: the homepage names the parts in prose and routes to /engineering, and
 * this is what /engineering prints. It is product data, so it sits in the
 * shared content layer where any route can read it.
 *
 * It replaces a hardcoded `PARTS` array that was written inline in
 * `EngineeringBody`. That array disagreed with the brief on two figures — it
 * had the sleeve at "Ø90 … cast in at 26°" against a specified 32 mm OD pipe
 * at a 40–51° batter — so the two pages were quoting different products.
 */
export const specification: SpecificationContent = {
  title: 'What goes into the ground',
  parts: [
    { term: 'Node', spec: 'M50 grade precast concrete — 450 × 450 × 200 mm' },
    { term: 'Nail pipes', spec: 'GI pipe — 32 mm OD, 3.2 mm wall, IS 1239' },
    { term: 'Nail tip', spec: 'Tungsten carbide — recycled Kennametal / Sandvik grade' },
    { term: 'Batter angle', spec: '40–51° — site-adjusted' },
    { term: 'Min. embedment', spec: '900 mm — per IS 2911 Part 4' },
    { term: 'Grout', spec: 'Fosroc Conbextra GP2 micro-concrete, non-shrink' },
    { term: 'Bolts', spec: 'M12 grade 4.6 galvanised — IS 5624' },
    { term: 'Peak load observed', spec: '667 kN/m² — MatterLab field test, Wayanad' },
  ],
  note: 'Model CD-PEN-32.3.2.1500 · Governed by IS 2911 Part 4 (nail / pile system)',
};
