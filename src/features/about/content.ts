export interface NumberedFeature {
  number: string;
  title: string;
  body: string;
  imageSide: 'left' | 'right';
  /** Optional photo. Falls back to the gradient panel when absent. */
  image?: string;
  imageAlt?: string;
}

export interface PartnerLogo {
  name: string;
  widthClass: string;
}

// Copy below is PEN Foundation's own, taken from the About-page script in
// docs/brand/source/homepage.odt. It replaced placeholder text written to fill
// the cloned layout. Anything not covered by that document is marked
// TODO(content) rather than invented.

export const hero = {
  eyebrow: 'About PEN Foundation',
  heading: 'We questioned the one thing construction never did.',
  /**
   * The display heading, pre-split into its two rendered lines. The reveal
   * animation staggers per character across both lines as one continuous wave,
   * so the break has to be authored rather than left to text wrapping.
   */
  titleLines: ['We questioned the one thing', 'construction never did.'],
  body: 'For decades, buildings have become taller, smarter, and more efficient. Yet the foundation beneath them has largely remained unchanged. PEN Foundation began with a simple belief: if every part of construction continues to evolve, the foundation should too. That belief became years of research, engineering, testing, and real-world validation.',
};

export const numberedFeatures: NumberedFeature[] = [
  {
    number: '01',
    title: 'Every revolution begins with a question.',
    body: 'For centuries, foundations have relied on excavation, concrete, curing time, and extensive site preparation. While construction technologies advanced rapidly above the ground, the process below it remained largely unchanged. We did not begin by asking how to build a better foundation — we began by asking whether the assumptions behind conventional foundations were still necessary.',
    imageSide: 'right',
    image: '/media/images/storysection1.png',
    imageAlt: 'Conventional excavation-heavy foundation work on a construction site',
  },
  {
    number: '02',
    title: 'Nature solved this problem long before we did.',
    body: 'Tree roots distribute loads efficiently, adapt to changing soil conditions, and stabilize structures without disturbing the surrounding environment. Instead of forcing the ground to adapt to our designs, we asked how engineering could learn from nature\u2019s own foundation system. That principle became the core inspiration behind PEN Foundation\u2019s biomimetic design.',
    imageSide: 'left',
    image: '/media/images/storysection2.png',
    imageAlt:
      'Tree roots distributing load through soil — the design principle behind PEN Foundation',
  },
  {
    number: '03',
    title: 'Innovation is only meaningful when it is proven.',
    body: 'Every engineering decision demands evidence. Every claim demands validation. Every innovation demands trust. PEN Foundation has progressed from question to research, prototype, patent, testing, and field validation \u2014 supported by academic collaboration, simulation, and independent assessment.',
    imageSide: 'right',
    image: '/media/images/storysection3.png',
    imageAlt: 'PEN Foundation system installed and validated on site',
  },
];

export const storyValues = {
  heading: 'The story behind PEN Foundation',
  story:
    'Traditional foundations force the ground to accept the structure. PEN Foundation works with the natural behaviour of the soil to create a stable load-transfer system inspired by biological root networks. What began as a question about excavation became years of research, prototyping, patenting, and field validation.',
  values:
    'We do not believe innovation ends with a better product. We believe innovation begins by questioning assumptions that have been accepted for generations. PEN Foundation represents a different way of thinking about construction \u2014 one that values engineering, sustainability, and continuous improvement equally.',
};

export const leadersIntro = {
  eyebrow: 'The People Behind PEN',
  heading: 'Engineering innovation through multidisciplinary expertise',
  intro:
    'PEN Foundation is the result of collaboration between professionals with experience in structural engineering, construction, research, and product development. Together they share a common vision: redefining foundation engineering for the next generation of infrastructure.',
};

export const investorsIntro = {
  eyebrow: 'Research & Industry Ecosystem',
  heading: 'Supported by research, strengthened through collaboration',
  intro:
    'The development of PEN Foundation has been shaped through collaboration with academic institutions, research initiatives, industry experts, and innovation ecosystems. These partnerships have helped transform an engineering concept into a validated construction solution.',
};

export const partnersIntro = {
  eyebrow: 'Our Network',
  heading: 'Working alongside innovators across engineering and construction',
  intro:
    'Progress in engineering happens through collaboration. PEN Foundation continues to engage with researchers, construction professionals, sustainability initiatives, and industry partners to advance the future of foundation technology.',
};

export const advisoryBoardIntro = {
  eyebrow: 'Research & Technical Guidance',
  heading: 'Guided by engineering knowledge and practical experience',
  intro:
    'The evolution of PEN Foundation is supported by technical expertise, engineering feedback, and continuous learning. Every stage of development is driven by a commitment to improving performance, reliability, and real-world applicability.',
};

export const partnerLogos: PartnerLogo[] = [
  { name: 'Academic Institution', widthClass: 'w-32' },
  { name: 'Research Partner', widthClass: 'w-32' },
  { name: 'Innovation Ecosystem', widthClass: 'w-36' },
  { name: 'Industry Partner', widthClass: 'w-32' },
  { name: 'Engineering Collaboration', widthClass: 'w-36' },
  { name: 'Sustainability Initiative', widthClass: 'w-36' },
];
