import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three'; // Explicit import for MathUtils
import * as random from 'maath/random/dist/maath-random.esm';

export const Atmosphere: React.FC = () => {
  const ref = useRef<any>();
  // Generate 2000 particles in a sphere
  const sphere = random.inSphere(new Float32Array(2000 * 3), { radius: 10 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Deep fog for the "Void" effect */}
      <fogExp2 attach="fog" args={['#050505', 0.08]} />
    </group>
  );
};
