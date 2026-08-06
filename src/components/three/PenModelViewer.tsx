'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { PenSystem } from './PenSystem';
import { store } from '@/lib/three/progressStore';

/**
 * Static anatomy viewer — reuses the hero's PenSystem geometry directly.
 * There's no scroll runway on this page, so the shared progress store is
 * pinned to "fully driven" once on mount rather than left at 0.
 */
export function PenModelViewer() {
  useEffect(() => {
    store.introDone = true;
    store.raw = 0.6;
    store.smooth = 0.6;
  }, []);

  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-sm bg-neutral-900">
      <Canvas camera={{ position: [3, 1.6, 3], fov: 36 }} dpr={[1, 1.75]} shadows>
        <color attach="background" args={['#0c1518']} />
        <ambientLight intensity={0.5} color="#cfe3e6" />
        <directionalLight position={[5, 6, 3]} intensity={1.6} color="#fff1e2" castShadow />
        <directionalLight position={[-6, 3, -4]} intensity={1.1} color="#7ee7f0" />
        <Environment preset="city" environmentIntensity={0.5} />
        <PenSystem />
        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={5}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
