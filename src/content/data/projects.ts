export interface Project {
  slug: string;
  name: string;
  location: string;
  industry: 'Residential' | 'Commercial' | 'Solar' | 'Eco Resort';
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
}

export const PROJECTS: Project[] = [
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
  },
];
