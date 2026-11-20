/**
 * Page-level copy that used to be written inline in the page components:
 * hero labels, headings, leads, buttons and hero images. Each object is
 * editable in the admin (/web-admin).
 */

import { cms } from '@/lib/cms/store';

export const blogsPageCopy = cms('blog.page', {
  hero: {
    kicker: 'Blogs',
    title: 'Notes from the engineering journal',
    lead: 'Working papers on load paths, soil behaviour and what changes when a foundation is driven instead of poured.',
    image: {
      src: '/media/projects/devagiri/readers.jpg',
      alt: 'Readers with books in a library built on PEN foundations',
    },
  },
  index: { chip: 'The journal', heading: 'Every article, by subject' },
});

export const galleryPageCopy = cms('gallery.page', {
  hero: {
    kicker: 'Gallery',
    title: 'The archive',
    lead: 'Site photography, installation sequences, and engineering documentation from PEN Foundation deployments.',
    image: {
      src: '/media/projects/devagiri/aerial.jpg',
      alt: 'Aerial view of a campus building and its grounds',
    },
  },
  grid: { chip: 'On site', heading: 'Projects, installs and testing on site' },
});

export const certificationsPageCopy = cms('certifications.page', {
  hero: {
    kicker: 'Certifications',
    viewLabel: 'View the certificate',
    allDocumentsLabel: 'All documents',
    image: {
      src: '/media/images/homepage/capability-02-poster.webp',
      alt: 'A PEN precast node set on prepared ground, its nails splayed into the soil',
    },
  },
  related: {
    docsBody: 'Technical documentation and downloads',
    blogsBody: 'Notes from the engineering journal',
  },
});

export const docsPageCopy = cms('docs.page', {
  hero: {
    kicker: 'Docs',
    lead: 'Certificates, datasheets and guides for the PEN Foundation system. Each file is listed here as soon as it is published.',
    action: 'Browse the library',
    availableLabel: 'Available now',
    pendingLabel: 'In preparation',
    image: {
      src: '/media/projects/black-langur/pl_truss.jpg',
      alt: 'A steel roof truss on a cleared site among trees',
    },
  },
  library: {
    chip: 'Library',
    heading: 'Every document in one place',
    lead: 'Available files open as PDFs. The rest are being prepared and will appear here once they are published.',
    available: 'Available',
    soon: 'Coming soon',
    download: 'Download',
  },
  related: { blogsBody: 'Notes from the engineering journal' },
});

export const contactPageCopy = cms('contact.page', {
  hero: {
    kicker: 'Contact',
    enquiryLabel: 'Send an enquiry',
    callLabel: 'Call us',
    image: {
      src: '/media/projects/black-langur/inst_3.jpg',
      alt: 'An installation crew working together on site',
    },
  },
  form: { chip: 'Enquiry', helpsLabel: 'How we can help' },
});

/* ---- gallery photographs, keyed by gallery entry id ---------------------- */

/**
 * Archive entries are labels only — no picture is attached to any of them
 * yet. Where one of PEN's existing photographs is plainly the thing an entry
 * names, it is shown; every other entry renders as a labelled tile until its
 * photograph is supplied. Add an entry here (keyed by gallery id) to attach one.
 */
