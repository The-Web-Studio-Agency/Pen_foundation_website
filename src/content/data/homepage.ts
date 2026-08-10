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
 * Rewritten again on 2026-08-10 against HANDOFF's PAGE 1 hero spec. That
 * document specifies a static hero — a headline, three supporting lines and two
 * CTAs — but it also states it is "a content handoff, not a website redesign".
 * The six-beat scrub is the site's existing structure and it is synced to the
 * film, so the WORDS were replaced and the structure kept: HANDOFF's headline
 * opens on beat 1, its "30 days of construction" line lands on the pull-back
 * shot, and beat 6 closes on the footer headline the same document prescribes.
 *
 * NOT YET CARRIED: HANDOFF's two hero CTAs, "Request a Project Assessment" and
 * "Watch the Installation". `HeroContent` has no CTA slot and this hero is a
 * full-viewport scrub with nowhere to pin one — placing them is a design
 * decision, not a copy change. The primary CTA is live in the header instead.
 *
 * Beat 4 carries a figure, which this block used to forbid. HANDOFF approves
 * "30 days of construction. Less than one day for the foundation." as hero
 * wording, and its claims-control table clears "installs within hours, with no
 * on-site foundation curing cycle" for broad use. Every other beat is still
 * argument rather than evidence.
 *
 * Lines are hand-broken. The reveal runs one continuous wave across the breaks,
 * so a break is a compositional choice, not a wrap.
 */
