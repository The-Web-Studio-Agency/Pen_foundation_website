'use client';

import { Environment, Html, Lightformer, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  type CSSProperties,
  type RefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CircleGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Matrix4,
  Mesh,
  type Object3D,
  ShaderMaterial,
  Vector3,
} from 'three';

import s from '../../styles/opening3d.module.css';
import { cx } from '../primitives';
import { type ProgressSource, range, smooth } from '../scroll/useScrollProgress';

export interface HudItem {
  /**
   * Which part of the model the callout points at. The first four are the
   * hero's spots; `nodeFace`, `nailFront`, `nailRight` and `tipEnd` mark the
   * node's front face, the front-left and front-right nail pipes and the
   * front-right carbide tip as seen
   * in the default 45° view, for a labelled diagram.
   */
  anchor: 'node' | 'bolts' | 'nail' | 'tip' | 'nodeFace' | 'nailFront' | 'nailRight' | 'tipEnd';
  chip: string;
  lines: readonly string[];
  /** With `hudMode="all"`: which way the readout opens, and how high (rem). */
  side?: 'left' | 'right';
  rise?: number;
}

/**
 * How big the model sits and where, in the visible frame. `width` and
 * `height` are shares of the frame the model may take (the smaller wins);
 * `x` / `y` move it, in fractions of the frame width / scene units.
 */
export interface PenFit {
  width: number;
  portraitWidth: number;
  height: number;
  x: number;
  y: number;
  portraitY: number;
}

/** The homepage hero: sized to sit between the two copy blocks. */
const HERO_FIT: PenFit = {
  width: 0.36,
  portraitWidth: 0.71,
  height: 0.77,
  x: 0,
  y: -0.42,
  portraitY: 0.05,
};

/** For a model that is not scroll-driven: progress stays at 0. */
const STILL: ProgressSource = {
  subscribe: (listener) => {
    listener(0);
    return () => {};
  },
  current: () => 0,
};

interface PenCanvasProps {
  src: string;
  /** Scroll progress driving the grow and dive. Omit for a still stage. */
  progress?: ProgressSource;
  /** Share of the overall progress that belongs to the 3D act. */
  split?: number;
  /** Size and position of the model. Defaults to the homepage hero's. */
  fit?: PenFit;
  /** The two smaller copies drifting behind the model. On by default. */
  satellites?: boolean;
  /**
   * `cycle` (default) shows one callout at a time; `all` pins every callout
   * at once, each with a numbered dot, as a labelled diagram.
   */
  hudMode?: 'cycle' | 'all';
  /** Ground the model sits on: the floor rings and readouts follow it. */
  tone?: 'dark' | 'light';
  /** Stop rendering, e.g. while the canvas is off screen. */
  paused?: boolean;
  reduced: boolean;
  hud: readonly HudItem[];
  onReady: () => void;
  /**
   * Element that takes the drag-to-rotate gestures. The hero copy sits over
   * the canvas, so the canvas itself never sees the pointer; the stage does.
   */
  dragTarget: RefObject<HTMLElement | null>;
}

const FOV = 28;
const CAMERA_Z = 16;

/**
 * The live 3D stage behind the hero: PEN's own model, centre stage, with three
 * smaller copies drifting around it, lime load-paths pulsing down the nails,
 * and data callouts cycling over the parts.
 *
 * Scroll (via `progress`) drives everything except the idle drift: the model
 * turns and grows as the headline leaves, then the camera dives into the node
 * while the film is revealed over the top (see Opening.tsx). Visitors can also
 * turn the model by dragging: any direction with a mouse, sideways with a
 * finger (an up-down swipe stays a page scroll). It keeps spinning briefly
 * after release, and the tilt eases back to level.
 */
