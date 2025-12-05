import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Text, Html, useCursor } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { MemoryItem, MemoryType } from '../types';
import { COLORS } from '../constants';
import { expandMemoryWithAI } from '../services/geminiService';
import { LiquidShaderMaterial } from './LiquidShaderMaterial';

// Register the custom shader material with R3F
extend({ LiquidShaderMaterial });

interface FloatingCardProps {
  item: MemoryItem;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  item, 
  isActive, 
  onSelect, 
  onDelete, 
  onClose 
}) => {
  const meshRef = useRef<any>();
  const materialRef = useRef<any>();
  const [hovered, setHover] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  
  const { camera } = useThree();
  useCursor(hovered);

  // Animation spring
  const { scale, position, rotation } = useSpring({
    scale: isActive ? 1.5 : hovered ? 1.1 : 1,
    position: isActive 
      ? [camera.position.x, camera.position.y, camera.position.z - 1.5] // Fly to face
      : item.position,
    rotation: isActive 
      ? [camera.rotation.x, camera.rotation.y, camera.rotation.z] // Face camera
      : [0, Math.atan2(item.position[0], item.position[2]) + Math.PI, 0], // Face center
    config: config.wobbly
  });

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
      materialRef.current.hover = hovered ? 1 : 0;
    }
    
    // Slight idle float
    if (!isActive && meshRef.current) {
      meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime + Number(item.id)) * 0.1;
    }
  });

  const handleExpand = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanding(true);
    const newText = await expandMemoryWithAI(item.content);
    setExpandedContent(newText);
    setExpanding(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simple "suck into void" animation logic could go here, 
    // but we'll just trigger the deletion
    onDelete(item.id);
  };

  const truncatedContent = useMemo(() => {
    return item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content;
  }, [item.content]);

  return (
    <animated.group 
      position={position as any} 
      rotation={rotation as any} 
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (!isActive) {
          if (navigator.vibrate) navigator.vibrate(20);
          onSelect(item.id);
        }
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* The Liquid Card Background */}
      <mesh ref={meshRef}>
        <planeGeometry args={[1.2, 0.8, 32, 32]} />
        {/* @ts-ignore */}
        <liquidShaderMaterial 
          ref={materialRef} 
          transparent 
          color={new THREE.Color(COLORS.neonBlue)} 
        />
      </mesh>

      {/* Content Layer - Only visible when close/active for performance or simplified when far */}
      <group position={[0, 0, 0.05]}>
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.08}
          color={COLORS.text}
          anchorX="center"
          anchorY="middle"
          maxWidth={1}
        >
          {item.title.toUpperCase()}
        </Text>
        
        {!isActive && (
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.05}
            color={COLORS.text}
            anchorX="center"
            anchorY="middle"
            maxWidth={1}
            fillOpacity={0.8}
          >
            {truncatedContent}
          </Text>
        )}
      </group>

      {/* Interactive HTML UI when Active */}
      {isActive && (
        <Html transform position={[0, 0, 0.1]} center className="w-80 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-cyan-500/50 p-6 rounded-xl shadow-2xl pointer-events-auto text-white flex flex-col gap-4">
            <h2 className="text-xl font-bold text-cyan-400">{item.title}</h2>
            
            {item.type === MemoryType.IMAGE && (
              <img src={item.content} alt="memory" className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            
            <p className="text-sm text-gray-200 leading-relaxed max-h-40 overflow-y-auto">
              {expandedContent || item.content}
            </p>

            <div className="flex gap-2 justify-between mt-2">
              <button 
                onClick={handleExpand}
                disabled={expanding}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {expanding ? 'Dreaming...' : 'Dream Deeper (AI)'}
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 rounded text-xs transition-colors"
                >
                  Void
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </animated.group>
  );
};
