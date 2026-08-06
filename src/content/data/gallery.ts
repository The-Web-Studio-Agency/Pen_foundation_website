export type GalleryCategory =
  | 'Projects'
  | 'Construction'
  | 'Installation'
  | 'Drone'
  | 'Testing'
  | 'Events'
  | 'Awards'
  | 'Videos';

export interface GalleryItem {
  id: string;
  label: string;
  category: GalleryCategory;
}

export const CATEGORIES: GalleryCategory[] = [
  'Projects',
  'Construction',
  'Installation',
  'Drone',
  'Testing',
  'Events',
  'Awards',
  'Videos',
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g01', label: 'Hillside residence · exterior', category: 'Projects' },
  { id: 'g02', label: 'Node cast, day 1', category: 'Construction' },
  { id: 'g03', label: 'Nail driver, 26° set', category: 'Installation' },
  { id: 'g04', label: 'Site overview, aerial', category: 'Drone' },
  { id: 'g05', label: 'Lateral load rig', category: 'Testing' },
  { id: 'g06', label: 'Groundbreaking, [event]', category: 'Events' },
  { id: 'g07', label: '[Award name], [year]', category: 'Awards' },
  { id: 'g08', label: 'Two-hour install, full sequence', category: 'Videos' },
  { id: 'g09', label: 'Backwater resort · units 1–6', category: 'Projects' },
  { id: 'g10', label: 'Sleeve set, cast-in', category: 'Construction' },
  { id: 'g11', label: 'Solar array, point 140', category: 'Installation' },
  { id: 'g12', label: 'Array overview, aerial', category: 'Drone' },
];
