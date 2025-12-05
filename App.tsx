import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import { AppState, MemoryItem, MemoryType } from './types';
import { INITIAL_MEMORIES } from './constants';
import * as THREE from 'three';

const App: React.FC = () => {
  const [items, setItems] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [hasStarted, setHasStarted] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    items: INITIAL_MEMORIES,
    isGyroEnabled: false,
    is3DMode: true,
    activeItemId: null,
  });

  // Load from local storage on mount (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('aether-memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
      } catch (e) {
        console.error("Failed to load memories", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('aether-memories', JSON.stringify(items));
    setAppState(prev => ({ ...prev, items }));
  }, [items]);

  const requestGyroPermission = async () => {
    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setAppState(prev => ({ ...prev, isGyroEnabled: true }));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Non-iOS or older devices usually allow default
      setAppState(prev => ({ ...prev, isGyroEnabled: true }));
    }
    setHasStarted(true);
  };

  const handleAddItem = (type: MemoryType, content: string, title: string) => {
    // Add item "in front" of the user based on random offset or calculation
    // Ideally, we get the camera direction, but for simplicity, we randomize slightly in front
    const r = 2.5; // distance
    const theta = Math.random() * Math.PI * 2; // random angle around Y
    const phi = (Math.random() - 0.5) * 1; // random height angle
    
    // In a real implementation with R3F access in App, we'd project from camera. 
    // Here we just place it in a random spot "nearby" in the void.
    const x = r * Math.sin(theta);
    const y = r * Math.sin(phi);
    const z = -r * Math.cos(theta); // generally forward-ish relative to world origin

    const newItem: MemoryItem = {
      id: uuidv4(),
      type,
      title,
      content,
      position: [x, y, z],
      timestamp: Date.now()
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setAppState(prev => ({ ...prev, activeItemId: null }));
  };

  const handleSelect = useCallback((id: string) => {
    setAppState(prev => ({ ...prev, activeItemId: id }));
  }, []);

  const handleClose = useCallback(() => {
    setAppState(prev => ({ ...prev, activeItemId: null }));
  }, []);

  const toggleGyro = () => {
    setAppState(prev => ({ ...prev, isGyroEnabled: !prev.isGyroEnabled }));
  };

  if (!hasStarted) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 text-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tighter">
            AETHER
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Your memory is a physical space.<br/>
            Turn your body to explore.<br/>
            Pin thoughts to the air.
          </p>
          <button
            onClick={requestGyroPermission}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Enter the Void
          </button>
          <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">
            Requires Device Orientation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene 
          items={items} 
          appState={appState}
          onSelect={handleSelect}
          onDelete={handleDeleteItem}
          onClose={handleClose}
        />
      </div>

      {/* 2D HUD Layer */}
      <HUD 
        appState={appState}
        onAddItem={handleAddItem}
        onToggleGyro={toggleGyro}
        onToggleStabilize={() => {}}
      />
    </div>
  );
};

export default App;
