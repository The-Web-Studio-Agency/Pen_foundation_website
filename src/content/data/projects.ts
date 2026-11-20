export interface Project {
  slug: string;
  name: string;
  location: string;
  industry: 'Residential' | 'Commercial' | 'Institutional' | 'Solar' | 'Eco Resort';
  foundationType: string;
  soilType: string;
  installDuration: string;
  capacity: string;
  concreteSaved: string;
  year: string;
  challenge: string;
  siteConditions: string;
  approach: string;
  lessons: string;
  /** Card photo. Projects without one get a solid tile. */
  image?: { src: string; alt: string };
  /** Overrides the card's three default figures (duration, capacity, concrete). */
  cardFigures?: { label: string; value: string }[];
}

export const PROJECTS: Project[] = [
  // Full story in content/data/case-studies.ts (client case study, Nov 2026).
  {
    slug: 'black-langur-retreat',
    name: 'Black Langur Retreat Centre',
    location: 'Kalpetta, Wayanad',
    industry: 'Eco Resort',
    foundationType: 'PEN points tied by plinth beams',
    soilType: 'Soft, root-laced forest topsoil',
    installDuration: '[See story]',
    capacity: '2.2×',
    concreteSaved: '94% less cement',
    year: '2025',
    challenge:
      'A 25,000 sq ft retreat centre on forest land in Wayanad, where the condition was that the forest stays: foundations had to go in beside living trees with no excavated pits and no felling.',
    siteConditions:
      'Soft, root-laced topsoil and little room for heavy equipment among areca palms, old hardwoods, coffee and pepper.',
    approach:
      'PEN points at column and wall junctions, set beside trunks without pits and tied into one frame by plinth beams.',
    lessons: '[Client quote pending]',
    image: {
      src: '/media/projects/black-langur/video_poster.jpg',
      alt: 'Black Langur building under construction with trees standing beside its walls',
    },
    cardFigures: [
      { label: 'Trees cut', value: '0' },
      { label: 'Less settlement', value: '81%' },
      { label: 'Test load carried', value: '2.2×' },
    ],
  },
  // Full story in content/data/case-studies.ts (client case study, Nov 2026).
  {
    slug: 'devagiri-library-book-tower',
    name: 'Devagiri Library Book Tower',
    location: 'Kozhikode, Kerala',
    industry: 'Institutional',
    foundationType: '5 PEN points',
    soilType: 'Soil bearing capacity above 200 kN/m²',
    installDuration: '1 day',
    capacity: '[See story]',
    concreteSaved: '[See story]',
    // Not stated in the source (2024 is the award year, not the install).
    year: '[Year]',
    challenge:
      "A 10 m, G+2 steel book tower inside the working library of St. Joseph's College, Devagiri, on a vacuum dewatered floor the college wanted to keep — with no footing pits, no curing and no day the library closed.",
    siteConditions:
      'An existing vacuum dewatered slab inside a working library; soil bearing capacity above 200 kN/m².',
    approach:
      'Five PEN points on the stair arc, one under each column, tied with the stair shaft foundation by a 250 x 450 mm plinth beam.',
    lessons: '[See story]',
    image: {
      src: '/media/projects/devagiri/dsc00142.jpg',
      alt: 'Devagiri Library book tower lit at night',
    },
    cardFigures: [
      { label: 'Foundation installed', value: '1 day' },
      { label: 'PEN points', value: '5' },
      { label: 'Days library closed', value: '0' },
    ],
  },
  {
    slug: 'kerala-hillside-residence',
    name: 'Hillside Residence',
    location: 'Wayanad, Kerala',
    industry: 'Residential',
    foundationType: 'PEN — 4 point',
    soilType: 'Laterite, sloped',
    installDuration: '2 hours',
    capacity: '2.6×',
    concreteSaved: '80%',
    year: '[Year]',
    challenge:
      'A sloping laterite plot that made excavation and formwork slow and expensive for a single-family home.',
    siteConditions:
      'Laterite over weathered rock, ~12° slope, no vehicle access to the rear of the plot.',
    approach: 'Four PEN nodes set by hand-portable driver, no excavator mobilised to site.',
    lessons: '[What the team would change or what surprised them on this install.]',
    // STAND-IN image (a render, not this project). Replace with a site photo.
    image: {
      src: '/media/images/storysection3.png',
      alt: 'A timber-framed house raised on PEN nodes on a sloping plot',
    },
  },
  {
    slug: 'backwater-eco-resort',
    name: 'Backwater Eco Resort',
    location: 'Alappuzha, Kerala',
    industry: 'Eco Resort',
    foundationType: 'PEN — 6 point',
    soilType: 'Water-rich alluvial',
    installDuration: '1 day, 6 units',
    capacity: '2.4×',
    concreteSaved: '78%',
    year: '[Year]',
    challenge:
      'Water-table-adjacent site where conventional footings would have required continuous dewatering.',
    siteConditions:
      'Alluvial soil, high water table, root zones from mature trees the client wanted preserved.',
    approach:
      'PEN nodes set without dewatering; root zones left undisturbed within 1.5 m of each node.',
    lessons: '[What the team would change or what surprised them on this install.]',
    // STAND-IN image (illustrative, not this project). Replace with a site photo.
    image: {
      src: '/media/images/Tropical%20Prefab%20Lift%20in%20Progress.png',
      alt: 'A prefabricated cabin lifted into place beside a backwater, among palm trees',
    },
  },
  {
    slug: 'utility-solar-array-14',
    name: 'Utility Solar Array 14',
    location: '[Region]',
    industry: 'Solar',
    foundationType: 'PEN — 240 point',
    soilType: 'Sand mix',
    installDuration: '18 days, 240 points',
    capacity: '2.2×',
    concreteSaved: '82%',
    year: '[Year]',
    challenge:
      'A 240-point utility array on a tight construction schedule with a single access road.',
    siteConditions:
      'Loose sand mix over compacted subgrade, minimal load-bearing without deep footings.',
    approach: 'Single crew, sequential driving pace matched to panel-mounting crews behind them.',
    lessons: '[What the team would change or what surprised them on this install.]',
    // STAND-IN image (illustrative, not this project). Replace with a site photo.
    image: {
      src: '/media/images/ground-mounted-solar.jpeg',
      alt: 'A row of ground-mounted solar panels on a gravel bed',
    },
  },
];
