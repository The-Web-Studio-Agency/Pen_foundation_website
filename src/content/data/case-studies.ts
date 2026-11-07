/**
 * Long-form case studies — projects with a full written story, photographs,
 * test data and drawings. A project in `PROJECTS` whose slug appears here gets
 * the story page instead of the short case-study template.
 *
 * SOURCE: the client's case-study artifacts (C-DISC), received November
 * 2026 — Black Langur and Devagiri Library. Copy, figures, captions and test
 * readings are transcribed from them; nothing is added. Their internal notes
 * are kept as comments where they matter (sign-off items), not shown on the
 * page. Sections a study doesn't have (a load chart, a video) are optional.
 */

const BL = '/media/projects/black-langur';

export interface StoryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Drawings sit on white and are never cropped. */
  drawing?: boolean;
}

export interface StoryCompare {
  before: StoryImage & { label: string };
  after: StoryImage & { label: string };
  caption: string;
  /** CSS aspect-ratio of the frame; 4 / 3 when unset. */
  aspect?: string;
}

export interface CaseStory {
  slug: string;
  name: string;
  /** SEO title / description. */
  seoTitle: string;
  seoDescription: string;
  crumb: { sector: string; place: string };
  hero: {
    title: string;
    dek: string;
    image: StoryImage;
    badge: { stamp: string; title: string; body: string };
  };
  /** The numbers bar under the hero. */
  stats: { value: string; label: string }[];
  intro: { lede: string; paragraphs: string[] };
  glance: {
    heading: string;
    rows: { label: string; value: string }[];
    badge: { stamp?: string; title: string; body: string };
    cta: { label: string; href: string };
    sheetLink: string;
  };
  constraint: {
    kicker: string;
    heading: string;
    before: string[];
    figure?: StoryImage;
    after?: string;
    pull: { quote: string; source: string };
    /** Before/after slider, shown after the pull quote. */
    compare?: StoryCompare;
  };
  solution: {
    kicker: string;
    heading: string;
    paragraphs: string[];
    compare?: StoryCompare;
    sequence: {
      heading: string;
      tag: string;
      steps: { title: string; body: string }[];
      /** Bar length in percent; `value` is the label (defaults to "{percent}%"). */
      meters: { label: string; percent: number; pen: boolean; value?: string }[];
    };
    gallery?: StoryImage[];
  };
  proof?: {
    kicker: string;
    heading: string;
    body: string;
    chart: {
      title: string;
      source: string;
      caption: string;
      /** [load kN/m², settlement mm] readings from the two plate load tests. */
      withPen: [number, number][];
      withoutPen: [number, number][];
      initialLoad: number;
    };
    results: { title: string; body: string }[];
  };
  system: {
    kicker: string;
    heading: string;
    body: string;
    points: { title: string; body: string }[];
  };
  video?: {
    src: string;
    poster: string;
    title: string;
    meta: string;
    label: string;
    chapters: { time: number; stamp: string; label: string }[];
  };
  result: {
    kicker: string;
    heading: string;
    paragraphs: string[];
    quote?: { quote: string; source: string };
  };
  roles: {
    kicker: string;
    heading: string;
    tabs: { id: string; label: string; heading: string; points: string[]; image: StoryImage }[];
  };
  evidence: {
    kicker: string;
    heading: string;
    body: string;
    items: { title: string; body: string }[];
  };
  bigger: { kicker: string; heading: string; paragraphs: string[] };
  faq: { kicker: string; heading: string; items: { q: string; a: string }[] };
  sheet: {
    kicker: string;
    heading: string;
    lead: string;
    header: string[];
    rows: { label: string; value: string }[];
    drawings: StoryImage[];
    cta: { label: string; href: string };
  };
  close: { heading: string; body: string; cta: { label: string; href: string } };
}

const ASSESS = '/contact#contact-form';

const photo = {
  forest: {
    src: `${BL}/forest.jpg`,
    alt: 'Wooded Black Langur site in Wayanad on plate load test day, trees standing around the test pit',
    width: 1600,
    height: 1200,
  },
  building: {
    src: `${BL}/video_poster.jpg`,
    alt: 'Black Langur building under construction with trees standing beside its walls',
    width: 848,
    height: 478,
  },
  install2: {
    src: `${BL}/inst_2.jpg`,
    alt: 'Crew driving PEN nails through a precast node next to a standing tree trunk, Wayanad, 3 March 2025',
    width: 960,
    height: 1280,
  },
  planTrees: {
    src: `${BL}/plan_trees.jpg`,
    alt: 'Cluster-1 foundation plan showing two existing trees with floor cutouts and PEN foundations placed beside them',
    width: 1158,
    height: 509,
    drawing: true,
  },
  dials: {
    src: `${BL}/pl_dials.jpg`,
    alt: 'Dial gauges and hydraulic jack on the plate load test',
    width: 867,
    height: 1156,
  },
} satisfies Record<string, StoryImage>;

