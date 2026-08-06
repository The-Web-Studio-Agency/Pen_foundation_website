/**
 * Public surface of the About feature.
 *
 * `app/` imports from here, never from a path inside the feature. Anything not
 * exported is private, which is what makes the folder safe to restructure.
 */
export { Hero } from './components/Hero';
export { NumberedFeatures } from './components/NumberedFeatures';
export { StoryValues } from './components/StoryValues';
export { PersonGrid } from './components/PersonGrid';
export {
  hero,
  numberedFeatures,
  storyValues,
  leadersIntro,
  investorsIntro,
  partnersIntro,
  advisoryBoardIntro,
} from './content';
