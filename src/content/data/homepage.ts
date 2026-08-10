import { partners } from '@/content/data/partners';
import type {
  ApplicationsContent,
  CalculatorContent,
  CapabilityStep,
  FaqContent,
  HeroContent,
  InActionContent,
  HomeFormContent,
  LogoWallContent,
  ProcessContent,
  ProductContent,
  ProofContent,
  SectionHeading,
  StatementContent,
  WhyPenContent,
} from '@/types/homepage';

/**
 * Home page copy. One module, because `arch:check`'s sibling rule for this
 * project is that marketing copy never lives in JSX — components consume
 * content, they do not carry it.
 *
 * SOURCING RULE. Every factual claim below is traceable to one of four
 * documents supplied by C-DISC Technologies:
 *
 *   BRIEF   fetch_data_from_docs/PEN_Foundation_Website_Brief.pdf
 *   BROCH   fetch_data_from_docs/Brochure CDISC.pdf
 *   DECK    fetch_data_from_docs/CDISC Technologies Pitch Deck.pdf
 *   GRIHA   public/media/documents/griha-certificate.pdf
 *
 * Claims are tagged with the source in a trailing comment wherever the number
 * or the institution matters. Nothing here may be invented, rounded or
 * upgraded: BRIEF states that the technical figures "must appear verbatim …
 * the development team must not paraphrase, estimate, or substitute these
 * values", and the institutional language is deliberately kept to what each
 * body actually did.
 *
 * Note on `/media/reference/*` — those files are UI inspiration screenshots of
 * an unrelated solar site, not PEN evidence. They are not a source.
 */

/* -------------------------------------------------------------------------- */
/* HERO                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The scrub script. Six beats, one per shot in hero.mp4.
 *
 * Previously LOCKED and four beats ("When was the last time a foundation
 * surprised you?" …). Ridha replaced the script on 2026-08-10; the lock is
 * lifted for the copy, and this is now the approved version.
 *
 * EACH ENTRY IS TIMED TO A SHOT, NOT JUST ORDERED. `HeroContent` gives every
 * entry an equal slice of the scrub and `HeroBackground` seeks the film off the
 * same progress value, so entry *n* is on screen during the *n*th sixth of the
 * footage. The beats below are written against those shots:
 *
 *   1  camera rotates around the node      the reveal
 *   2  exploded view                       why the parts are the parts
 *   3  nails drive into the soil           the objection being answered
 *   4  camera pulls back, one PEN → twenty scale
 *   5  building time-lapse                 time, which is the real product
 *   6  camera below grade, building above  the closing line
 *
 * Adding or removing a beat re-times all of them. The runway in `Hero.tsx`
 * scales off `sequence.length` so each keeps the same amount of scroll.
 *
 * NO FACTUAL CLAIMS HERE, deliberately — this is the argument, not the
 * evidence. Every number it implies (no curing, no excavation, ~2 hours) is
 * stated with its source further down the page, in `whyPen` and
 * `capabilitySteps`. Beat 3 says "No waiting weeks" rather than naming the
 * 21 days for that reason: the figure belongs where it can be cited.
 *
 * Lines are hand-broken. The reveal runs one continuous wave across the breaks,
 * so a break is a compositional choice, not a wrap.
 */
export const hero: HeroContent = {
  sequence: [
    { lines: ['Meet the future', 'of foundations.'] },
    { lines: ['Every component has one purpose.', 'Maximum strength.', 'Minimum complexity.'] },
    { lines: ['No excavation.', 'No concrete curing.', 'No waiting weeks.'] },
    { lines: ['Designed to scale.', 'From one home', 'to entire communities.'] },
    { lines: ["Because projects shouldn't", 'wait for foundations.'] },
    { lines: ["The future isn't built", 'from the top down.', 'It begins underground.'] },
  ],
  scrollLabel: 'Scroll to find out',
};

/* -------------------------------------------------------------------------- */
/* SUPPORTER WALL                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Every supporter that has a logo asset, as {src, alt} pairs.
 *
 * Derived from `partners` rather than listed again here: that module is already
 * the single source for the About supporter grid and the contact partner row,
 * and a third hand-maintained copy is how the old placeholder list drifted.
 * `flatMap` both filters out entries without an asset (GRIHA) and narrows
 * `logo` to a string, so no non-null assertion is needed.
 */
const supporterLogos = partners.flatMap((partner) =>
  partner.logo ? [{ src: partner.logo, alt: partner.fullName ?? partner.name }] : [],
);

/**
 * The heading used to say only that PEN was "supported by research" — true, but
 * it left the visitor to guess what twenty unfamiliar marks had to do with a
 * foundation. The note now says which kind of backing each mark represents, so
 * the wall reads as evidence rather than decoration.
 */