export const blackLangur: CaseStory = {
  slug: 'black-langur-retreat',
  name: 'Black Langur Retreat Centre',
  seoTitle: 'Black Langur Retreat — a 25,000 sq ft forest retreat, no tree cut',
  seoDescription:
    "No tree cut: PEN Foundation's zero-excavation nail foundation carried a 25,000 sq ft forest retreat in Wayanad. Plate load test: 8.05 mm vs 41.96 mm settlement at 306 kN/m².",
  crumb: { sector: 'Hospitality', place: 'Kalpetta, Wayanad' },

  hero: {
    title: 'A 25,000 sq ft retreat. Not one tree cut.',
    dek: 'Black Langur is a retreat centre in the forests of Wayanad. Its foundations went in beside living trees, with no excavated pits and no felling. A jackfruit tree still stands next to the building.',
    image: photo.forest,
    badge: {
      stamp: 'No tree cut',
      title: '25,000 sq ft. Zero trees cut.',
      body: 'Foundations placed around the forest, not through it',
    },
  },

  // SIGN-OFF (from the source): the PEN point count reads 200+ per the
  // brochure but the BOQ shows 156; 25,000 sq ft and zero trees cut need
  // client and C-DISC sign-off before launch.
  stats: [
    { value: '25,000', label: 'Sq ft retreat centre' },
    { value: '0', label: 'Trees cut' },
    { value: '200+', label: 'PEN points' },
    { value: '81%', label: 'Less settlement at 306 kN/m²' },
    { value: '2.2×', label: 'Test load carried' },
  ],

  intro: {
    lede: 'The trees were there first. The building had to find its place between them.',
    paragraphs: [
      'Black Langur sits in Kalpetta, Wayanad, on land that is still forest: tall areca palms, old hardwoods, coffee and pepper growing in their shade. The brief was a 25,000 sq ft retreat centre. The condition was that the forest stays.',
      'On most sites, that condition fails at the foundation. A conventional footing needs a pit for every column. Each pit is dug wider than the footing, roots in the way are cut, spoil is piled on the ground around it, and concrete cures for weeks. Near a tree, that is how the tree is lost, even when nobody plans to fell it.',
      'So the foundation had to be one that could stand next to a trunk without digging under it.',
    ],
  },

  glance: {
    heading: 'Black Langur Retreat Centre',
    rows: [
      { label: 'Type', value: 'Forest retreat centre' },
      { label: 'Location', value: 'Kalpetta, Wayanad, Kerala' },
      { label: 'Built-up area', value: 'About 25,000 sq ft' },
      { label: 'Blocks', value: 'Clusters, staff quarters, family quarters' },
      { label: 'Foundation', value: 'PEN points tied by plinth beams' },
      { label: 'Trees cut', value: '0' },
      { label: 'Load test', value: '8.05 mm vs 41.96 mm at 306 kN/m²' },
      { label: 'Installed', value: 'From March 2025' },
      { label: 'Status', value: 'Under construction' },
    ],
    badge: {
      title: 'Built around the forest',
      body: 'A jackfruit tree stands beside the building',
    },
    cta: { label: 'Check PEN for my site', href: ASSESS },
    sheetLink: 'See the technical data sheet',
  },

  constraint: {
    kicker: 'The constraint',
    heading: 'A forest site, and a promise to keep it',
    before: [
      'The architects drew the plan around the trees. On the Cluster-1 foundation plan, two trees are drawn in at the entrance foyer and the verandah, each with a cutout in the floor so it can keep growing through the building.',
    ],
    figure: {
      ...photo.planTrees,
      caption:
        'From the Cluster-1 foundation plan. Two trees kept inside the building, each with a cutout. PEN foundations (blue labels) sit right beside them.',
    },
    after:
      'Drawing a tree into a plan is the easy part. Keeping it alive through construction is not. Every point near a trunk had to be a point that needed no pit.',
    pull: {
      quote: 'No pits beside the trunks. No roots cut. No trees felled.',
      source: 'The brief, in three lines',
    },
  },

  solution: {
    kicker: 'The PEN solution',
    heading: 'Nails, not pits',
    paragraphs: [
      'PEN Foundation is a patented, zero-excavation foundation. A precast node sits at ground level and four galvanised steel nails, tipped with tungsten carbide, are driven through it into the soil at a batter, then grouted. The nails spread load into a wide volume of soil, while the footprint at the surface stays about the size of the node.',
      'That small footprint is what made Black Langur possible. A crew can set a node within reach of a trunk, drive the nails, and leave the ground around the tree as it was. There is no curing period, so each point is ready for the plinth beam as soon as installation and checks are complete.',
    ],
    compare: {
      before: { ...photo.install2, label: 'Installation, Mar 2025' },
      after: { ...photo.building, label: 'The building' },
      caption:
        'Drag to compare. Left: nails going in beside a standing trunk. Right: the building, with its trees still beside the walls.',
    },
    sequence: {
      heading: 'One PEN point, beside one tree.',
      tag: 'Sequence · Black Langur',
      steps: [
        { title: 'Set out', body: 'Point marked clear of the trunk' },
        { title: 'Place node', body: 'Precast node set at ground level' },
        { title: 'Drive', body: 'Four nails per node, at a batter' },
        { title: 'Grout and check', body: 'Grouted, then quality sign-off' },
        { title: 'Tie', body: 'Plinth beam links the points' },
        { title: 'Build', body: 'Walls rise, the tree stays' },
      ],
      meters: [
        { label: 'Cement, PEN', percent: 6, pen: true },
        { label: 'Cement, conventional', percent: 100, pen: false },
        { label: 'Water, PEN', percent: 4, pen: true },
        { label: 'Water, conventional', percent: 100, pen: false },
      ],
    },
    gallery: [
      {
        src: `${BL}/inst_1.jpg`,
        alt: 'Worker driving a PEN nail with the node beside a tree trunk',
        width: 960,
        height: 1280,
        caption: "Driving a nail, trunk at arm's length",
      },
      {
        src: `${BL}/inst_3.jpg`,
        alt: 'Crew installing a PEN node on a cleared Wayanad plot with trees behind',
        width: 960,
        height: 1280,
        caption: 'Four nails, one node, no pit',
      },
      {
        src: `${BL}/pl_truss.jpg`,
        alt: 'Plate load test reaction truss over a test pit in the forest',
        width: 1600,
        height: 1200,
        caption: 'Load test set up among the trees',
      },
    ],
  },

  proof: {
    kicker: 'The proof',
    heading: 'Tested on this soil, before the first wall',
    body: 'A forest site gives you soft, root-laced topsoil and little room for heavy equipment. Before construction, C-DISC commissioned plate load tests on the Black Langur soil at MatterLab, an NABL-accredited laboratory, to IS 1888:1982. One test loaded the natural soil. The other loaded the soil with PEN.',
    chart: {
      title: 'Load against settlement',
      source: '300 mm plate · MatterLab, NABL TC-10743 · December 2024',
      caption:
        'Drag the load. The natural soil test ended at 306 kN/m² with 41.96 mm settlement. With PEN, settlement at the same load was 8.05 mm, and the test continued to 667 kN/m².',
      withPen: [
        [0, 0],
        [28, 0.04],
        [56, 0.43],
        [83, 0.9],
        [111, 1.87],
        [139, 2.65],
        [167, 3.65],
        [194, 4.89],
        [222, 5.68],
        [250, 6.58],
        [278, 7.14],
        [306, 8.05],
        [333, 9.42],
        [361, 10.87],
        [389, 12.4],
        [417, 13.51],
        [444, 14.84],
        [472, 16.14],
        [500, 17.78],
        [528, 19.43],
        [556, 21.18],
        [583, 23.61],
        [611, 25.07],
        [639, 26.8],
        [667, 30.06],
      ],
      withoutPen: [
        [0, 0],
        [28, 0.41],
        [56, 1.27],
        [83, 1.89],
        [111, 2.73],
        [139, 3.87],
        [167, 5.7],
        [194, 7.36],
        [222, 11.14],
        [250, 22.38],
        [278, 29.11],
        [306, 41.96],
      ],
      initialLoad: 306,
    },
    results: [
      {
        title: '81% less settlement',
        body: 'At 306 kN/m², 8.05 mm with PEN against 41.96 mm without.',
      },
      {
        title: '2.2× the test load',
        body: 'The PEN test reached 667 kN/m², against 306 kN/m² for the natural soil, and still settled less: 30.06 mm.',
      },
      {
        title: 'A curve that stays smooth',
        body: 'Without PEN, settlement jumps from 11 mm to 22 mm between 222 and 250 kN/m². With PEN, it climbs steadily all the way.',
      },
    ],
  },

  system: {
    kicker: 'The system',
    heading: 'A forest plan, tied together',
    body: 'Black Langur is laid out as clusters, staff quarters and family quarters spread through the trees. In each block, PEN points sit at column and wall junctions and a reinforced plinth beam ties them into one frame. TMT bars welded to each node top lock the PEN point into the beam, and rubber caps protect the nail heads.',
    points: [
      {
        title: 'PEN where the trees are',
        body: 'Points placed close to trunks and inside the cutouts, where a pit would have cut roots.',
      },
      {
        title: 'Plinth beams',
        body: '150 x 300 mm and 150 x 600 mm beams link the points in the family quarters, so the group acts together.',
      },
      {
        title: 'Designed per block',
        body: 'Each block has its own foundation plan. Where the design calls for it, conventional footings work alongside PEN in the same layout.',
      },
    ],
  },

  video: {
    src: `${BL}/site-walk.mp4`,
    poster: `${BL}/video_poster.jpg`,
    title: 'Watch: the building, and the trees beside it',
    meta: 'Site walk · 10 s',
    label: 'Walk past the Black Langur building and the trees beside it',
    chapters: [
      { time: 0, stamp: '0:00', label: 'The forest site' },
      { time: 3.5, stamp: '0:03', label: 'Trees at the walls' },
      { time: 7, stamp: '0:07', label: 'The building today' },
    ],
  },

  // Source note: a short client quote on why keeping the trees mattered is
  // pending approval (name and role). Add it here once received.
  result: {
    kicker: 'The result',
    heading: 'A retreat that still looks like a forest',
    paragraphs: [
      'The building rose between its trees instead of in a clearing. Walk past it today and the trunks are still at the walls, the canopy still over the roof, and a jackfruit tree still stands next to the building it could easily have made way for.',
      'For a retreat, that is the product. Guests come to Wayanad for the forest. Black Langur kept it.',
    ],
  },

  roles: {
    kicker: 'For your project',
    heading: 'What Black Langur means for you',
    tabs: [
      {
        id: 'developer',
        label: 'Resort developer',
        heading: 'Keep the view you bought the land for.',
        points: [
          'Build among mature trees without felling them',
          'No pits, no spoil heaps, no weeks of curing',
          'Less clearing means less to landscape back later',
        ],
        image: { ...photo.building, alt: 'Black Langur building among trees' },
      },
      {
        id: 'architect',
        label: 'Architect',
        heading: 'Draw the tree in. The foundation follows.',
        points: [
          'Cutouts around trunks at the foyer and verandah',
          'PEN points placed beside the cutouts',
          'A small surface footprint, so the plan can hug the trees',
        ],
        image: { ...photo.planTrees, alt: 'Plan detail with tree cutouts' },
      },
      {
        id: 'engineer',
        label: 'Structural engineer',
        heading: 'Numbers from this soil.',
        points: [
          'Plate load test, IS 1888:1982, NABL-accredited lab',
          '8.05 mm with PEN vs 41.96 mm without, at 306 kN/m²',
          'PEN test continued to 667 kN/m²',
          'Plinth beam schedule and node detail in the data sheet',
        ],
        image: photo.dials,
      },
      {
        id: 'sustainability',
        label: 'Sustainability lead',
        heading: 'Trees standing. Less concrete in the ground.',
        points: [
          'Zero trees cut on a 25,000 sq ft project',
          '94% less cement and 96% less water than a conventional footing',
          'Over 1.5 tonnes lower carbon for every 1,000 sq ft built; GRIHA listed',
        ],
        image: { ...photo.forest, alt: 'Forest at the Black Langur site' },
      },
    ],
  },

  evidence: {
    kicker: 'The evidence',
    heading: 'Why engineers can trust a foundation without a pit',
    body: 'Leaving the forest standing is only useful if the building above it is safe. Every PEN project is designed for its own soil and loads. At Black Langur that meant site plate load tests, block-by-block foundation plans, and drawings a consultant can check.',
    items: [
      { title: 'NABL-accredited labs', body: "Plate load tests on this site's soil" },
      { title: 'PLAXIS', body: 'Geotechnical simulation studies' },
      { title: 'ANSYS', body: 'Structural finite element analysis' },
      { title: 'NIT Calicut, IIT Kanpur', body: 'Academic validation of the system' },
    ],
  },

  bigger: {
    kicker: 'The bigger picture',
    heading: 'A sustainable foundation, measured in trees',
    paragraphs: [
      'C-DISC Technologies is reinventing construction from its first point: the foundation. PEN Foundation installs in hours instead of weeks, uses 94% less cement and 96% less water than a conventional footing, and cuts carbon by over 1.5 tonnes for every 1,000 sq ft built.',
      'Black Langur adds one more number to that list. On eco-resorts, hill sites and wooded plots, the greenest foundation may be the one that lets you keep what is already growing.',
    ],
  },

  faq: {
    kicker: 'Questions',
    heading: 'Frequently asked',
    items: [
      {
        q: 'Can you build a foundation next to a tree without cutting it?',
        a: 'Yes, for suitable low-rise structures. PEN needs no footing pit, so a point can be placed close to a trunk without digging out the soil and roots around it. At Black Langur, foundations for a 25,000 sq ft retreat went in with no trees cut.',
      },
      {
        q: 'What is a zero-excavation foundation?',
        a: 'A foundation installed from the surface with no pit. In PEN, four steel nails are driven at a batter through a precast node and grouted. There is no excavation and no curing period.',
      },
      {
        q: 'How strong is PEN on soft forest soil?',
        a: 'On the Black Langur soil, a plate load test with PEN settled 8.05 mm at 306 kN/m², against 41.96 mm for the natural soil, and continued to 667 kN/m². Tests were done by an NABL-accredited laboratory to IS 1888:1982.',
      },
      {
        q: 'Is PEN suitable for resorts and eco-tourism projects?',
        a: 'Yes. Cottages, villas, staff housing and clusters up to G+2 suit PEN after a review of soil, loads and site. It is well suited to wooded, sloping and sensitive sites.',
      },
      {
        q: 'Is PEN a sustainable foundation?',
        a: 'PEN uses 94% less cement and 96% less water than a conventional footing, avoids excavation, and is GRIHA listed. On sites like Black Langur, it also means trees do not have to go.',
      },
      {
        q: 'Can PEN work with conventional footings?',
        a: 'Yes. Each block is designed on its own, and PEN can sit in the same layout as conventional footings, tied together by plinth beams.',
      },
    ],
  },

  sheet: {
    kicker: 'For engineers',
    heading: 'Technical data sheet',
    lead: 'The parameters behind the story, for consultants and reviewers who want to check the design.',
    header: ['Project record · Black Langur', 'Kalpetta, Wayanad', 'Ref: FC-40/24-KPT'],
    rows: [
      { label: 'Project', value: 'Forest retreat centre, about 25,000 sq ft' },
      { label: 'Blocks', value: 'Cluster buildings, staff quarters, family quarters' },
      {
        label: 'Foundation',
        value:
          'PEN points; precast node with 4 battered galvanised steel nails (40 dia x 2 mm), tungsten carbide tipped, grouted',
      },
      {
        label: 'Node connection',
        value: 'TMT bars welded to node top, cast into plinth beam; rubber caps',
      },
      { label: 'Plinth beams', value: 'PB-1 150 x 300 mm; PB-2 150 x 600 mm (family quarters)' },
      {
        label: 'Conventional footings',
        value: 'F1 1200 x 1200 x 400 mm; F2 1500 x 1500 x 400 mm, where specified (Cluster-1)',
      },
      {
        label: 'Trees retained',
        value: 'All; floor cutouts around trunks at foyer and verandah (Cluster-1)',
      },
      {
        label: 'Load test standard',
        value: 'IS 1888:1982, 300 mm plate, hydraulic jack with kentledge reaction',
      },
      { label: 'Test laboratory', value: 'MatterLab, Kozhikode; NABL TC-10743' },
      { label: 'Natural soil', value: '41.96 mm at 306 kN/m² (test end)' },
      { label: 'Soil with PEN', value: '8.05 mm at 306 kN/m²; 30.06 mm at 667 kN/m² (test end)' },
      { label: 'Installation', value: 'From March 2025; no curing period' },
      {
        label: 'PEN validation',
        value: 'NIT Calicut and IIT Kanpur; PLAXIS and ANSYS studies; GRIHA listed',
      },
    ],
    drawings: [
      {
        src: `${BL}/plan_cluster1.jpg`,
        alt: 'Cluster-1 footing plan with PEN foundations, conventional footings and tree cutouts',
        width: 1700,
        height: 1533,
        caption:
          'Cluster-1 footing plan. PEN points in blue, tree cutouts at the foyer and verandah.',
        drawing: true,
      },
      {
        src: `${BL}/plan_family.jpg`,
        alt: 'Family quarters plinth beam plan with eight PEN foundations',
        width: 1700,
        height: 944,
        caption: 'Family quarters plinth beam plan',
        drawing: true,
      },
      {
        src: `${BL}/plan_node.jpg`,
        alt: 'Section through PEN foundation with plinth beam, TMT bars and battered nails',
        width: 903,
        height: 702,
        caption: 'PEN point and plinth beam section',
        drawing: true,
      },
    ],
    cta: { label: 'Request the drawings', href: ASSESS },
  },

  close: {
    heading: 'Building on land you would rather not clear?',
    body: 'Send us your location, drawings and soil data. Our engineers will tell you whether PEN Foundation fits, and how close to your trees it can go.',
    cta: { label: 'Request a Project Assessment', href: ASSESS },
  },
};