export const galleryPhotos: Partial<Record<string, { src: string; alt: string }>> = cms(
  'gallery.photos',
  {
    // "Site overview, aerial" — the aerial of a plot set out for foundation points.
    g04: {
      src: '/media/images/storysection2.png',
      alt: 'Aerial view of a cleared plot set out with string lines, paddy fields either side',
    },
    /*
     * STAND-INS from PEN's existing imagery, chosen to match each label so the
     * gallery can be shown. Swap each for the entry's own photograph.
     */
    g01: {
      src: '/media/images/storysection3.png',
      alt: 'A timber-framed house raised on PEN nodes on a sloping plot',
    },
    g02: {
      src: '/media/images/homepage/capability-02-poster.webp',
      alt: 'A PEN precast node set on prepared ground, its nails splayed into the soil',
    },
    g03: {
      src: '/media/projects/black-langur/inst_2.jpg',
      alt: 'Installers in hard hats driving a nail pipe through a PEN node',
    },
    g05: {
      src: '/media/projects/black-langur/pl_dials.jpg',
      alt: 'Dial gauges set up on a plate load test rig in a test pit',
    },
    g08: {
      src: '/media/projects/black-langur/inst_3.jpg',
      alt: 'A crew working together to drive a PEN nail on site',
    },
    g09: {
      src: '/media/images/Tropical%20Prefab%20Lift%20in%20Progress.png',
      alt: 'A prefabricated cabin lifted into place beside a backwater, among palm trees',
    },
    g10: {
      src: '/media/projects/devagiri/install-crop.jpg',
      alt: 'A PEN node set into a cut in an existing floor, its nails driven into the soil',
    },
    g11: {
      src: '/media/images/ground-mounted-solar.jpeg',
      alt: 'A row of ground-mounted solar panels on a gravel bed',
    },
    g12: {
      src: '/media/images/homepage/capability-01-poster.webp',
      alt: 'Aerial view of a cleared site set out for foundation points',
    },
  },
);

/* ---- partners page photographs, figures and form options ----------------- */

type Photo = { src: string; alt: string; contain?: boolean };

/*
 * STAND-IN photographs from PEN's existing imagery, chosen to match each
 * block. Replace with the partners' own photos as they are supplied.
 */
export const partnersPhotos = cms('partners.photos', {
  provider: {
    src: '/media/images/homepage/Benglaru-Farmhouse.png',
    alt: 'A farmhouse in the Bengaluru region built on PEN foundations',
  },
  reseller: {
    src: '/media/images/pen.png',
    alt: 'A PEN node with its four nail pipes, bolts and carbide tips',
    contain: true,
  },
  installers: {
    src: '/media/projects/black-langur/inst_3.jpg',
    alt: 'An installation crew working together to drive a PEN nail',
  },
  steps: [
    {
      src: '/media/projects/black-langur/plan_family.jpg',
      alt: 'A foundation layout drawing with PEN points marked',
    },
    {
      src: '/media/projects/black-langur/inst_2.jpg',
      alt: 'Installers learning to drive a nail pipe through a PEN node',
    },
    {
      src: '/media/projects/devagiri/install-crop.jpg',
      alt: 'A PEN node installed into a cut in an existing floor',
    },
    {
      src: '/media/images/homepage/capability-02-poster.webp',
      alt: 'A completed PEN node set in prepared ground',
    },
  ],
  why: [
    {
      src: '/media/images/pen.png',
      alt: 'A PEN node with its four nail pipes, bolts and carbide tips',
      contain: true,
    },
    {
      src: '/media/projects/devagiri/plan_install.jpg',
      alt: 'Photos of a PEN installation in progress on site',
    },
    {
      src: '/media/projects/black-langur/plan_node.jpg',
      alt: 'An engineering section drawing of a PEN node and its nails',
      contain: true,
    },
  ],
} satisfies Record<string, Photo | Photo[]>);

/** Figures quoted elsewhere on the site, unchanged, as trust signals. */
export const partnersFacts = cms('partners.facts', [
  { value: '2.0–2.6×', label: 'Enhancement Factor of soil bearing capacity' },
  { value: 'IS 2911', label: 'Part 4, the code the design follows' },
  { value: 'GRIHA', label: 'Listed in the GRIHA Product Catalogue' },
]);

/** Options for the partner enquiry form (UI labels, not claims). */
export const partnersTopics = cms('partners.topics', [
  'Become a solution provider',
  'Become a reseller',
  'Apply as a certified installer',
  'Find an authorised partner near me',
  'Something else',
]);
