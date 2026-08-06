import * as THREE from 'three';

/** Total scroll runway. One value drives every beat of the film. */
export const SCROLL_VH = 1500;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const phase = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Piecewise-smooth interpolation over [progress, value] control points. */
export const ramp = (p: number, pts: [number, number][]) => {
  if (p <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (p <= t1) return v0 + (v1 - v0) * smoothstep((p - t0) / (t1 - t0));
  }
  return pts[pts.length - 1][1];
};

/* ---------------------------------------------------------------- nails */

const TILT = THREE.MathUtils.degToRad(26);
const AZIMUTHS = [45, 135, 225, 315].map(THREE.MathUtils.degToRad);

export const NAIL_LENGTH = 2.3;
export const SLEEVE_RADIUS = 0.62;

export const NAILS = AZIMUTHS.map((az) => ({
  dir: new THREE.Vector3(
    Math.sin(TILT) * Math.cos(az),
    -Math.cos(TILT),
    Math.sin(TILT) * Math.sin(az),
  ).normalize(),
  entry: new THREE.Vector3(Math.cos(az) * SLEEVE_RADIUS, 0.06, Math.sin(az) * SLEEVE_RADIUS),
}));

/** Scroll ranges in which each nail drives in. */
export const NAIL_PHASES: [number, number][] = [
  [0.205, 0.275],
  [0.285, 0.355],
  [0.365, 0.435],
  [0.445, 0.515],
];

export const LOAD_PHASE: [number, number] = [0.53, 0.66];
export const BUILDING_PHASE: [number, number] = [0.65, 0.78];

/* --------------------------------------------------------------- camera */

export interface CamKey {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

/**
 * The film's shot list. Keys 0.002 apart act as hard cuts; keys further apart
 * are slow moves (push-ins, drifts) inside a shot. The product is always framed
 * off-centre so typography owns the negative space.
 */
export const CAMERA_KEYS: CamKey[] = [
  // SHOT 1 — hero side profile, low, slow push-in (node ≈ half the frame)
  { t: 0.0, pos: [2.35, 0.65, 2.15], look: [-0.38, 0.34, 0], fov: 34 },
  { t: 0.08, pos: [2.1, 0.6, 1.95], look: [-0.34, 0.34, 0], fov: 34 },
  // CUT — SHOT 2: detail on a cast-in GI sleeve mouth, slow drift (framed to read, not blur)
  { t: 0.082, pos: [1.5, 1.15, 1.7], look: [0.28, 0.55, 0.28], fov: 32 },
  { t: 0.15, pos: [1.35, 1.05, 1.55], look: [0.3, 0.52, 0.3], fov: 32 },
  // CUT — SHOT 3: top angle revealing the four-sleeve geometry, then the dive
  { t: 0.152, pos: [0.7, 4.3, 1.3], look: [0, 0.25, 0], fov: 40 },
  { t: 0.185, pos: [0.45, 2.9, 1.05], look: [0, 0.1, 0], fov: 40 },
  { t: 0.2, pos: [0.3, -1.7, 5.6], look: [0, -1.25, 0], fov: 42 }, // plunge to section
  // CUT — SHOT 4: nail 01, low angle looking up the drive line
  { t: 0.207, pos: [2.5, -2.4, 3.6], look: [0.7, -0.85, 0.7], fov: 40 },
  { t: 0.275, pos: [2.2, -2.2, 3.2], look: [0.72, -0.95, 0.72], fov: 40 },
  // CUT — SHOT 5: nail 02, clean side profile
  { t: 0.283, pos: [-3.6, -0.9, 3.0], look: [-0.6, -1.0, 0.6], fov: 38 },
  { t: 0.355, pos: [-3.2, -1.0, 2.7], look: [-0.65, -1.0, 0.65], fov: 38 },
  // CUT — SHOT 6: nail 03, tip biting into strata — pulled back to read
  { t: 0.363, pos: [-2.9, -1.4, 1.7], look: [-0.7, -1.35, -0.55], fov: 38 },
  { t: 0.435, pos: [-2.6, -1.5, 1.5], look: [-0.72, -1.4, -0.58], fov: 38 },
  // CUT — SHOT 7: nail 04, three-quarter from above grade line
  { t: 0.443, pos: [3.4, -0.5, 2.6], look: [0.6, -1.0, -0.5], fov: 40 },
  { t: 0.515, pos: [3.0, -0.8, 2.2], look: [0.65, -1.05, -0.6], fov: 40 },
  // CUT — SHOT 8: full section elevation, slow pull while load transfers
  { t: 0.523, pos: [0.2, -0.9, 7.8], look: [0, -1.3, 0], fov: 40 },
  { t: 0.64, pos: [0.2, -0.6, 8.6], look: [0, -1.2, 0], fov: 40 },
  // SHOT 9 — surfacing into a low-angle architectural shot as the tower rises
  { t: 0.66, pos: [2.4, 0.25, 6.4], look: [0, 1.1, 0], fov: 36 },
  { t: 0.78, pos: [3.2, 0.5, 7.4], look: [0, 1.9, 0], fov: 36 },
  // CUT — SHOT 10: long-lens architectural wide, building off-centre in haze
  { t: 0.783, pos: [-7.5, 1.9, 10.5], look: [-0.8, 1.7, 0], fov: 33 },
  { t: 0.9, pos: [-8.2, 2.2, 11.2], look: [-0.9, 1.7, 0], fov: 33 },
  // SHOT 11 — finale drift, silhouette
  { t: 1.0, pos: [-3.0, 1.1, 11.5], look: [0, 1.5, 0], fov: 38 },
];

export const INTRO_CAM = {
  pos: new THREE.Vector3(4.6, 1.05, 4.3),
  look: new THREE.Vector3(-0.38, 0.34, 0),
};

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

/** Sample the camera path at progress p. Writes into outPos/outLook, returns fov. */
export function cameraAt(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3): number {
  const keys = CAMERA_KEYS;
  if (p <= keys[0].t) {
    outPos.fromArray(keys[0].pos);
    outLook.fromArray(keys[0].look);
    return keys[0].fov;
  }
  for (let i = 0; i < keys.length - 1; i++) {
    const k0 = keys[i];
    const k1 = keys[i + 1];
    if (p <= k1.t) {
      const u = smoothstep((p - k0.t) / (k1.t - k0.t));
      outPos.lerpVectors(_a.fromArray(k0.pos), _b.fromArray(k1.pos), u);
      outLook.lerpVectors(_a.fromArray(k0.look), _b.fromArray(k1.look), u);
      return k0.fov + (k1.fov - k0.fov) * u;
    }
  }
  const last = keys[keys.length - 1];
  outPos.fromArray(last.pos);
  outLook.fromArray(last.look);
  return last.fov;
}