const DV = '/media/projects/devagiri';

const dv = {
  night: {
    src: `${DV}/dsc00142.jpg`,
    alt: 'Devagiri Library book tower lit at night, built on PEN Foundation installed in one day',
    width: 1600,
    height: 1067,
  },
  // Single photos cut from the source's photo sheets (plan_install.jpg,
  // plan_interior.jpg), so the slider compares one shot with one shot.
  install: {
    src: `${DV}/install-crop.jpg`,
    alt: 'PEN Foundation installation inside the working Devagiri library, shelves in place around the work',
    width: 480,
    height: 608,
  },
  towerEntrance: {
    src: `${DV}/interior-crop.jpg`,
    alt: 'Finished Devagiri book tower with steel spiral stair and shelving',
    width: 586,
    height: 780,
  },
  interior: {
    src: `${DV}/plan_interior.jpg`,
    alt: 'Finished Devagiri book tower with steel spiral stair and shelving',
    width: 1228,
    height: 844,
    drawing: true,
  },
  stair: {
    src: `${DV}/dsc08810.jpg`,
    alt: 'Steel spiral stair rising through the plywood shelving of the Devagiri book tower',
    width: 1067,
    height: 1600,
  },
  readers: {
    src: `${DV}/readers.jpg`,
    alt: 'Students reading on the spiral stair',
    width: 1067,
    height: 1600,
  },
  section: {
    src: `${DV}/plan_section.jpg`,
    alt: 'Section A-A through the book tower showing PEN foundations',
    width: 947,
    height: 1390,
    drawing: true,
  },
  aerial: {
    src: `${DV}/aerial.jpg`,
    alt: 'Devagiri library and campus from above',
    width: 1600,
    height: 1067,
  },
} satisfies Record<string, StoryImage>;