export const hero: HeroContent = {
  sequence: [
    { lines: ['Instant foundation', 'for modern buildings.'] },
    { lines: ['One precast node.', 'Four engineered nails.', 'Ready to build.'] },
    { lines: ['Zero excavation.', 'No curing cycle.', 'Immediate load-bearing.'] },
    { lines: ['30 days of construction.', 'Less than one day', 'for the foundation.'] },
    { lines: ['Hours, not weeks.', "Because programmes shouldn't", 'wait for concrete.'] },
    { lines: ['From soil we rise.', 'Faster. Stronger. Greener.'] },
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
  // HANDOFF, credibility strip headline — already the wording this section
  // carried, so it stands unchanged.
  heading: 'Engineered. Tested. Supported.',
  // HANDOFF, credibility strip supporting line, verbatim. It replaces a line
  // built from BROCH that said much the same thing in different words; the
  // handoff's version adds "certification" as a fourth role and names the
  // system in full, which is the first-reference rule that document sets.
  //
  // HANDOFF's developer note on this strip: group the marks by role — Research
  // / Incubation / Support / Certification — and do not imply every logo is a
  // technical validator. The wall currently cycles all twenty marks in one
  // undifferentiated grid, so that grouping is NOT yet implemented; it needs a
  // `LogoCell` role field and a change to `LogoWall`, which is structure rather
  // than copy. The note below is the interim guard: it tells the reader the
  // marks represent four different kinds of backing.
  note: 'Research, incubation, grant support and industry collaboration behind the Pre-Engineered Nail Foundation, spanning national institutes, government innovation programmes and climate-focused ecosystems.',
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
  // HANDOFF, PROBLEM SECTION: "For a century, a foundation meant digging,
  // pouring and waiting. / PEN drives four engineered nails instead, and
  // carries the load the same day." Split around the emphasis span this
  // component sets in a <strong>.
  before: 'For a century, a foundation meant digging, pouring and waiting. PEN ',
  emphasis: 'drives four engineered nails',
  after: ' instead, and carries the load the same day.',
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
  // HANDOFF section headline, verbatim — and already the heading here.
  heading: 'Three weeks of your programme are spent waiting for concrete to cure',
  // HANDOFF body copy for the problem section, verbatim, with the colon and
  // trailing clause kept: the capability list immediately below is the list
  // this sentence promises, so the two read as one block.
  //
  // This REPLACES a version carrying two hard figures — "21 days" and "2–3 m³
  // of spoil per point" — sourced from BRIEF. HANDOFF's verification box puts
  // the final installation-time statement on the list of figures to reconcile
  // before publishing, and its claims-control table approves the softer
  // "installs within hours, with no on-site foundation curing cycle" until one
  // exact duration is signed off. The numbers are not lost: they are still
  // stated, with their sources, in `capabilitySteps` and `product` below.
  intro:
    'A conventional cast-in-situ footing has to be excavated, formed, reinforced, poured and then left to cure before the structure can move forward. PEN Foundation changes that sequence. A factory-made node is positioned at ground level, engineered nails are driven into qualified soil, and the completed point is ready to receive the structure without an on-site curing cycle. The result is a faster programme, less wet work, less site disruption and a foundation process that works with the land rather than removing it. What that changes on a real project:',
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
  // HANDOFF, PRODUCT DEFINITION headline, verbatim.
  heading: 'One precast node. Four engineered nails. Ready to build.',
  // HANDOFF product-definition body, verbatim. It names the system in full on
  // first reference and states the patent and the biomimetic origin, which the
  // previous lead did not.
  lead: 'PEN Foundation, the Pre-Engineered Nail Foundation System, is a patented, biomimetic foundation inspired by the way tree roots distribute load through soil. A high-strength precast node sits at ground level and transfers structural loads through four inclined steel nails driven into the surrounding soil. The system is designed for the project’s soil, structural loads and layout, then installed without excavation, formwork or on-site foundation curing.',
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
    // HANDOFF, "Supporting explanation" under the product definition, verbatim.
    // It makes the same bearing-versus-distribution contrast the previous
    // paragraph made, in the words the handoff approves, and it names the
    // mechanism the rest of the section depends on.
    {
      text: 'A conventional footing concentrates load beneath a concrete mass. PEN distributes load through four inclined paths that engage a three-dimensional volume of soil. The design is compact at the surface but active below it, using soil-structure interaction rather than relying only on the footprint of the node.',
      // The mechanism the whole paragraph is built to name.
      emphasis: 'soil-structure interaction',
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
  /**
   * HANDOFF's five CORE PROOF POINTS, each given the short label this component
   * needs above it. The sentences are the handoff's.
   *
   * These replace four highlights that led on grades and angles — M50, 40–51°,
   * the Enhancement Factor range. HANDOFF's developer note for the engineering
   * page is explicit that exact dimensions, grades, standards and model codes
   * belong in an expandable specification panel or datasheet, and that public
   * page copy should explain the mechanics first. The figures still exist on
   * /engineering and in `capabilitySteps`; they are simply no longer the first
   * thing a reader who has not yet decided PEN is relevant to them meets.
   *
   * `highlights` renders as a flex column beside the render, not a fixed 2×2,
   * so a fifth entry lengthens the column rather than breaking the grid.
   */
  highlights: [
    {
      title: 'Zero excavation',
      body: 'Soil layers, drainage paths and terrain are preserved.',
    },
    {
      title: 'Installed within hours',
      body: 'No on-site foundation curing cycle at the end of the sequence.',
    },
    {
      title: 'Immediate load readiness',
      // HANDOFF claims-control, Load readiness: "Ready for approved
      // superstructure connection after installation and quality checks." That
      // row also says to avoid an unconditional "instant" guarantee, so the
      // conditions stay in the sentence rather than being trimmed off it.
      body: 'Ready for approved superstructure connection after installation and quality checks.',
    },
    {
      title: 'Less concrete and water',
      // HANDOFF claims-control, Material: exact percentages only where the
      // comparison model is stated. No model is stated here, so no percentage.
      body: 'Substantially lower concrete and water use than conventional RCC footings.',
    },
    {
      title: 'Qualified by evidence',
      body: 'Soil- and load-qualified design supported by testing, simulation and field deployment.',
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
  // HANDOFF, PAGE 1: "Four steps from project enquiry to structure" — the
  // sequence starts at the enquiry, not at a site visit, because step 01 is a
  // desk review of what the customer sends.
  heading: 'Four steps from project enquiry to structure',
  // HANDOFF lead, verbatim.
  lead: 'PEN is specified for the project, not sold as an unqualified off-the-shelf footing. The layout, number of points and installation configuration follow from the ground and the structure.',
  /**
   * All four bodies are HANDOFF's, verbatim.
   *
   * The versions they replace were BRIEF-sourced and carried hard numbers in
   * the prose — "around two hours per point", "a Factor of Safety of 2.5 on a
   * single plate load test", "three weeks of waiting". HANDOFF's verification
   * box lists the final installation-time statement among the figures to
   * reconcile before publishing, and its own note on this section says to
   * retain the four-stage photography but remove hard installation-time claims
   * from the graphic until verified. The code references and safety factors
   * are still stated on /engineering, where the test context sits with them.
   */
  steps: [
    {
      number: '01',
      title: 'Assess',
      body: 'We review the project location, structural system, column reactions, site access and available soil information. Where required, soil suitability is established through appropriate field or geotechnical inputs.',
    },
    {
      number: '02',
      title: 'Engineer',
      body: 'Our engineers develop the foundation layout and configuration for the approved project loads and qualified soil conditions. Point count, position, nail geometry and embedment are selected as part of the design process.',
    },
    {
      number: '03',
      title: 'Install',
      body: 'The precast nodes are positioned, the engineered nails are driven into the soil and the system is completed in accordance with the approved installation method. There is no excavation, formwork or on-site foundation curing cycle.',
    },
    {
      number: '04',
      title: 'Build',
      body: 'Once installation and quality checks are completed, the superstructure can connect to the node and construction can continue without the conventional foundation waiting period.',
    },
  ],
  cta: { label: 'See where PEN applies', href: '#applications' },
};

/* -------------------------------------------------------------------------- */
/* APPLICATIONS                                                               */
/* -------------------------------------------------------------------------- */

/**
 * HANDOFF's PAGE 1 applications set, replacing the nine categories transcribed
 * from BROCH.
 *
 * Six entries rather than nine. HANDOFF organises this section by customer
 * outcome rather than by building type, and it drops four of BROCH's categories
 * from the featured set — farm structures, mass housing and shelters, disaster
 * rehabilitation, and compound walls and fencing. They are not disowned; the
 * fuller list belongs on the Applications page, where HANDOFF's PAGE 4 spec
 * puts the emerging and project-qualified uses behind their own framing.
 *
 * "Rehabilitation Housing" is gone from this section on HANDOFF's explicit
 * instruction ("Remove Rehabilitation Housing from the featured set"), which is
 * the same removal already applied to `proof` below.
 *
 * Ground-mounted solar is stated as an application UNDER DEVELOPMENT, in those
 * words, because HANDOFF requires it: "Publish as an application under
 * development or project-qualified use until the solar-specific product and
 * economics are fully validated."
 */
export const applications: ApplicationsContent = {
  id: 'applications',
  // HANDOFF headline, verbatim.
  heading: 'Where PEN Foundation is being specified',
  // HANDOFF lead, verbatim.
  lead: 'PEN suits suitable low-rise structures where foundation points repeat, the programme is tight, access is constrained, or the ground should remain undisturbed.',
  // Every body below is HANDOFF's, verbatim.
  items: [
    {
      title: 'Residential',
      body: 'A hassle-free foundation sequence with fewer wet-work dependencies, less site congestion and installation that follows the approved plan without a month-long footing cycle.',
    },
    {
      title: 'Commercial',
      body: 'Faster foundation completion can bring the structure and the revenue-generating asset forward, while keeping the site cleaner and reducing programme uncertainty.',
    },
    {
      title: 'Eco-resorts and farmstays',
      body: 'Zero excavation helps preserve tree roots, soil structure, slopes and the natural character guests come to experience. Earlier project completion can also bring operations and revenue forward.',
    },
    {
      title: 'Modular and prefab',
      body: 'A foundation process aligned with factory-made structures: fast, repeatable, precise and capable of supporting relocatable design strategies where engineered accordingly.',
    },
    {
      title: 'Low-span industrial',
      body: 'Repeated column grids and schedule-sensitive delivery make suitable sheds and light industrial structures a strong application for a pre-engineered foundation system.',
    },
    {
      title: 'Ground-mounted solar',
      // The "under development" framing is HANDOFF's requirement, not a hedge
      // added here. Its claims-control table also forbids implying the
      // solar-specific economics are settled.
      body: 'An application under development, focused on faster repetitive installation and reduced concrete, water, spoil and site disturbance. Published as a development pathway until the solar-specific product and economics are fully validated.',
    },
  ],
  // HANDOFF claims-control, Suitability: "Every project requires review of
  // loads, soil and site conditions. Repeat near calculators, specifications
  // and forms." The G+2 ceiling stays: DECK's competitor slide states rival
  // systems are "not fit for G+1 above structures" and BRIEF's Phase-2 roadmap
  // puts mid-rise beyond the current product. HANDOFF's guardrails forbid
  // "works in every soil" and "replaces all foundations", which is the same
  // boundary stated from the other side.
  note: 'PEN is engineered for suitable low-rise construction. Structures above G+2 are on the development roadmap, not in the current product. Every project requires review of loads, soil and site conditions before the system is specified.',
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
  // HANDOFF, PAGE 5 hero: "Built across soils, seasons and states." Already the
  // heading here, so it stands.
  heading: 'Built across soils, seasons and states',
  /**
   * HANDOFF's five named projects, in its order.
   *
   * `ProofProject` has one `challenge` field where HANDOFF's card format has
   * two — "Foundation challenge" and "Why PEN". Rather than add a field and
   * change the component, each entry states the challenge and then the reason
   * PEN answered it in the same paragraph, which is how the card already reads.
   * Scope and "evidence available" are not carried: HANDOFF asks for them, but
   * no scope figures or document links were supplied with the copy, and its own
   * instruction is to avoid invented savings or performance numbers.
   *
   * Two entries are renamed from the previous set on HANDOFF's spelling:
   * "Devagiri Library" → "Devagiri College Library" and "Calicut" → "Kozhikode";
   * "Startup EcoAshram" → "Startup Eco-Ashram". `ProjectGlyph` keys its
   * drawings by name, so those keys moved with them.
   *
   * Bethel Residency and Bengaluru Farmhouse are new and have no supplied
   * imagery, so they carry no `image` — the section's own rule is that the
   * field is set only where the picture depicts the project named. Their cards
   * show the ground-condition drawing instead, which is the designed fallback.
   */
  projects: [
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
        'An eco-sensitive, forested and sloping site where excavation could disturb tree roots, soil and terrain. PEN offered a zero-excavation foundation approach aligned with the project’s environmental intent.',
      result:
        'Foundation installation with minimal site disturbance, supporting construction while preserving the character of the land.',
    },
    {
      name: 'Startup Eco-Ashram',
      location: 'Kudal, Maharashtra',
      application: 'First commercial-scale deployment',
      image: {
        src: '/media/images/homepage/startup-ecoashram.png',
        alt: 'A pavilion at Startup Eco-Ashram: a curved shingled roof over white walls, raised above a wooded slope on a splayed bamboo frame',
      },
      challenge:
        'Deliver PEN at commercial scale outside its initial Kerala deployments and across a new site context. PEN offered repeatable manufactured foundation points, rapid installation and reduced wet work.',
      result:
        'A major deployment that helped move PEN from pilots toward repeatable commercial delivery.',
    },
    {
      name: 'Devagiri College Library',
      location: 'Kozhikode, Kerala',
      application: 'Institutional building on a constrained site',
      image: {
        src: '/media/images/homepage/devagiri-library.png',
        alt: 'The Devagiri College Library at night: a tall cylindrical reading tower in a black steel grid, lit from within, with a figure walking past at ground level',
      },
      challenge:
        'Install foundations in a constrained institutional context while limiting disruption. PEN offered compact equipment, minimal excavation and an engineered installation sequence.',
      // HANDOFF states the award as "SSMB 2024 Best Commercial Steel Structure".
      // The previous wording here was "Best Steel Structure in India at SSMB
      // 2024", from DECK. HANDOFF is the later document and names the category
      // more narrowly, so it wins.
      result:
        'The completed structure received the SSMB 2024 Best Commercial Steel Structure recognition.',
    },
    {
      name: 'Bethel Residency',
      location: 'Kozhikode, Kerala',
      application: 'Low-rise residential',
      challenge:
        'Deliver a low-rise residential foundation through a faster and less site-intensive process. PEN offered reduced excavation and curing dependency, with engineered points supporting the approved structure.',
      result: 'A built residential reference for the PEN system.',
    },
    {
      name: 'Bengaluru Farmhouse',
      location: 'Bengaluru region, Karnataka',
      application: 'Remote-site farmhouse',
      challenge:
        'Remote-site execution, labour constraints and a time-sensitive programme. PEN offered a rapid, low-wet-work installation process with reduced dependency on excavation and prolonged site activity.',
      result:
        'Foundation installation completed within the planned rapid execution window, enabling the structure to proceed quickly.',
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
 * Homepage project estimator.
 *
 * REBUILT to HANDOFF's PAGE 1 calculator spec. Three changes, all of them its
 * instructions rather than preferences:
 *
 *   1. The input is BUILT-UP AREA in square feet. "Use built-up area in sq. ft.
 *      as the primary input, not foundation-point count."
 *   2. The COST CARD IS GONE. "REMOVE: the current cost-savings output. Cost is
 *      too project- and site-dependent for a generic public calculator."
 *   3. Figures are BANDS. The unit count is sourced as a range and everything
 *      downstream of it inherits that range.
 *
 * The arithmetic lives in lib/calculator/savings.ts. The rates quoted in
 * `basis` are that module's constants written out in prose — they are printed
 * on the card so a visitor can check the figures above them, and if a constant
 * ever moves, this text moves with it.
 *
 * The programme card states approved wording rather than a computed number.
 * HANDOFF's verification box lists "final installation-time statement" among
 * the seven items to reconcile before publishing, and its claims-control table
 * says to use "installs within hours, with no on-site foundation curing cycle"
 * until one exact duration is signed off. A day count derived from an
 * unreconciled rate is exactly what that instruction rules out.
 */
export const calculator: CalculatorContent = {
  // HANDOFF section heading, verbatim — already the heading here.
  heading: 'What could PEN mean for your project?',
  body: {
    // HANDOFF supporting line, then the assessment link this section has always
    // ended on. The old lead promised "programme time and site cost", which the
    // card no longer computes.
    lead: 'A foundation that gives time back to the programme and leaves more of the land intact. Set your built-up area to see the indicative scale of a PEN foundation for it — for figures against your own drawings and soil data, ',
    linkLabel: 'ask for a project assessment',
    linkHref: '#contact',
    trail: '.',
  },
  parametersTitle: 'Project Parameters',
  areaLabel: 'Built-up area',
  areaUnit: 'sq ft',
  // 500–10,000 sq ft in 100 sq ft steps, opening on the 1,000 sq ft structure
  // HANDOFF works its illustrative output from. The band is the low-rise range
  // the system is sold for; above it the note about G+2 in `applications`
  // becomes the governing statement, not this slider.
  area: { min: 500, max: 10_000, step: 100, initial: 1_000 },
  // Context for the assessment request, not an input to the arithmetic —
  // HANDOFF: "Show project type only as a supporting selector." Solar Farm is
  // retained but sits alongside the note in `applications` marking it an
  // application under development.
  projectTypes: [
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'eco-resort', label: 'Eco Resort' },
    { id: 'solar', label: 'Solar Farm' },
  ],
  // Mirrors UNITS_PER_SQFT_MIN/MAX and CO2_SAVED_KG_PER_UNIT in
  // lib/calculator/savings.ts. Keep in step with them.
  basis: [
    // HANDOFF illustrative output, stated as the rate the slider applies.
    '≈16–20 PEN units per 1,000 sq ft of built-up area.',
    'Subject to structural layout, soil and design.',
    // Sourced separately from the unit rate, and stated as such — the carbon
    // figure is the one a sustainability consultant will check. HANDOFF's
    // claims-control table permits it in public copy only with the comparison
    // basis, boundary and source stated, which is what this line does.
    'CO₂e: ≈106 kg/unit avoided against a conventional RCC footing, ≈5 trees — IKEA Foundation case study.',
    'Project type is recorded for the assessment; it does not change the figures above.',
    // HANDOFF requires this exact qualification on the calculator output.
    'Indicative only — not a design or a quotation.',
  ],
  unitsLabel: 'PEN units',
  unitsNote: 'Indicative point count for this area',
  // Written, not computed. See the block comment above.
  programmeValue: 'Hours, not weeks',
  programmeLabel: 'Foundation programme',
  programmeNote: 'Installed without an on-site foundation curing cycle',
  carbon: {
    label: 'CO₂e avoided',
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
/**
 * HANDOFF's CLOSING CTA for PAGE 1.
 *
 * The heading is its sentence broken across the two lines this component takes.
 * The intro is its body copy verbatim, which is more specific than the version
 * it replaces: it names what to send (location, structure, drawings, soil
 * information) and what comes back (suitability, missing inputs, next step).
 *
 * HANDOFF's contact-page guidance applies to this block too — "Avoid promising
 * an instant design or quotation from the public form" — which is why the reply
 * is described as a review with a recommended next step rather than an answer.
 */
export const homeForm: HomeFormContent = {
  titleLines: ['Tell us about your project.', 'We will tell you whether PEN fits.'],
  intro:
    'Share your location, proposed structure, drawings and available soil information. Our engineering team will review the project and respond with whether PEN Foundation is suitable, what further inputs are required, and the next step for assessment.',
  // HANDOFF primary CTA, verbatim.
  submitLabel: 'Request a Project Assessment',
};