export function PenCanvas(props: PenCanvasProps) {
  // Phones: fewer pixels per frame, so the GPU leaves room for the scroll
  // itself. The model still reads sharp on a small screen.
  const [dpr] = useState<[number, number]>(() =>
    window.matchMedia('(pointer: coarse), (max-width: 48rem)').matches ? [1, 1.25] : [1, 1.75],
  );
  return (
    <Canvas
      className={s.canvas}
      dpr={dpr}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Stage {...props} />
      </Suspense>
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */

/** Mesh names of the four long nail pipes and their tips, as exported. */
const NAIL_MESHES = [
  'Mesh14_n3d',
  'Mesh15_n3d',
  'Mesh22_n3d',
  'Mesh23_n3d',
  'Mesh18_n3d',
  'Mesh19_n3d',
  'Mesh26_n3d',
  'Mesh27_n3d',
];

/** Where the satellites sit, as fractions of the visible frame at z = 0. */
const SATELLITES = [
  { x: -0.34, y: -0.24, z: -6, scale: 0.13, spin: [-0.03, 0.06, 0.04], phase: 2.1 },
  { x: 0.35, y: -0.22, z: -6, scale: 0.13, spin: [0.03, -0.05, -0.03], phase: 4.0 },
] as const;

/** Drag-to-rotate tuning: radians per pixel, tilt limit, spin-down. */
const DRAG_YAW = 0.009;
const DRAG_PITCH = 0.006;
const PITCH_LIMIT = 0.55;
const SPIN_FRICTION = 0.93;

/** Background colour at the centre of the stage — the fog fades to it. */
const STAGE_GREEN = '#08363d';

/* Soft lime pool on the floor under the nails. */
const FLOOR_GLOW_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FLOOR_GLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(1.0 - smoothstep(0.0, 1.0, d), 2.2) * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

const GLOW_VERTEX = /* glsl */ `
  uniform mat4 uToRoot;
  varying float vR;
  void main() {
    vec4 rootPos = uToRoot * vec4(position, 1.0);
    vR = length(rootPos.xz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* A bright band travels from the node out to the tips — load leaving the node
   and shedding into the soil — with a faint trail behind it. */
const GLOW_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying float vR;
  void main() {
    float wave = mod(uTime * 1.5, 7.5) - 0.6;
    float band = exp(-pow((vR - wave) * 2.4, 2.0));
    float trail = (vR < wave) ? smoothstep(wave - 2.2, wave, vR) * 0.22 : 0.0;
    float a = (band + trail) * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

interface GlowSet {
  main: Object3D;
  glows: { mesh: Mesh; material: ShaderMaterial }[];
}

/**
 * Per-frame glow update: each overlay's matrix into the model's own space (so
 * the shader can measure distance from the node axis), plus time and fade.
 * A plain function rather than inline in useFrame — three.js state is mutated
 * every frame by design, outside React's model.
 */
function updateGlows(
  set: GlowSet,
  scratch: { toRoot: Matrix4; rootInverse: Matrix4 },
  time: number,
  intensity: number,
) {
  scratch.rootInverse.copy(set.main.matrixWorld).invert();
  for (const { mesh, material } of set.glows) {
    scratch.toRoot.multiplyMatrices(scratch.rootInverse, mesh.matrixWorld);
    material.uniforms.uToRoot.value.copy(scratch.toRoot);
    material.uniforms.uTime.value = time;
    material.uniforms.uIntensity.value = intensity;
  }
}

/**
 * A point `frac` of the way down a nail pipe, from the node end (top, near the
 * axis) to the tip (bottom, far out). Works for a nail along either x or z.
 */
function alongNail(b: Box3, frac: number) {
  const c = b.getCenter(new Vector3());
  const alongX = b.max.x - b.min.x > b.max.z - b.min.z;
  const out = alongX
    ? Math.abs(b.max.x) > Math.abs(b.min.x)
      ? [b.min.x, b.max.x]
      : [b.max.x, b.min.x]
    : Math.abs(b.max.z) > Math.abs(b.min.z)
      ? [b.min.z, b.max.z]
      : [b.max.z, b.min.z];
  const near = alongX ? new Vector3(out[0], b.max.y, c.z) : new Vector3(c.x, b.max.y, out[0]);
  const far = alongX ? new Vector3(out[1], b.min.y, c.z) : new Vector3(c.x, b.min.y, out[1]);
  return near.lerp(far, frac);
}

/** Fade the floor rings and glow pool as the model lifts away on scroll. */
function updateFloor(
  set: { ringMaterials: LineBasicMaterial[]; floorGlowMaterial: ShaderMaterial },
  visible: number,
) {
  for (const m of set.ringMaterials) m.opacity = (m.userData.base as number) * visible;
  const scale = (set.floorGlowMaterial.userData.scale as number | undefined) ?? 1;
  set.floorGlowMaterial.uniforms.uOpacity.value = 0.55 * scale * visible;
}

function Stage({
  src,
  progress = STILL,
  split = 1,
  fit = HERO_FIT,
  satellites: showSatellites = true,
  paused,
  hudMode = 'cycle',
  tone = 'dark',
  reduced,
  hud,
  onReady,
  dragTarget,
}: PenCanvasProps) {
  const { scene } = useGLTF(src, false, true);
  const light = tone === 'light';
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const setFrameloop = useThree((st) => st.setFrameloop);

  /* ---- build: normalised main model, satellites, glow overlays ---------- */

  const built = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const dims = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const unit = 1 / Math.max(dims.x, dims.y, dims.z);

    const main = scene.clone(true);
    const satellites = SATELLITES.map(() => scene.clone(true));

    // Anchors for the callouts, in the model's own (un-normalised) space.
    const anchorOf = (name: string, pick: (b: Box3) => Vector3) => {
      const obj = main.getObjectByName(name);
      if (!obj) return center.clone();
      return pick(new Box3().setFromObject(obj));
    };
    main.updateMatrixWorld(true);
    const anchors = {
      // Upper body of the node, on the face turned toward the camera.
      node: anchorOf(
        'Centre Node',
        (b) => new Vector3(b.max.x * 0.35, b.max.y - (b.max.y - b.min.y) * 0.22, b.max.z * 0.45),
      ),
      bolts: anchorOf('Bolts', (b) => b.getCenter(new Vector3()).setY(b.max.y)),
      // Upper stretch of the two nails on the right of the 45° front view, so
      // every callout rises up and right into the open space above the model.
      nail: anchorOf('Mesh18_n3d', (b) => alongNail(b, 0.2)),
      tip: anchorOf('Mesh26_n3d', (b) => alongNail(b, 0.32)),
      // In the 45° view the camera looks along model (-x, +z): that corner of
      // the node faces it, the -x nail is front left, the +z nail front right.
      // three.js turns spaces in node names into underscores on load.
      nodeFace: anchorOf(
        'Centre_Node',
        (b) => new Vector3(b.min.x * 0.35, b.max.y - (b.max.y - b.min.y) * 0.5, b.max.z * 0.35),
      ),
      nailFront: anchorOf('Mesh22_n3d', (b) => alongNail(b, 0.45)),
      nailRight: anchorOf('Mesh18_n3d', (b) => alongNail(b, 0.5)),
      tipEnd: anchorOf('Mesh19_n3d', (b) => b.getCenter(new Vector3())),
    };

    const glowMaterial = new ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1 },
        uColor: { value: new Color('#f7dc2e').multiplyScalar(1.6) },
        uToRoot: { value: new Matrix4() },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });

    const glows: { mesh: Mesh; material: ShaderMaterial }[] = [];
    for (const name of NAIL_MESHES) {
      const target = main.getObjectByName(name);
      if (!(target instanceof Mesh)) continue;
      // One material per overlay: each carries its own root-space matrix.
      const material = glowMaterial.clone();
      const overlay = new Mesh(target.geometry, material);
      overlay.renderOrder = 2;
      target.add(overlay);
      glows.push({ mesh: overlay, material });
    }

    // Floor under the nail tips: three thin rings and a soft glow pool, built
    // in the model's own space so they sit exactly where the tips land.
    const nodeBox = new Box3().setFromObject(main.getObjectByName('Centre Node') ?? main);
    const floor = new Group();
    floor.position.set(0, box.min.y + 0.02, 0);
    const ringMaterials: LineBasicMaterial[] = [];
    for (const [radius, opacity] of [
      [2.6, 0.1],
      [4.7, 0.3],
      [5.7, 0.18],
    ] as const) {
      const points: number[] = [];
      for (let k = 0; k < 160; k++) {
        const a = (k / 160) * Math.PI * 2;
        points.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
      const material = new LineBasicMaterial({
        // On white, lime lines vanish: draw the rings in ink instead.
        color: light ? '#03222a' : '#f7dc2e',
        transparent: true,
        opacity,
        depthWrite: false,
        fog: false,
      });
      material.userData.base = opacity;
      ringMaterials.push(material);
      floor.add(new LineLoop(geometry, material));
    }
    const floorGlowMaterial = new ShaderMaterial({
      vertexShader: FLOOR_GLOW_VERTEX,
      fragmentShader: FLOOR_GLOW_FRAGMENT,
      uniforms: {
        uColor: { value: new Color('#e9c62c') },
        uOpacity: { value: 0.55 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    // Additive light on a white ground reads as a brown smudge: keep it faint.
    floorGlowMaterial.userData.scale = light ? 0.25 : 1;
    const floorGlow = new Mesh(new CircleGeometry(6, 64), floorGlowMaterial);
    floorGlow.rotation.x = -Math.PI / 2;
    floor.add(floorGlow);
    main.add(floor);

    /** Just under the node, where the green light pours out down the nails. */
    const nodeGlowAt = new Vector3(0, nodeBox.min.y + (nodeBox.max.y - nodeBox.min.y) * 0.15, 0);

    return {
      main,
      satellites,
      center,
      unit,
      anchors,
      glows,
      ringMaterials,
      floorGlowMaterial,
      nodeGlowAt,
    };
  }, [scene, light]);

  /* ---- interaction + lifecycle ----------------------------------------- */

  const mainRef = useRef<Group>(null);
  const satRefs = useRef<(Group | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const clock = useRef(0);
  // Per-frame scratch state lives in refs: three.js objects are mutated every
  // frame, and refs are the React-sanctioned place for mutable values.
  const scratch = useRef({ toRoot: new Matrix4(), rootInverse: new Matrix4() });
  const [hudIndex, setHudIndex] = useState(0);
  // The visitor's own turn of the model, added on top of the scripted pose.
  const drag = useRef({ yaw: 0, pitch: 0, spin: 0, id: -1, lastX: 0, lastY: 0, mouse: false });

  // Drag to rotate. Links and buttons keep their clicks.
  useEffect(() => {
    const el = dragTarget.current;
    if (!el) return;
    const d = drag.current;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as Element).closest('a, button')) return;
      d.id = e.pointerId;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.spin = 0;
      d.mouse = e.pointerType === 'mouse';
      el.toggleAttribute('data-dragging', true);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== d.id) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.yaw += dx * DRAG_YAW;
      d.spin = dx * DRAG_YAW;
      // Tilt only with a mouse: on touch, vertical movement is the page scroll.
      if (d.mouse) {
        d.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, d.pitch + dy * DRAG_PITCH));
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== d.id) return;
      d.id = -1;
      el.toggleAttribute('data-dragging', false);
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragTarget]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  // Mouse parallax: tracked on the window, because the hero copy sits over
  // the canvas and would swallow its pointer events.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // Cycle the callouts, like the reference's rotating readouts.
  useEffect(() => {
    if (reduced || hudMode === 'all') return;
    const id = window.setInterval(() => setHudIndex((i) => (i + 1) % hud.length), 3200);
    return () => window.clearInterval(id);
  }, [hud.length, reduced, hudMode]);

  // Stop rendering entirely once the film has covered the canvas.
  useEffect(
    () =>
      progress.subscribe((p) => {
        setFrameloop(range(p, 0, split) >= 0.999 ? 'never' : 'always');
      }),
    [progress, split, setFrameloop],
  );

  // Off screen: no frames at all.
  useEffect(() => {
    if (paused === undefined) return;
    setFrameloop(paused ? 'never' : 'always');
  }, [paused, setFrameloop]);

  /* ---- per frame -------------------------------------------------------- */

  useFrame((_, rawDelta) => {
    const main = mainRef.current;
    if (!main) return;
    const delta = Math.min(rawDelta, 0.05);
    if (!reduced) clock.current += delta;
    const t = clock.current;

    const heroP = range(progress.current(), 0, split);
    const grow = smooth(range(heroP, 0, 0.5)); // headline leaves, model grows
    const dive = smooth(range(heroP, 0.62, 1)); // camera dives into the node

    // Visible frame at z = 0 for the current viewport.
    const aspect = size.width / Math.max(size.height, 1);
    const visH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    const visW = visH * aspect;
    const portrait = aspect < 1;
    const base = Math.min(visW * (portrait ? fit.portraitWidth : fit.width), visH * fit.height);

    // After a drag: spin on and slow down; the tilt eases back to level.
    const d = drag.current;
    if (d.id === -1) {
      d.yaw += d.spin;
      d.spin *= SPIN_FRICTION;
      d.pitch += (0 - d.pitch) * 0.04;
    }

    const ptr = pointer.current;
    ptr.x += (ptr.tx - ptr.x) * 0.05;
    ptr.y += (ptr.ty - ptr.y) * 0.05;

    // Front view with the nails splayed symmetrically (they run along the
    // model's x/z axes, so 45° turns them toward the camera in pairs), a
    // slight look down onto the node, and a slow sway rather than a spin.
    main.rotation.set(
      0.22 + grow * 0.38 + dive * 0.95 + ptr.y * 0.08 + d.pitch * (1 - dive),
      Math.PI / 4 + Math.sin(t * 0.3) * 0.12 + grow * 1.1 + ptr.x * 0.14 + d.yaw,
      0,
    );
    main.position.set(
      portrait ? 0 : fit.x * visW,
      (portrait ? fit.portraitY : fit.y) + Math.sin(t * 0.8) * 0.06 * (1 - grow),
      0,
    );
    main.scale.setScalar(base * (1 + 0.75 * grow));

    camera.position.set(
      ptr.x * 0.25 * (1 - dive),
      -ptr.y * 0.15 * (1 - dive),
      CAMERA_Z - dive * 12.6,
    );
    camera.lookAt(0, 0, 0);

    SATELLITES.forEach((cfg, i) => {
      const sat = satRefs.current[i];
      if (!sat) return;
      const out = 1 + grow * 1.5;
      const bob = Math.sin(t * 0.7 + cfg.phase) * 0.12;
      sat.position.set(
        cfg.x * visW * out * (portrait ? 0.8 : 1),
        cfg.y * visH * out + bob,
        cfg.z + grow * 2,
      );
      sat.rotation.set(
        cfg.phase + t * cfg.spin[0] * 4,
        cfg.phase * 1.7 + t * cfg.spin[1] * 4,
        t * cfg.spin[2] * 4,
      );
      sat.scale.setScalar(cfg.scale * visW * (portrait ? 0.75 : 1));
    });

    updateGlows(built, scratch.current, reduced ? 1.2 : t, 1 - dive);
    updateFloor(built, 1 - grow);
  });

  const { main, satellites, center, unit, anchors, nodeGlowAt } = built;
  const active = hud[hudIndex];

  return (
    <>
      {/* Haze toward the stage colour: the far satellites recede into it, as
          the reference's out-of-focus copies do. */}
      {showSatellites ? <fog attach="fog" args={[STAGE_GREEN, 16.5, 26]} /> : null}
      <ambientLight intensity={0.3} />
      {/* Raking key from upper left: pulls the washed-concrete grain and the
          normal map out of the node's faces. */}
      <directionalLight position={[-5, 7, 5]} intensity={3.2} color="#fff4e2" />
      <directionalLight position={[5, 3, 6]} intensity={1.1} color="#ffffff" />
      {/* Lime rim from behind separates the dark steel from the forest ground. */}
      <directionalLight position={[-6, 1, -5]} intensity={1.8} color="#f7dc2e" />
      <directionalLight position={[0, -6, 4]} intensity={0.4} color="#8ab4b6" />

      {/* Procedural studio for reflections — no HDR file to fetch. The broad
          softbox overhead is what the galvanised nails read as "steel" against. */}
      <Environment resolution={256} environmentIntensity={1.5}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 6, 2]}
          rotation-x={Math.PI / 2}
          scale={[12, 6, 1]}
        />
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -6]} scale={[10, 3, 1]} />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-6, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[6, 2, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.9}
          color="#f7dc2e"
          position={[6, -1, 2]}
          rotation-y={-Math.PI / 2}
          scale={3}
        />
      </Environment>

      <group ref={mainRef}>
        <group scale={unit}>
          <primitive object={main} position={[-center.x, -center.y, -center.z]}>
            {/* Green light pouring from under the node down the nails. */}
            <pointLight
              position={nodeGlowAt.toArray()}
              color="#f2d84a"
              intensity={14}
              distance={0}
              decay={2}
            />
            {(hudMode === 'all' ? hud : active ? [active] : []).map((item, i) => (
              <Html
                key={hudMode === 'all' ? item.anchor : `${hudIndex}-${item.anchor}`}
                position={anchors[item.anchor].toArray()}
                zIndexRange={[5, 0]}
                className={cx(s.hudWrap, hudMode === 'all' && s.hudPinned, light && s.hudLight)}
              >
                <div
                  className={cx(s.hud, item.side === 'left' && s.hudLeft)}
                  style={item.rise ? ({ '--rise': `${item.rise}rem` } as CSSProperties) : undefined}
                >
                  <span className={s.hudDot} aria-hidden>
                    {hudMode === 'all' ? i + 1 : null}
                  </span>
                  <svg
                    className={s.hudLeader}
                    viewBox="0 0 88 132"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <polyline points="0,132 34,132 34,0 88,0" />
                  </svg>
                  <div className={s.hudReadout}>
                    <span className={s.hudChip}>{item.chip}</span>
                    {item.lines.map((line) => (
                      <span key={line} className={s.hudLine}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </Html>
            ))}
          </primitive>
        </group>
      </group>

      {(showSatellites ? satellites : []).map((sat, i) => (
        <group key={i} ref={(el) => void (satRefs.current[i] = el)}>
          <group scale={unit}>
            <primitive object={sat as Object3D} position={[-center.x, -center.y, -center.z]} />
          </group>
        </group>
      ))}
    </>
  );
}
