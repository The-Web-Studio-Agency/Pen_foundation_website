/**
 * Audience copy added to the application pages.
 *
 * SOURCE
 *   The client's "PEN Foundation Website V3" handoff (November 2026). V3 has
 *   five audience pages; the two that match one of our six applications are
 *   carried over here, in V3's words:
 *     - "For project owners"                     -> Residential
 *     - "For modular, prefab & steel companies"  -> Modular and prefab
 *   The other three (Architects & Engineers, Developers & Builders,
 *   Institutional) are written for a role, not a building type, so they have
 *   no application page to live on and are not used.
 *
 * LEFT OUT ON PURPOSE
 *   V3's "Built proof" block on the owners page (Bethel Residency, 42 points;
 *   Bengaluru Farmhouse) carries the client's own flag: "Confirm Bethel unit
 *   count (42) and client consent to name both projects." Add it once that is
 *   confirmed. The page's "Related projects" section already lists projects.
 *
 * Copy follows V3's rules: no dashes as punctuation, ranges with "to", no
 * contractions.
 */

export interface AudienceCard {
  title: string;
  body?: string;
}

export interface AudienceClosing {
  heading: string;
  lead?: string;
  label: string;
}

export interface ContrastRow {
  label: string;
  title: string;
  /** Stage names, drawn as segments of one bar; `weight` sets each width. */
  stages?: { label: string; weight?: number }[];
  /** A single solid bar with this text instead of stages. */
  text?: string;
  /** Share of the full bar width, 0 to 1. Default 1. */
  scale?: number;
  tone: 'conventional' | 'pen';
}

export type AudienceBlock =
  | {
      kind: 'contrast';
      ground: 'light' | 'paper' | 'dark';
      chip: string;
      heading: string;
      lead?: string;
      points?: string;
      /** Heading over the two bars. */
      rowsHeading?: string;
      rows: ContrastRow[];
      note?: string;
      cards?: AudienceCard[];
    }
  | {
      kind: 'cards';
      ground: 'light' | 'paper' | 'dark';
      chip: string;
      heading: string;
      lead?: string;
      /** Short labels shown as a list of chips above the cards. */
      tagsLabel?: string;
      tags?: string[];
      cards: AudienceCard[];
      numbered?: boolean;
      caption?: string;
      closing?: AudienceClosing;
    }
  | {
      kind: 'faq';
      ground: 'light' | 'paper' | 'dark';
      chip: string;
      heading: string;
      items: { q: string; a: string }[];
      closing?: AudienceClosing;
    };

export interface ApplicationAudience {
  /** Between the hero and the shared "Why PEN" section. */
  before: AudienceBlock[];
  /** After the shared process section, before related projects. */
  after: AudienceBlock[];
}

/* ---- Residential: V3 "For project owners" -------------------------------- */

const projectOwners: ApplicationAudience = {
  before: [
    {
      kind: 'contrast',
      ground: 'light',
      chip: 'For project owners',
      heading: 'A different way to start your project.',
      lead: 'A conventional foundation takes 30 to 40 days of digging, pouring and curing before the building can begin. On a qualified, ready site, each PEN Foundation installs in 2 to 4 hours.',
      points: 'No footing pits. Less wet work. No curing wait.',
      rowsHeading: 'The foundation should not be the first bottleneck.',
      rows: [
        {
          tone: 'conventional',
          label: 'Conventional RCC footing',
          title: '30 to 40 days',
          // Indicative widths, as V3 says; curing is the 21 days it states.
          stages: [
            { label: 'Excavate', weight: 4 },
            { label: 'Reinforce + form', weight: 6 },
            { label: 'Pour', weight: 2 },
            { label: 'Curing, 21 days', weight: 21 },
            { label: 'Test', weight: 3 },
          ],
        },
        {
          tone: 'pen',
          label: 'PEN Foundation',
          title: '2 to 4 hours per point',
          text: 'Ready for the approved structural connection after quality checks',
          // Hours against days on the same scale: a sliver.
          scale: 0.012,
        },
      ],
      note: 'Both bars on one time scale. Conventional stage widths are indicative; curing alone is 21 days.',
      cards: [
        {
          title: 'No footing pits',
          body: 'No excavation, spoil handling or open trenches around the building footprint.',
        },
        {
          title: 'No curing wait',
          body: 'The node is cured in the factory. Nothing is cast and left to cure on your site.',
        },
        {
          title: 'A cleaner site',
          body: 'Fewer wet-work activities make the foundation stage more predictable.',
        },
        {
          title: 'Engineered for your building',
          body: 'Point count and layout come from your loads, soil and structure, not your square footage.',
        },
      ],
    },
    {
      kind: 'cards',
      ground: 'dark',
      chip: 'What you are building on',
      heading: 'Compact above ground. Engineered below it.',
      lead: 'The visible node looks small next to an RCC footing. It is only one part of the system.',
      cards: [
        {
          title: 'M50 precast node',
          body: 'High-strength concrete, made and cured under factory control.',
        },
        {
          title: 'Four inclined galvanized steel nails',
          body: 'Driven into the surrounding soil at designed angles.',
        },
        {
          title: 'Protected steel',
          body: 'Hot-dip galvanized pipes, grouted along their length.',
        },
        {
          title: 'Engineered connection',
          body: 'Detailed for RCC, structural steel, LGSF or prefab above.',
        },
      ],
      caption:
        'What you see is the node. What carries the building is the node, nail and soil system.',
    },
    {
      kind: 'cards',
      ground: 'paper',
      chip: 'Is PEN right for your project?',
      heading: 'That answer comes from engineering, not a calculator.',
      lead: 'Start with basic project information. Final feasibility needs structural and soil inputs. We look at four things.',
      numbered: true,
      cards: [
        { title: 'The building', body: 'Use, floors, structural system and foundation layout.' },
        { title: 'The loads', body: 'Column or support reactions and other structural actions.' },
        { title: 'The ground', body: 'Soil profile, groundwater and site conditions.' },
        { title: 'The interface', body: 'How your building connects to the foundation.' },
      ],
    },
  ],
  after: [
    {
      kind: 'faq',
      ground: 'light',
      chip: 'Questions owners ask',
      heading: 'Before you call.',
      items: [
        {
          q: 'Do I need a soil report before contacting C-DISC?',
          a: 'No. Start the conversation early. Soil information becomes necessary before engineering approval.',
        },
        {
          q: 'Can PEN support an RCC house?',
          a: 'Suitable RCC and masonry buildings are evaluated within the current engineering envelope. Loads, soil and connection details decide suitability.',
        },
        {
          q: 'Can PEN work with steel or prefab?',
          a: 'Yes. Steel, LGSF, modular and prefab systems are strong candidates, subject to structural and soil review.',
        },
        {
          q: 'How many PEN Foundations will I need?',
          a: 'The number comes from the approved layout, not from built-up area alone.',
        },
        {
          q: 'How long will it last?',
          a: 'PEN is designed for a 50-year service life with micro-concrete infill.',
        },
      ],
      closing: {
        heading: 'Have a project in mind?',
        lead: 'Share the location, building type and whatever drawings you have today.',
        label: 'Assess My Project',
      },
    },
  ],
};

