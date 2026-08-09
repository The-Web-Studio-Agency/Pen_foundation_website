'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { store } from '@/lib/three/progressStore';
import { NAILS, NAIL_PHASES, NAIL_LENGTH, phase, smoothstep } from '@/lib/three/story';

const UP = new THREE.Vector3(0, 1, 0);

const steel = {
  color: '#c4ced2',
  metalness: 1,
  roughness: 0.26,
  envMapIntensity: 1.3,
} as const;

/** Galvanised iron — duller, zinc-grey, not polished chrome. */
const galvanised = {
  color: '#aab4b8',
  metalness: 0.75,
  roughness: 0.45,
  envMapIntensity: 0.9,
} as const;

/**
 * One helical ground nail, head at local origin, tip at -Y.
 * Nails are installation components: invisible until their chapter begins,
 * then they appear poised above the sleeve and drive to full depth.
 */
function Nail({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null!);
  const { dir, entry } = NAILS[index];

  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().negate()),
    [dir],
  );

  const helixGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 2.2;
    const helixR = 0.085;
    for (let i = 0; i < 60; i++) {
      const k = i / 59;
      const ang = k * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(ang) * helixR, -0.5 - k * 1.4, Math.sin(ang) * helixR));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.014, 6, false);
  }, []);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const [a, b] = NAIL_PHASES[index];
    const p = store.smooth;
    // Not part of the hero object — the nail exists only once its story beat starts.
    group.current.visible = p > a - 0.012;
    if (!group.current.visible) return;
    const u = smoothstep(phase(p, a, b));
    tmp
      .copy(dir)
      .multiplyScalar(u * (NAIL_LENGTH - 0.15) - NAIL_LENGTH)
      .add(entry);
    group.current.position.copy(tmp);
  });

  return (
    <group ref={group} quaternion={quaternion} visible={false}>
      {/* head / drive coupler */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.1, 24]} />
        <meshStandardMaterial {...steel} roughness={0.38} />
      </mesh>
      {/* shaft */}
      <mesh position={[0, -NAIL_LENGTH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.038, NAIL_LENGTH - 0.2, 24]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* helical flight */}
      <mesh geometry={helixGeometry}>
        <meshStandardMaterial {...steel} roughness={0.32} />
      </mesh>
      {/* hardened tip — the one deliberate touch of brand teal */}
      <mesh position={[0, -(NAIL_LENGTH - 0.1), 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.05, 0.22, 18]} />
        <meshStandardMaterial
          color="#057c86"
          metalness={0.55}
          roughness={0.4}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}

const NODE_H = 0.55;
const NODE_BASE_Y = 0.05; // sits on the plinth pad
const PIPE_LEN = 1.15;

/**
 * The PEN node — the hero object: a precast yellow concrete block, square and
 * tapered like a pile cap, with four galvanised pipe sleeves cast in at 26°
 * and a steel cap plate. Nails come later; this is the product's identity.
 */
export function PenSystem() {
  const sleeves = useMemo(
    () =>
      NAILS.map(({ dir, entry }) => ({
        quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().negate()),
        position: entry.clone(), // pipe centred on the grade-level entry point
        mouth: entry.clone().addScaledVector(dir, -PIPE_LEN / 2), // upper mouth
      })),
    [],
  );

  return (
    <group>
      {/* precast concrete node — square frustum, crisp facets, safety yellow */}
      <mesh
        position={[0, NODE_BASE_Y + NODE_H / 2, 0]}
        rotation-y={Math.PI / 4}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.67, 0.95, NODE_H, 4, 1]} />
        <meshStandardMaterial color="#dfa826" roughness={0.82} metalness={0} flatShading />
      </mesh>
      {/* recessed band at the base — precast reveal joint */}
      <mesh position={[0, NODE_BASE_Y + 0.035, 0]} rotation-y={Math.PI / 4}>
        <cylinderGeometry args={[0.93, 0.93, 0.07, 4, 1]} />
        <meshStandardMaterial color="#8a6a1c" roughness={0.9} metalness={0} flatShading />
      </mesh>
      {/* steel cap plate */}
      <mesh position={[0, NODE_BASE_Y + NODE_H + 0.015, 0]} castShadow>
        <boxGeometry args={[0.36, 0.03, 0.36]} />
        <meshStandardMaterial {...galvanised} roughness={0.4} />
      </mesh>

      {/* GI pipe sleeves, cast through the node */}
      {sleeves.map((s, i) => (
        <group key={i}>
          <mesh position={s.position} quaternion={s.quaternion} castShadow>
            <cylinderGeometry args={[0.095, 0.095, PIPE_LEN, 24]} />
            <meshStandardMaterial {...galvanised} />
          </mesh>
          {/* dark bore at the mouth */}
          <mesh position={s.mouth} quaternion={s.quaternion}>
            <cylinderGeometry args={[0.072, 0.072, 0.025, 20]} />
            <meshStandardMaterial color="#012c32" roughness={1} metalness={0} />
          </mesh>
        </group>
      ))}

      {NAILS.map((_, i) => (
        <Nail key={i} index={i} />
      ))}
    </group>
  );
}
