export type Category =
  'Engineering' | 'Innovation' | 'Construction' | 'Research' | 'Sustainability' | 'Testing';

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  date: string;
  readTime: string;
  cover: string;
  body: { heading: string; text: string; note?: string }[];
  pullQuote?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'why-driven-beats-poured',
    title: 'Why driven beats poured',
    dek: 'The physics case for a nail over a mass of concrete, in four opposed angles.',
    category: 'Engineering',
    author: '[Author]',
    date: '[Date]',
    readTime: '6 min',
    cover: 'LOAD PATH · HERO DIAGRAM',
    pullQuote: 'A footing resists load by being heavy. A nail resists load by being anchored.',
    body: [
      {
        heading: 'The old assumption',
        text: 'Conventional footings work by mass — enough concrete, deep enough, that the building simply outweighs any force trying to move it. It is a brute-force solution, and it is why footings take weeks: mass needs time to cure into strength.',
      },
      {
        heading: 'The alternative',
        text: 'A helical nail set at an angle resists load the way a tent stake resists wind — through anchorage in the surrounding soil, not raw weight. Four nails at opposing 26° angles create a cone of engaged soil beneath the structure.',
        note: 'Engineering note: bearing capacity in this configuration derives from skin friction along the helix plus end-bearing at the tip — see [citation] for the governing equation.',
      },
      {
        heading: 'What this changes on site',
        text: 'No cure time means no waiting. The structure can load the foundation within hours of installation, not weeks.',
      },
    ],
  },
  {
    slug: 'reading-a-soil-report-in-five-minutes',
    title: 'Reading a soil report in five minutes',
    dek: "What actually matters on a geotechnical report when you're speccing PEN.",
    category: 'Research',
    author: '[Author]',
    date: '[Date]',
    readTime: '4 min',
    cover: 'SOIL SECTION · ANNOTATED',
    body: [
      {
        heading: 'Start with the strata, not the summary',
        text: 'The executive summary tells you the site is buildable. The strata table tells you where the nails will actually lock in.',
      },
      {
        heading: 'Three numbers worth circling',
        text: 'SPT blow count at target depth, groundwater level, and any fill layer thickness — these three numbers decide nail length and angle more than anything else in the report.',
      },
    ],
  },
  {
    slug: 'concrete-is-a-carbon-problem',
    title: 'Concrete is a carbon problem hiding in the ground',
    dek: 'Foundations are invisible, which is exactly why their footprint gets ignored.',
    category: 'Sustainability',
    author: '[Author]',
    date: '[Date]',
    readTime: '5 min',
    cover: 'CONCRETE VOLUME · COMPARISON',
    body: [
      {
        heading: "Nobody audits what they can't see",
        text: 'A foundation disappears under a slab on day one. That invisibility is exactly why its concrete and carbon footprint rarely gets scrutinized the way a facade or a roof does.',
      },
      {
        heading: 'The number that matters',
        text: 'Roughly 80% less concrete per foundation point translates directly into avoided embodied carbon — before any operational-efficiency argument even enters the conversation.',
      },
    ],
  },
];
