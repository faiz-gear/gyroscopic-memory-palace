import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { AppState, MemoryItem } from '../types';
import { Atmosphere } from './Atmosphere';
import { FloatingCard } from './FloatingCard';
import { BlackHole } from './BlackHole';
import * as THREE from 'three';

interface SceneProps {
  items: MemoryItem[];
  appState: AppState;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const Scene: React.FC<SceneProps> = ({ 
  items, 
  appState, 
  onSelect, 
  onDelete, 
  onClose 
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.1], fov: 75 }}
      dpr={[1, 2]} // Dynamic pixel ratio for mobile performance
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#bc13fe" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />

        {/* Environment */}
        <Atmosphere />
        <BlackHole />

        {/* Controls: Gyro or Touch */}
        {appState.isGyroEnabled ? (
          <DeviceOrientationControls />
        ) : (
          <OrbitControls enableZoom={true} enablePan={false} reverseOrbit={true} />
        )}

        {/* Memory Items */}
        {items.map((item) => (
          <FloatingCard
            key={item.id}
            item={item}
            isActive={appState.activeItemId === item.id}
            onSelect={onSelect}
            onDelete={onDelete}
            onClose={onClose}
          />
        ))}

        {/* Post Processing - Disabled if low battery/perf mode might be needed, but enabled for aesthetic */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.5} radius={0.5} />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
