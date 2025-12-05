import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { BLACK_HOLE_POSITION, COLORS } from '../constants';

export const BlackHole: React.FC = () => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.02; // Swirling
    }
  });

  return (
    <group position={BLACK_HOLE_POSITION}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.4, 32, 100]} />
        <MeshDistortMaterial
          color="#1a0033"
          speed={5}
          distort={0.4}
          roughness={0}
          emissive={COLORS.neonPurple}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Event Horizon */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