export const logoWall: LogoWallContent = {
  heading: 'Engineered. Tested. Supported.',
  // BROCH: "incubated at IIT Kanpur and NIT Calicut, and recognized by the
  // Kerala Startup Mission"; the brochure's own logo strip separates mentoring,
  // funding and partnerships, which is the distinction drawn here.
  note: 'Incubation, grant funding and research partnerships behind the pre-engineered nail foundation — from national institutes, government innovation programmes and climate funds.',
  // 20 cells over a shorter list, so each cell's two reel entries are always a
  // different mark — the offset is coprime with the list length.
  cells: Array.from({ length: 20 }, (_, index) => ({
    reel: [
      supporterLogos[index % supporterLogos.length],
      supporterLogos[(index + 5) % supporterLogos.length],
    ],
  })),
};

/* -------------------------------------------------------------------------- */
/* STATEMENT                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The old sentence described the mechanism ("load spread through friction")
 * but never named the thing it replaces, so the page moved from the hero
 * straight into an abstraction. This version states the conventional problem
 * first and lands on the PEN approach, which is the transition the section is
 * positioned to make.
 *
 * BRIEF: "eliminating the 21-day curing cycle that has defined foundation
 * construction for over a century" · "PEN transfers structural load through
 * four battered galvanized steel nails driven into the surrounding soil".
 */
export const statement: StatementContent = {
  before: 'For a century a foundation meant digging, pouring and waiting. PEN ',
  emphasis: 'drives four nails',
  after: ' instead — and carries the load the same day.',
};

/* -------------------------------------------------------------------------- */
/* WHY PEN                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Why PEN — the commercial case, stated in what it costs a project.
 *
 * Kept to a heading, a lead and a link because that is all the component
 * renders. The lead ends on a colon: the capability list immediately below is
 * the list this sentence promises, so the two read as one block.
 */
export const whyPen: WhyPenContent = {
  heading: 'Three weeks of your programme are spent waiting for concrete to cure',
  // BRIEF core-claims table: 21+ days including curing vs ~2 hours, no curing;
  // zero excavation; Enhancement Factor 2.0–2.6× SBC field-validated at NIT
  // Calicut. BRIEF: "eliminating 2–3 m³ of spoil disposal per foundation point".
  intro:
    'A cast-in-situ footing has to be dug, formed, poured and then left alone for 21 days before anything can be built on it — and each point displaces 2–3 m³ of spoil on the way. PEN Foundation is a patented alternative that is driven in about two hours, carries structural load immediately, and moves no soil at all. What that changes on a real project:',
  link: { label: 'Understand the engineering', href: '/engineering' },
};

/* -------------------------------------------------------------------------- */
/* CAPABILITIES                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The six claims, each with the media that carries it.
 *
 * Steps 1 and 3 now run the production clips shot on site in Kerala; the
 * remaining four keep their diagrams because no footage exists for them and a
 * diagram states a mechanism more clearly than a substitute photograph would.
 * Both clips carry their exported first frame as a poster, so an inactive
 * panel costs a still rather than a decoded stream.
 *
 * Titles are BRIEF's core claims and technical specification, unchanged.
 */