export const devagiri: CaseStory = {
  slug: 'devagiri-library-book-tower',
  name: 'Devagiri Library Book Tower',
  seoTitle: 'Devagiri Library — a foundation in 1 day, a library that never closed',
  seoDescription:
    "Foundation in 1 day: five PEN points carry a 10 m steel book tower inside the working library of St. Joseph's College, Devagiri, Kozhikode. No footing pits, no curing, the library never closed. SSMB Award 2024.",
  crumb: { sector: 'Institutional', place: 'Kozhikode, Kerala' },

  hero: {
    title: 'Foundation in 1 day. A library that never closed.',
    dek: "Five PEN points carry a 10 m steel book tower inside the working library of St. Joseph's College, Devagiri. Installed in one day, without breaking its floor.",
    image: dv.night,
    badge: {
      stamp: 'SSMB Award 2024',
      title: 'Best Built Steel Structure',
      body: 'Chosen over a project by a ₹7,000 crore group',
    },
  },

  stats: [
    { value: '1 day', label: 'Foundation installed' },
    { value: '5', label: 'PEN points' },
    { value: '~10 m', label: 'Book tower, G+2' },
    { value: '0', label: 'Footing pits dug' },
    { value: '0', label: 'Days the library closed' },
  ],

  intro: {
    lede: 'The library had to stay open. That was the condition before a single line was drawn.',
    paragraphs: [
      "St. Joseph's College (Autonomous), Devagiri, wanted a book tower inside its library: a 10 m, G+2 structure wrapped around a steel spiral stair, lined with shelves, made for students to climb, sit and read in. They also wanted to keep the floor it would stand on.",
      'That floor is vacuum dewatered. The water is drawn out of the concrete while it is fresh, the surface is power floated, and what is left is dense, flat and laid once. Break it and the patch never matches again.',
      'So the foundation had to go in without pits, without a month of curing, and without taking the reading room out of use. It went in in one day.',
    ],
  },

  glance: {
    heading: 'Devagiri Library Book Tower',
    rows: [
      { label: 'Client', value: "St. Joseph's College (Autonomous), Devagiri" },
      { label: 'Location', value: 'Kozhikode, Kerala' },
      { label: 'Architect', value: 'Elansa Design Studio' },
      { label: 'Structure', value: 'Steel book tower and spiral stair, G+2, ~10 m' },
      { label: 'Foundation', value: '5 PEN points' },
      { label: 'Installed in', value: '1 day' },
      { label: 'Soil SBC', value: '>200 kN/m²' },
      { label: 'Existing floor', value: 'Vacuum dewatered, retained' },
      { label: 'Library closed', value: '0 days' },
    ],
    badge: { stamp: 'SSMB 2024', title: 'Best Built Steel Structure', body: 'SSMB Award 2024' },
    cta: { label: 'Check PEN for my project', href: ASSESS },
    sheetLink: 'See the technical data sheet',
  },

  constraint: {
    kicker: 'The constraint',
    heading: 'A working library, and a floor that could not be broken',
    before: [
      'Five steel columns would carry the tower. With conventional isolated footings, that meant five pits cut through the floor, spoil carried out between the shelves, reinforcement and wet concrete on site, and a 21-day cure before anything could stand on them. End to end, 30 to 40 days of a closed, noisy zone in the middle of the library.',
      'The college did not want that. Their architects, Elansa Design Studio, did not want it either. The answer had to come from the foundation.',
    ],
    pull: {
      quote: 'No footing pits. No curing. No day the library was closed.',
      source: 'The brief, in three lines',
    },
    compare: {
      before: { ...dv.install, label: 'Installation day' },
      after: { ...dv.towerEntrance, label: 'Today' },
      // Both shots are upright; a landscape frame would crop them to the floor.
      aspect: '4 / 5',
      caption:
        'Drag to compare. The same room, the same shelves. Only a narrow strip was opened for the plinth beam.',
    },
  },

  solution: {
    kicker: 'The PEN solution',
    heading: 'Five points, one day',
    paragraphs: [
      'PEN Foundation is a patented, zero-excavation foundation. A precast node sits at ground level and four engineered steel nails are driven through it into the soil at a batter, then grouted. The nails engage a volume of soil much wider than the node, and the point carries load as soon as installation and checks are complete. There is no pit and no curing cycle.',
      'Site investigation at Devagiri found soil bearing capacity above 200 kN/m². With five columns coming down to support the tower, we designed five PEN points, one under each column, set out on the semicircular arc of the stair. Before any cut, the existing slab was scanned with non-destructive testing to locate its reinforcement.',
    ],
    sequence: {
      heading: 'Five foundations. One working day.',
      tag: 'Day 1 · Devagiri Library',
      steps: [
        { title: 'Set out', body: 'Five points marked on the stair arc' },
        { title: 'Scan', body: 'NDT scan of the slab for rebar' },
        { title: 'Open strip', body: 'Narrow cut for the plinth beam only' },
        { title: 'Drive', body: 'Four nails per node, at a batter' },
        { title: 'Grout and check', body: 'Non-shrink grout, quality sign-off' },
        { title: 'Hand over', body: 'Ready for plinth beam and steel' },
      ],
      meters: [
        { label: 'PEN at Devagiri', percent: 3, pen: true, value: '1 day' },
        { label: 'Conventional footing', percent: 100, pen: false, value: '30 to 40 days' },
      ],
    },
    // The source's three "short clip" tiles; the clips themselves weren't
    // supplied, so their stills and titles are shown as photos.
    gallery: [
      { ...dv.install, caption: 'Installing PEN inside the library' },
      { ...dv.stair, caption: 'Factory steel, bolted on site' },
      { ...dv.readers, caption: 'The tower in use' },
    ],
  },

  system: {
    kicker: 'The system',
    heading: 'A fast foundation needs a structure built for speed',
    body: 'A one-day foundation only helps if the rest of the building is designed to keep up. Devagiri was planned that way from the top down.',
    points: [
      {
        title: 'A light tower',
        body: 'Steel frame with plywood shelving. Keeping the superstructure light kept the foundation loads modest.',
      },
      {
        title: 'An all-steel spiral stair',
        body: 'The stair turns around its own central shaft column, on its own foundation.',
      },
      {
        title: 'Floor ties at every level',
        body: 'The tower connects to the existing building at each floor. Lateral load leaves at each level, so the moment reaching the base stays small.',
      },
      {
        title: 'One plinth beam for the group',
        body: 'A 250 x 450 mm plinth beam ties all five PEN points and the stair shaft foundation together, so six supports act as one. TMT bars welded to each node top lock it into the beam.',
      },
      {
        title: 'Factory-made steel',
        body: 'All steel was pre-engineered and fabricated in the factory, then bolted up on site. Columns land on the PEN nodes through anchor bolts.',
      },
    ],
  },

  // Source note: the site film (chapters, clips, transcript) is still to be
  // supplied. Add `video` here once it is.

  result: {
    kicker: 'The result',
    heading: 'Built fast, built clean, built around its readers',
    paragraphs: [
      'The library stayed open throughout. The floor around the tower is the floor the college laid. The tower went up on steel made in a factory and bolted to foundations that were ready the day they went in.',
      'In 2024 the project received the SSMB Award for Best Built Steel Structure, competing against a project by a ₹7,000 crore group. The award recognises the whole team: the college, Elansa Design Studio and the steel contractors. PEN is the foundation under it.',
    ],
    quote: {
      quote:
        'The planning of every aspect combined with effective site management enabled swift completion in under a year.',
      source: 'Karan J Fraanc, Elansa Design Studio, in SSMB',
    },
  },

  roles: {
    kicker: 'For your project',
    heading: 'What Devagiri means for you',
    tabs: [
      {
        id: 'architect',
        label: 'Architect',
        heading: 'Design the space. The foundation fits the plan.',
        points: [
          'Five points followed a semicircular arc around a spiral stair',
          'No pits, so shelving and finishes around the work stayed in place',
          'A light steel and plywood tower, quick to erect',
        ],
        image: { ...dv.interior, alt: 'Interior of the Devagiri book tower' },
      },
      {
        id: 'engineer',
        label: 'Structural engineer',
        heading: 'A load path you can check.',
        points: [
          'Soil bearing capacity above 200 kN/m²; 5 PEN points, 4 battered nails each',
          'Plinth beam 250 x 450 mm ties the PEN group and the stair shaft foundation',
          'Floor ties at each level limit the base moment',
          'Full parameters in the data sheet below',
        ],
        image: {
          ...dv.section,
          alt: 'Section through the book tower showing PEN nails below ground',
        },
      },
      {
        id: 'facility',
        label: 'Campus or facility manager',
        heading: 'Keep the building running.',
        points: [
          'Library open every day of the work',
          'Foundation finished in one day',
          'Existing vacuum dewatered floor retained',
          'No spoil, no curing water, no month of noise',
        ],
        image: dv.readers,
      },
      {
        id: 'sustainability',
        label: 'Sustainability lead',
        heading: 'Less concrete in the ground.',
        points: [
          '94% less cement and 96% less water than a conventional footing',
          'Over 1.5 tonnes lower carbon for every 1,000 sq ft built',
          'Factory-made, recoverable components; GRIHA listed',
        ],
        image: dv.aerial,
      },
    ],
  },

  evidence: {
    kicker: 'The evidence',
    heading: 'Why engineers can trust a foundation in one day',
    body: 'Speed is only useful if the numbers behind it hold. Every PEN project is designed for its own soil and loads before a single nail is driven. At Devagiri that meant a site investigation, a full load path from shelf to soil, and a drawing your consultant can check.',
    items: [
      { title: 'NABL-accredited labs', body: 'Tested across different soils' },
      { title: 'PLAXIS', body: 'Geotechnical simulation studies' },
      { title: 'ANSYS', body: 'Structural finite element analysis' },
      { title: 'NDT', body: 'Validated through non-destructive testing' },
    ],
  },

  bigger: {
    kicker: 'The bigger picture',
    heading: 'A new-generation foundation, and a sustainable one',
    paragraphs: [
      'C-DISC Technologies is reinventing construction from its first point: the foundation. PEN Foundation installs in hours instead of 30 to 40 days, uses 94% less cement and 96% less water than a conventional footing, and cuts carbon by over 1.5 tonnes for every 1,000 sq ft built, while leaving the site largely as it was found.',
      'Devagiri shows what that means when the site is a building people are using. The fastest foundation was also the one with the least hassle.',
    ],
  },

  faq: {
    kicker: 'Questions',
    heading: 'Frequently asked',
    items: [
      {
        q: 'Can a foundation really be installed in one day?',
        a: 'Yes, for suitable low-rise structures. Each PEN point installs in hours. At Devagiri, all five points for a G+2 book tower were installed in one day, with no curing period afterwards.',
      },
      {
        q: 'How do you build a foundation inside an existing building without breaking the floor?',
        a: 'PEN needs no footing pit. Nails are driven from the surface through a precast node. At Devagiri the slab was scanned first, and only a narrow strip was opened for the plinth beam.',
      },
      {
        q: 'Is PEN suitable for steel structures?',
        a: "Yes. Steel columns bolt to the PEN node through anchor bolts. Devagiri's book tower and spiral stair are both steel.",
      },
      {
        q: 'Is PEN a sustainable foundation?',
        a: 'PEN uses 94% less cement and 96% less water than a conventional footing, avoids excavation, and is GRIHA listed.',
      },
      {
        q: 'What testing supports PEN?',
        a: 'Testing across different soils by NABL-accredited laboratories, PLAXIS and ANSYS simulation studies, and non-destructive testing. Each project is designed for its own soil and loads.',
      },
      {
        q: 'Which buildings can use PEN?',
        a: 'Suitable low-rise construction up to G+2, after a review of soil, loads and site. Taller structures are on the development roadmap.',
      },
    ],
  },

  sheet: {
    kicker: 'For engineers',
    heading: 'Technical data sheet',
    lead: 'The parameters behind the story, for consultants and reviewers who want to check the design.',
    header: [
      'Project record · Devagiri Book Tower',
      "St. Joseph's College, Devagiri",
      'Ref: GA14, Rev 00',
    ],
    rows: [
      { label: 'Structure', value: 'Book tower with steel spiral stair, G+2, about 10 m' },
      { label: 'Superstructure', value: 'Pre-engineered steel frame, plywood shelving' },
      { label: 'Columns on PEN', value: '5 steel columns on a semicircular arc' },
      { label: 'Stair', value: 'All-steel spiral on a central shaft column, own foundation' },
      { label: 'Soil bearing capacity', value: 'Above 200 kN/m² (site investigation)' },
      {
        label: 'Foundation',
        value:
          '5 PEN points; precast node with 4 battered galvanised nails, tungsten carbide tipped, grouted',
      },
      { label: 'Column connection', value: 'Foundation anchor bolts to PEN node' },
      {
        label: 'Tie system',
        value:
          'Plinth beam 250 x 450 mm, ring and radial, linking PEN group and stair shaft foundation; TMT bars welded to node top',
      },
      { label: 'Lateral system', value: 'Floor-level ties to existing frame at each storey' },
      {
        label: 'Existing floor',
        value: 'Vacuum dewatered floor retained; NDT scan before cutting; plinth-beam strip only',
      },
      { label: 'Installation time', value: '1 day for all 5 points; no curing period' },
      { label: 'Steel', value: 'Factory fabricated, site erected' },
      {
        label: 'PEN validation',
        value: 'NABL-accredited lab tests across soils; PLAXIS and ANSYS studies; NDT',
      },
      { label: 'Recognition', value: 'SSMB Award 2024, Best Built Steel Structure' },
    ],
    drawings: [
      {
        ...dv.section,
        caption: 'Section A-A. Nails shown at batter below ground level.',
      },
      {
        src: `${DV}/plan_top.jpg`,
        alt: 'PEN foundation plan with five nail foundations on the stair arc',
        width: 1123,
        height: 695,
        caption: 'PEN foundation plan',
        drawing: true,
      },
      {
        src: `${DV}/plan_detail.jpg`,
        alt: 'PEN foundation section detail with node, plinth beam and anchor bolt',
        width: 666,
        height: 968,
        caption: 'PEN foundation detail',
        drawing: true,
      },
    ],
    cta: { label: 'Request the drawings', href: ASSESS },
  },

  close: {
    heading: 'Building inside a site that cannot stop?',
    body: 'Send us your location, drawings and soil data. Our engineers will tell you whether PEN Foundation fits, and what it would take.',
    cta: { label: 'Request a Project Assessment', href: ASSESS },
  },
};

export const CASE_STORIES: CaseStory[] = [blackLangur, devagiri];

export const storyFor = (slug: string) => CASE_STORIES.find((s) => s.slug === slug);
