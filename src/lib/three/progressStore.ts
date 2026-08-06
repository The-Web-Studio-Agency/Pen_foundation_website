/**
 * Shared mutable scroll state. Written by ScrollTrigger / the intro timeline,
 * read every frame by the WebGL scene and the HTML overlay — no React re-renders.
 */
export const store = {
  /** raw scroll progress 0..1 from ScrollTrigger */
  raw: 0,
  /** damped progress used by camera, lights and overlays */
  smooth: 0,
  /** intro camera-discovery progress 0..1 (time-based, before scroll unlocks) */
  introT: 0,
  introDone: false,
  /** true once the viewer has scrolled past the film runway into the editorial */
  pastFilm: false,
};
