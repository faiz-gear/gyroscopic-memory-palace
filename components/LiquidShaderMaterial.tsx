import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const LiquidShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.2, 0.0, 0.5),
    hover: 0,
    opacity: 0.6
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vWave;
    uniform float time;
    uniform float hover;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Liquid distortion effect
      float noise = sin(pos.x * 5.0 + time) * cos(pos.y * 5.0 + time);
      pos.z += noise * 0.1;
      
      // Bulge on hover
      pos.z += hover * sin(uv.x * 3.14) * 0.5;

      vWave = noise;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    varying float vWave;

    void main() {
      float alpha = opacity + vWave * 0.1;
      
      // Holographic rim effect
      vec3 finalColor = color + vec3(vWave * 0.2);
      
      // Scanline effect
      float scanline = sin(vUv.y * 100.0 + time * 5.0) * 0.05;
      
      gl_FragColor = vec4(finalColor + scanline, alpha);
    }
  `
);