/* ---- Modular and prefab: V3 "For modular, prefab & steel companies" ------- */

const modularOems: ApplicationAudience = {
  before: [
    {
      kind: 'contrast',
      ground: 'light',
      // V3's menu label for this audience; the page title is longer than a
      // chip can hold on a phone.
      chip: 'For modular and steel OEMs',
      // Non-breaking hyphen keeps "pre-engineered" on one line.
      heading: 'Your building is pre\u2011engineered. Your foundation can be too.',
      lead: 'PEN pairs a factory-made M50 node and galvanized steel nails with an interface designed around your building system. The opportunity is a repeatable foundation interface, not just faster foundations.',
      rowsHeading: 'Factory speed above ground. Conventional civil work below it.',
      rows: [
        {
          tone: 'pen',
          label: 'In the factory',
          title: 'Your structure',
          text: 'Fabricated, checked and ready to assemble on a known date.',
        },
        {
          tone: 'conventional',
          label: 'On site, today',
          title: 'Your foundation',
          stages: [
            { label: 'Excavation' },
            { label: 'Reinforcement' },
            { label: 'Formwork' },
            { label: 'Concrete' },
            { label: 'Water' },
            { label: 'Curing' },
          ],
        },
      ],
    },
    {
      kind: 'cards',
      ground: 'dark',
      chip: 'Engineering interface',
      heading: 'Start with the building system.',
      lead: 'An OEM integration reviews your support conditions once, then reuses the result across models.',
      tagsLabel: 'What the review covers',
      tags: [
        'Support positions',
        'Base geometry',
        'Compression reactions',
        'Uplift',
        'Lateral actions',
        'Connection details',
        'Permissible movement',
        'Building variants',
        'Typical site conditions',
      ],
      cards: [
        { title: 'M50 precast node', body: 'A controlled structural component.' },
        { title: 'Galvanized steel nails', body: 'Typical four-nail configuration.' },
        {
          title: 'Engineered interface',
          body: 'Bolted Variant A for steel, LGSF and prefab bases.',
        },
        {
          title: 'Site-specific engineering',
          body: 'A repeatable superstructure does not remove soil qualification.',
        },
      ],
    },
    {
      kind: 'cards',
      ground: 'paper',
      chip: 'Integration pathway',
      heading: 'Engineer the interface once.',
      numbered: true,
      cards: [
        { title: 'Representative model', body: 'One building type with its reactions.' },
        { title: 'Interface review', body: 'Base plate, bolts, tolerances.' },
        { title: 'Pilot project', body: 'One live site.' },
        { title: 'Connection validation', body: 'Measured on the pilot.' },
        { title: 'Repeatable intake', body: 'Standard inputs for every order.' },
      ],
      closing: {
        heading: 'Build a repeatable process around one good interface.',
        label: 'Start an OEM Integration Review',
      },
    },
  ],
  after: [],
};

/** Keyed by application slug (applications.items in content/data/homepage.ts). */
export const applicationAudiences: Record<string, ApplicationAudience> = {
  residential: projectOwners,
  'modular-and-prefab': modularOems,
};