export const capabilitySteps: CapabilityStep[] = [
  {
    title: 'Installed in ~2 hours. No curing. Load-bearing immediately',
    media: {
      src: '/media/videos/capability-01.mp4',
      poster: '/media/images/homepage/capability-01-poster.webp',
      alt: 'Aerial view of a residential plot set out for foundation points, crew working across the site at dusk',
    },
  },
  {
    title: 'Zero excavation — soil stratification and groundwater flow preserved',
    media: {
      src: '/media/images/homepage/capability-02.svg',
      alt: 'Undisturbed ground around an installed foundation point',
    },
  },
  {
    title: 'Four battered GI nails transfer load through skin friction',
    media: {
      src: '/media/videos/capability-02.mp4',
      poster: '/media/images/homepage/capability-02-poster.webp',
      alt: 'An installed PEN node with its four battered nails in the ground, the structure it carries rising above',
    },
  },
  {
    title: 'Enhancement Factor of 2.0–2.6× SBC, field-validated at NIT Calicut',
    media: {
      src: '/media/images/homepage/capability-04.svg',
      alt: 'Plate load test results from field validation',
    },
  },
  {
    title: 'Governed by IS 2911 Part 4 — Factor of Safety 2.0–2.5',
    media: {
      src: '/media/images/homepage/capability-05.svg',
      alt: 'Engineering drawing annotated with the governing code',
    },
  },
  {
    title: 'Over 80% less concrete. Components recoverable at end of life',
    media: {
      src: '/media/images/homepage/capability-06.svg',
      alt: 'Material comparison against a conventional isolated footing',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* WHAT PEN IS — product explanation                                          */
/* -------------------------------------------------------------------------- */

/**
 * The section the page was missing: a visitor could tell PEN was *different*
 * without ever learning what it *is*.
 *
 * Every part specification is transcribed verbatim from BRIEF's technical
 * specification table. The comparison rows are BRIEF's "Three Core Claims",
 * which that document requires to appear unaltered.
 */
export const product: ProductContent = {
  id: 'technology',
  heading: 'One precast node. Four driven nails.',
  lead: 'PEN Foundation is a pre-engineered replacement for a cast-in-situ footing: a factory-made concrete node that sits on the ground, anchored by four galvanised steel nails driven into the soil around it at an angle.',
  /**
   * Each paragraph carries the one term it exists to land, and `WhatIsPen`
   * sets that term in a `<strong>`. Skim the three bold spans on their own and
   * you get the mechanism, the number and the promise — which is what a reader
   * scanning a centred column actually does before deciding to read it.
   */
  body: [
    // BRIEF: "The system draws its load-transfer logic from nature … PEN
    // transfers structural load through four battered galvanized steel nails …
    // creates a three-dimensional soil-structure interaction zone that engages
    // a significantly larger soil volume than a conventional pad footing".
    {
      text: 'A conventional footing works by bearing: its weight presses down on the soil directly beneath it, and its capacity is limited by what that patch of ground can carry. PEN works by friction. Load entering the node splits into four paths and travels down the nails, shedding into the soil along their whole embedded length — the same way a tree resists wind through its roots rather than by sitting heavily on the ground.',
      // The mechanism the whole paragraph is built to contrast with bearing.
      emphasis: 'friction',
    },
    // BRIEF: three-dimensional soil-structure interaction zone; Enhancement
    // Factor field-validated at NIT Calicut; grout fills the annular space.
    {
      text: 'Because the four nails are driven apart at a batter, they engage a three-dimensional volume of soil far larger than the node’s own footprint. Non-shrink grout pumped down each pipe locks it to the ground along its length. That is where the measured capacity gain comes from: an Enhancement Factor of 2.0–2.6× the soil’s bearing capacity, confirmed by field plate load tests at NIT Calicut.',
      // The term and its figure together: the number alone means nothing to a
      // reader who has not met the term, and BRIEF requires it stated verbatim.
      emphasis: 'Enhancement Factor of 2.0–2.6×',
    },
    // BRIEF: model number, factory-cured node, site-adjusted batter angle.
    {
      text: '“Pre-engineered” is literal. The node is cast and cured in the factory to a fixed model and dispatched ready to use, so nothing is mixed, formed or cured on your site. What is engineered per project is the layout and the driving: the number of points, and a batter angle set between 40° and 51° to suit the ground it is going into.',
      // The word already sits in quotes; bolding it inside them marks it as the
      // term being defined rather than as a claim being shouted.
      emphasis: '“Pre-engineered”',
    },
  ],
  highlights: [
    {
      title: 'One precast node',
      // BRIEF: M50 node, factory-cured before dispatch.
      body: 'M50 concrete, cast and cured in the factory — nothing is mixed or formed on your site.',
    },
    {
      title: 'Four battered nails',
      // BRIEF: batter angle 40–51°, three-dimensional soil interaction zone.
      body: 'Driven at 40–51°, engaging a soil volume far larger than the node’s own footprint.',
    },
    {
      title: '2.0–2.6× bearing capacity',
      // BRIEF core claims: Enhancement Factor field-validated at NIT Calicut.
      body: 'Enhancement Factor, confirmed by field plate load tests at NIT Calicut.',
    },
    {
      title: 'Zero curing',
      // BRIEF: load-bearing immediately, no 21-day wait.
      body: 'Load-bearing the moment the last nail is driven and grouted.',
    },
  ],
  media: {
    src: '/media/images/pen.png',
    alt: 'The PEN Foundation node: a precast concrete block with a bolted top plate and four galvanised steel nails splayed at a batter angle, tungsten carbide tips at their ends',
  },
  comparison: {
    title: 'PEN Foundation and a conventional footing, side by side',
    columns: ['PEN Foundation', 'Conventional footing'],
    // Every row is a property stated in BRIEF. The last three tick for both
    // systems: a conventional footing is code-designed, plate-load verified and
    // permanent too, and saying so is what makes the six rows above it land.
    rows: [
      // BRIEF: "~2 hours. No curing. Load-bearing immediately" vs "21+ days
      // (includes curing)".
      { feature: 'Load-bearing the day it is installed', pen: true, conventional: false },
      // BRIEF: "Zero excavation … eliminating 2–3 m³ of spoil disposal per
      // foundation point".
      { feature: 'Zero excavation, no spoil to dispose of', pen: true, conventional: false },
      // BRIEF: "no concrete cast on site".
      { feature: 'No wet concrete cast on site', pen: true, conventional: false },
      // BRIEF, solar audience page: "Zero water — no water trucking to remote
      // sites. Fully dry process."
      { feature: 'No water needed for installation', pen: true, conventional: false },
      // BRIEF case study, Rehabilitation Housing: conventional foundations were
      // "impossible — ground too disturbed for excavation".
      {
        feature: 'Installs on disturbed or sloping ground without excavation',
        pen: true,
        conventional: false,
      },
      // BRIEF: "At end of life, components are recoverable and reusable."
      { feature: 'Components recoverable at end of life', pen: true, conventional: false },
      // BRIEF T04: PEN is governed by IS 2911 Part 4; IS 6403 governs shallow
      // footings. Both are code-designed — the codes differ, not the fact.
      { feature: 'Designed to an Indian Standard code', pen: true, conventional: true },
      // BRIEF: Factor of Safety derived from plate load tests. Plate load
      // testing is equally standard practice for a conventional footing.
      { feature: 'Capacity verified by on-site plate load testing', pen: true, conventional: true },
      // Both carry permanent buildings; PEN's are listed in `proof`.
      { feature: 'Suitable for permanent structures', pen: true, conventional: true },
    ],
    note: 'PEN is governed by IS 2911 Part 4 (nail / pile system); a conventional isolated footing by IS 6403. Both are designed to code — the difference is which one, and what the ground has to go through to get there.',
  },
  // Routes to /engineering, which is where the specification now lives.
  cta: { label: 'See the full specification', href: '/engineering' },
};

/* -------------------------------------------------------------------------- */
/* HOW IT WORKS — the project journey                                         */
/* -------------------------------------------------------------------------- */

/**
 * The customer-side sequence. Deliberately four plain steps with no
 * illustration and no scroll choreography — the page already carries two
 * scroll-driven sections above this one, and a process list earns nothing from
 * a third.
 */
export const howItWorks: ProcessContent = {
  id: 'how-it-works',
  heading: 'Four steps from site visit to structure',
  lead: 'PEN is specified per project, not sold off a shelf. The layout, the point count and the driving depth all follow from what your ground and your structure actually need.',
  steps: [
    {
      number: '01',
      title: 'Assess',
      // BRIEF, soil selector: laterite, black cotton, sandy, rocky,
      // waterlogged; "Understand what soil data you need before specifying PEN".
      body: 'We look at the project, the site and the loads it has to carry. Soil condition matters most — laterite, black cotton, sandy, rocky and high-water-table sites each behave differently, and each changes how the system is set out.',
    },
    {
      number: '02',
      title: 'Engineer',
      // BRIEF: IS 2911 Part 4; FoS 2.5 single test / 2.0 two or more tests;
      // batter angle site-adjusted; min embedment 900 mm.
      body: 'Our engineers size the solution: how many foundation points, where they go, what batter angle and embedment depth suit the ground. The design is worked to IS 2911 Part 4, with a Factor of Safety of 2.5 on a single plate load test or 2.0 where two or more are run.',
    },
    {
      number: '03',
      title: 'Install',
      // BRIEF: ~2 hours per point, no excavation, no water, grouted, bolted.
      body: 'Nodes are placed on the surface and the four nails are driven and grouted — around two hours per point, with no digging, no formwork and no water trucked in. There is no curing wait at the end of it.',
    },
    {
      number: '04',
      title: 'Build',
      // BRIEF: "The moment the last nail is driven, the green signal is given —
      // structure development begins the same day." Bolts: M12 IS 5624.
      body: 'The superstructure bolts to the node through an M12 galvanised connection and work continues the same day. On a conventional footing this is where three weeks of waiting would start.',
    },
  ],
  cta: { label: 'See where PEN applies', href: '#applications' },
};

/* -------------------------------------------------------------------------- */
/* APPLICATIONS                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Every category here is listed under "APPLICATIONS" in BROCH. Nothing has been
 * added to the brochure's list, and the supporting line for each says only what
 * the source documents support — the load ceiling in `note` is the honest
 * boundary, taken from DECK's own competitor slide.
 */
export const applications: ApplicationsContent = {
  id: 'applications',
  heading: 'Where PEN is being specified',
  lead: 'PEN suits structures where the foundation is repetitive, the programme is tight, or the ground should not be dug. These are the categories the system is built and sold for today.',
  items: [
    {
      title: 'Low-rise residential',
      // BRIEF, homeowner page: "G+1 home requires approximately 16–20 PEN units".
      body: 'G+0 and G+1 homes. A typical G+1 house needs roughly 16–20 PEN units, set in a day rather than staged over a month.',
    },
    {
      title: 'Low-rise commercial',
      body: 'Small commercial buildings where every week of programme carries a holding cost, and where a clean site matters to the neighbours.',
    },
    {
      title: 'Low-span industrial',
      body: 'Sheds and light industrial buildings on regular column grids — the repetition is what makes a pre-engineered point economical.',
    },
    {
      title: 'Modular and relocatable homes',
      // BROCH key features: "Reusable & Relocatable — ideal for temporary or
      // mobile structures". DECK Y1-Q3: partnerships with prefab and modular.
      body: 'Prefab and modular structures. Components are recoverable at end of life, so a relocatable building can take its foundation with it.',
    },
    {
      title: 'Resorts and hospitality',
      // BRIEF case study: Black Langur Resort, Wayanad — forest department
      // zero-excavation mandate, protected tree roots.
      body: 'Ecologically sensitive sites. Zero excavation keeps root systems, soil layers and slopes intact — which is often what the approval depends on.',
    },
    {
      title: 'Farm structures',
      body: 'Agricultural buildings on soft or seasonal ground, away from batching plants and water supply.',
    },
    {
      title: 'Mass housing and shelters',
      // BRIEF case study: Rehabilitation Housing, Wayanad — post-landslide slope.
      body: 'Housing programmes at volume, including rehabilitation work on ground too disturbed for conventional excavation.',
    },
    {
      title: 'Disaster rehabilitation',
      body: 'Quick temporary shelters, where the foundation cannot be the thing that delays occupation.',
    },
    {
      title: 'Compound walls and fencing',
      body: 'Boundary walls and fence lines — long runs of small, identical, repeated foundation points.',
    },
  ],
  // DECK's competitor slide states plainly that rival systems are "not fit for
  // G+1 above structures"; BRIEF's Phase-2 roadmap puts mid-rise beyond the
  // current product. Saying so is what makes the rest of the list credible.
  note: 'PEN is engineered for low-rise construction. Structures above G+2 are on the development roadmap, not in the current product. Every project is assessed on its own soil data and loads before the system is specified.',
  cta: { label: 'Check PEN for my project', href: '#contact' },
};

/* -------------------------------------------------------------------------- */
/* PROOF — projects already in the ground                                     */
/* -------------------------------------------------------------------------- */

/**
 * Four real deployments. Names, locations, challenges and results are taken
 * from BRIEF's case-study section and DECK's traction slide; nothing is
 * invented and no figure is estimated.
 *
 * Deliberately absent: install dates, unit counts per project and client
 * quotes. The source documents do not carry them, so neither does this.
 */
export const proof: ProofContent = {
  id: 'projects',
  heading: 'Built across soils, seasons and states',
  projects: [
    {
      name: 'Devagiri Library',
      location: 'Calicut, Kerala',
      application: 'Retrofit under an occupied building',
      image: {
        src: '/media/images/homepage/devagiri-library.png',
        alt: 'The Devagiri Library at night: a tall cylindrical reading tower in a black steel grid, lit from within, with a figure walking past at ground level',
      },
      challenge:
        'Foundations had to go in underneath an existing, occupied building. No tolerance for vibration or structural disruption, and the existing flooring could not be broken.',
      // DECK: "Our First Pilot Project winning SSMB'24 Award for Best Steel
      // Structure"; award also credited to the founder in DECK's team slide.
      result:
        'Installed without disrupting the structure above. The building stayed operational throughout, with zero downtime. The project went on to win Best Steel Structure in India at SSMB 2024.',
    },
    {
      name: 'Black Langur Resort',
      location: 'Wayanad, Kerala',
      application: 'Eco-resort in dense forest',
      // The one project with supplied imagery. `Proof.tsx` lays it in at 12%
      // behind the card's text, so it reads as a tint on the white panel
      // rather than as photographic evidence of the stated result.
      //
      // A visualisation, not a site photograph — the alt says so, because the
      // section's whole claim is that these are real deployments and a render
      // captioned as a site is the one thing that would undercut it.
      image: {
        src: '/media/images/homepage/black_langur-waayanad.png',
        alt: 'Visualisation of the Black Langur Resort: a two-storey block with a tiled roof and pool, built among standing jackfruit trees',
      },
      challenge:
        'A dense forest site with live root systems of protected trees close to every foundation point, under a forest department zero-excavation mandate.',
      result:
        'Every foundation installed without disturbing a single root system. Forest department approval retained and the site left undisturbed after installation.',
    },
    {
      name: 'Startup EcoAshram',
      location: 'Kudal, Maharashtra',
      application: 'First commercial-scale deployment',
      image: {
        src: '/media/images/homepage/startup-ecoashram.png',
        alt: 'A pavilion at Startup EcoAshram: a curved shingled roof over white walls, raised above a wooded slope on a splayed bamboo frame',
      },
      // DECK traction slide is the only source for this project; it gives the
      // scale and nothing else, so the challenge line stays factual about that.
      challenge:
        'The first deployment at commercial scale — over 200 foundation units on one site, outside Kerala and outside laterite soil.',
      result:
        'Delivered as a single commercial-scale installation, taking PEN from pilot projects to repeatable volume.',
    },
  ],
  cta: { label: 'See all projects', href: '/projects' },
};

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The heading over the validation logo wall.
 *
 * "Certified by GRIHA" was overstating it. GRIHA's certificate records that the
 * product has been *included in the GRIHA Product Catalogue* under the
 * Innovation typology — a listing a project can draw on, not an endorsement of
 * the company. The wording below and the note in `validation` now match the
 * certificate.
 */
export const builtBy: SectionHeading = {
  heading: 'Field-tested at NIT Calicut, mentored by IIT Kanpur, listed by GRIHA',
};

/**
 * The three institutions named in the "Validated & Supported" heading.
 *
 * Sourced from the company brochure and the GRIHA certificate — there were no
 * standalone assets for these, so the marks were extracted rather than
 * approximated. Kept separate from `partners`: those are supporters and
 * funders, these are the bodies that validated or certified the product, and
 * the heading above the wall makes that specific claim.
 */
export const validationLogos = [
  {
    src: '/media/logos/validation/nit-calicut.webp',
    alt: 'National Institute of Technology Calicut',
  },
  {
    src: '/media/logos/validation/iit-kanpur.webp',
    alt: 'Indian Institute of Technology Kanpur',
  },
  { src: '/media/logos/validation/griha.webp', alt: 'GRIHA Council' },
];

/* -------------------------------------------------------------------------- */
/* CALCULATOR                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Homepage time & cost estimator.
 *
 * The arithmetic lives in lib/calculator/savings.ts and is untouched. The rates
 * quoted in `basis` are that module's constants written out in prose — they are
 * printed on the card so a visitor can check the figures above them, and if a
 * constant ever moves, this text moves with it.
 *
 * The third result card is computed too. It used to advertise a carbon
 * calculator that did not exist, then stated a static material figure; it now
 * runs off the slider like the other two, from the IKEA Foundation case study
 * rate of 106 kg CO₂ per unit (≈5 trees).
 */
export const calculator: CalculatorContent = {
  heading: 'What could PEN mean for your project?',
  body: {
    lead: 'Set the number of foundation points and the project type to see the programme time and site cost PEN removes. The estimate uses Kerala project averages — for a figure against your own drawings and soil data, ',
    linkLabel: 'ask for a project assessment',
    linkHref: '#contact',
    trail: '.',
  },
  parametersTitle: 'Project Parameters',
  pointsLabel: 'Foundation Points',
  points: { min: 4, max: 60, step: 1, initial: 4 },
  projectTypes: [
    { id: 'residential', label: 'Residential', factor: 1 },
    { id: 'commercial', label: 'Commercial', factor: 1.35 },
    { id: 'solar', label: 'Solar Farm', factor: 1.6 },
    { id: 'eco-resort', label: 'Eco Resort', factor: 1.15 },
  ],
  // Mirrors TRADITIONAL_DAYS_PER_POINT, PEN_HOURS_PER_POINT and
  // COST_SAVED_PER_POINT in lib/calculator/savings.ts. Keep in step with them.
  basis: [
    'Based on Kerala project averages.',
    'Traditional: 2.1 days/point · PEN: ~2 hours/point.',
    'Cost saved: ₹45,000/point on excavation, spoil and curing time.',
    // Sourced separately from the time and cost rates, and stated as such —
    // the carbon figure is the one a sustainability consultant will check.
    'CO₂: 106 kg/point, ≈5 trees — IKEA Foundation case study.',
    'Project type scales time and cost. Carbon is per unit, so it does not.',
    'Indicative only — not a quotation.',
  ],
  timeLabel: 'Time Saved',
  timeNote: 'off your programme',
  costLabel: 'Cost Savings',
  costNote: 'Saved on excavation & curing',
  carbon: {
    label: 'CO₂ Avoided',
    treesPrefix: 'Equivalent to planting',
    treesSuffix: 'trees',
    linkLabel: 'see what goes into the ground',
    href: '#technology',
  },
  // Label and destination only. The title and supporting line that used to sit
  // above this button repeated the section's own heading and lead, so they were
  // removed rather than left here as content nobody renders.
  cta: {
    label: 'Get my project assessment',
    href: '#contact',
  },
};

/* -------------------------------------------------------------------------- */
/* IN ACTION — media grid                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Three square cards: the product, the ground it replaces, and the structure
 * that goes up on it.
 *
 * Every image is real PEN material already in the repository — the studio
 * render of the node, the site photograph of a conventional excavation, and
 * the frame of a completed frame standing on installed foundations. None of
 * them is a stock photograph standing in for a deployment.
 *
 * The cards are stills, so the category labels say what they are rather than
 * borrowing the reference grid's "VIDEO" label, and the action pill reads VIEW
 * rather than WATCH NOW. Each links to a page that exists.
 */
export const inAction: InActionContent = {
  id: 'in-action',
  title: 'See PEN in the ground',
  cards: [
    {
      category: 'The system',
      title: 'One node, four nails',
      excerpt: 'The precast node and its four battered nails, before they go into the ground.',
      href: '#technology',
      image: {
        src: '/media/images/pen.png',
        alt: 'Studio render of the PEN node with four galvanised nails splayed at a batter angle',
      },
      actionLabel: 'See the system',
    },
    {
      category: 'What it replaces',
      title: 'The conventional way',
      excerpt: 'Deep excavation, rebar cages and three weeks of curing before anything is built.',
      href: '#why',
      image: {
        src: '/media/images/homepage/excavation-image.png',
        alt: 'A deep excavation with reinforcement cages, an excavator and a spoil truck on a building site',
      },
      actionLabel: 'See what it replaces',
    },
    {
      category: 'On site',
      title: 'Structure the same day',
      excerpt: 'The superstructure bolts straight to the node — no curing wait in between.',
      href: '#projects',
      image: {
        src: '/media/images/brick-house.png',
        alt: 'A steel and masonry structure standing on completed PEN foundations at a Kerala site',
      },
      actionLabel: 'See the projects',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Buyer objections, answered only where the source documents support an answer.
 *
 * Grouped into four tabs so the block reads as four short lists rather than one
 * long one — the same shape /resources uses, four questions per tab.
 *
 * Two questions from the requested list are deliberately absent: geographic
 * availability and a maximum load per unit. The documents give no service-area
 * statement and no per-unit safe working load, and a plausible-sounding answer
 * to either is exactly the kind of thing a structural engineer would check.
 * Pricing is answered by saying there is no list price, which is true.
 */
export const faq: FaqContent = {
  id: 'faq',
  title: 'FAQs',
  body: 'The answers below come from the test reports and the technical specification. Where the honest answer is “it depends on your site”, it says so.',
  tabs: [
    {
      id: 'the-system',
      label: 'The System',
      entries: [
        {
          question: 'What is PEN Foundation?',
          answer:
            'A patented pre-engineered nail foundation: an M50 precast concrete node, 450 × 450 × 200 mm, anchored by four galvanised steel nail pipes driven into the surrounding soil at a batter and grouted in place. It replaces a cast-in-situ isolated footing.',
        },
        {
          question: 'How does it compare with a conventional footing?',
          answer:
            'A conventional footing is dug, formed, poured and cured over 21 days or more, and its capacity depends on the soil directly beneath its base. PEN is driven in about two hours per point, needs no excavation and no curing, and transfers load through skin friction along four nails — giving a field-validated Enhancement Factor of 2.0–2.6× the soil bearing capacity.',
        },
        {
          question: 'Why is it called “pre-engineered”?',
          answer:
            'The node is cast and cured in the factory to a fixed model, CD-PEN-32.3.2.1500, and arrives ready to use — nothing is mixed, formed or cured on your site. What is engineered per project is the layout and the driving: the point count, the embedment and a batter angle set between 40° and 51° for your ground.',
        },
        {
          question: 'What is it made of?',
          answer:
            'An M50 precast concrete node, four GI pipes at 32 mm OD with a 3.2 mm wall to IS 1239, recycled tungsten carbide penetration tips, Fosroc Conbextra GP2 non-shrink grout, and M12 grade 4.6 galvanised bolts to IS 5624 for the superstructure connection.',
        },
      ],
    },
    {
      id: 'site-installation',
      label: 'Installation',
      entries: [
        {
          question: 'Is excavation required?',
          answer:
            'No. Nothing is dug out. The node sits on the surface and the nails are driven, so soil stratification, groundwater flow and aquifer recharge are left intact — and the 2–3 m³ of spoil a conventional point generates never has to be disposed of.',
        },
        {
          question: 'How long does installation take?',
          answer:
            'Around two hours per foundation point, and the point is load-bearing the moment the last nail is driven and grouted. There is no curing period, so structural work can begin the same day.',
        },
        {
          question: 'What soil conditions is it suitable for?',
          answer:
            'The system has been tested and modelled across red laterite, black cotton, sandy, rocky and waterlogged high-water-table conditions, and a PLAXIS 3D parametric study covers multiple soil types. Suitability is still decided per site — rocky ground, for example, may need a pilot bore. Your soil data is the first thing our engineers ask for.',
        },
        {
          question: 'Does the site need water or heavy plant?',
          answer:
            'Installation is a dry process — no water is used and no concrete is cast on site, so nothing has to be trucked in for the foundation itself. That is a large part of why the system suits remote and access-restricted sites.',
        },
      ],
    },
    {
      id: 'engineering',
      label: 'Engineering',
      entries: [
        {
          question: 'What loads can it carry, and how is that verified?',
          answer:
            'Capacity is established per project from plate load testing on your site, not quoted as a fixed number. For reference, field testing by NABL-accredited MatterLab in Wayanad recorded a peak load of 667 kN/m². Design follows IS 2911 Part 4 with a Factor of Safety of 2.5 on a single plate load test, or 2.0 where two or more tests are run.',
        },
        {
          question: 'What code governs the design?',
          answer:
            'IS 2911 Part 4, the Indian standard for nail and pile systems — not IS 6403, which covers shallow footings. Minimum embedment is 900 mm per that code. Components reference IS 1239 for the GI pipe and IS 5624 for the bolts. A dedicated BIS standard for the system is under development.',
        },
        {
          question: 'What testing has been done?',
          answer:
            'Field plate load tests at NIT Calicut to IS 1888:1982, field load testing by MatterLab in Wayanad, finite element analysis in ANSYS, and a PLAXIS 3D parametric study across soil types carried out as an NIT Calicut MTech thesis. IIT Kanpur mentors the programme and runs long-term monitoring.',
        },
        {
          question: 'Where does the capacity gain come from?',
          answer:
            'The four nails are driven apart at a batter, so they engage a three-dimensional volume of soil far larger than the node’s own footprint, and load sheds into the ground along the whole embedded length of each nail rather than pressing on one patch beneath a base.',
        },
      ],
    },
    {
      id: 'your-project',
      label: 'Your Project',
      entries: [
        {
          question: 'Is it suitable for permanent structures?',
          answer:
            'Yes — it is carrying permanent buildings today, including a library retrofit and rehabilitation housing. The system is engineered for low-rise construction; structures above G+2 are on the development roadmap rather than in the current product. Components are also recoverable at end of life, which makes it equally suited to relocatable and temporary buildings.',
        },
        {
          question: 'How many units will my project need?',
          answer:
            'It depends on the structure and the ground. As a rough indication, a G+1 house typically needs 16–20 PEN units. The actual point count comes out of the engineering assessment.',
        },
        {
          question: 'Does it count towards green building credit?',
          answer:
            'The pre-engineered nail foundation is included in the GRIHA Product Catalogue under the Innovation typology, against GRIHA V.2019 criterion 30, valid to 11 June 2027. It can be used on GRIHA-registered projects to meet that criterion — confirm your project’s own compliance requirements with GRIHA first.',
        },
        {
          question: 'How do I get a price?',
          answer:
            'Pricing is quoted per project, after the assessment — the point count, the ground conditions and the site access all move it. Send us your project through the form below and our engineers will come back to you.',
        },
      ],
    },
  ],
  cta: { label: 'Ask an engineer directly', href: '#contact' },
};

/* -------------------------------------------------------------------------- */
/* CLOSING FORM                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The closing block is the heading and the form, nothing else — the intro line,
 * bullets, trust label and logo row that used to sit beside the card were
 * dropped with the supporting column.
 *
 * The submit button used to read "Submit", which names the mechanism rather
 * than the outcome. `submitLabel` is passed through to ContactForm so the last
 * click on the page says what it gets you; /contact keeps the default.
 */
export const homeForm: HomeFormContent = {
  titleLines: ['Tell us about your project', 'and we will tell you if PEN fits'],
  intro:
    'Our engineers will review your site and loads and come back with whether the system suits the project — and if it does not, we will say so.',
  submitLabel: 'Request project assessment',
};
