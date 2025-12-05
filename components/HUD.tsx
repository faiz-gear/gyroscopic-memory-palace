import React, { useState } from 'react';
import { Compass, Plus, Settings, Trash2, Smartphone, Monitor, Eye } from 'lucide-react';
import { AppState, MemoryType } from '../types';

interface HUDProps {
  appState: AppState;
  onAddItem: (type: MemoryType, content: string, title: string) => void;
  onToggleGyro: () => void;
  onToggleStabilize: () => void; // Placeholder for motion sickness logic
}

export const HUD: React.FC<HUDProps> = ({ appState, onAddItem, onToggleGyro }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');

  const handleAdd = () => {
    if (!newItemTitle || !newItemContent) return;
    onAddItem(MemoryType.NOTE, newItemContent, newItemTitle);
    setNewItemContent('');
    setNewItemTitle('');
    setAddModalOpen(false);
  };

  if (!appState.is3DMode) {
     return (
       <div className="absolute inset-0 z-50 bg-black text-white p-8 overflow-y-auto">
         <h1 className="text-3xl font-bold mb-6 text-cyan-400">Memory Grid (2D Fallback)</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appState.items.map(item => (
              <div key={item.id} className="p-4 border border-gray-700 rounded bg-gray-900">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{item.content}</p>
              </div>
            ))}
         </div>
       </div>
     )
  }

  return (
    <>
      {/* Sticky Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-6 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-lg">
        <button 
          onClick={onToggleGyro}
          className={`p-3 rounded-full transition-all ${appState.isGyroEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}
          aria-label="Toggle Gyro"
        >
          {appState.isGyroEnabled ? <Smartphone size={24} /> : <Compass size={24} />}
        </button>

        <button 
          onClick={() => setAddModalOpen(true)}
          className="p-4 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-110 transition-transform"
        >
          <Plus size={32} color="white" />
        </button>

        <button 
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Settings Menu */}
      {isMenuOpen && (
        <div className="absolute bottom-28 right-6 z-40 bg-black/90 backdrop-blur border border-white/10 p-4 rounded-xl flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Controls</h3>
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Gyroscope</span>
            <div className={`w-2 h-2 rounded-full ${appState.isGyroEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-xs text-gray-600">
            {appState.isGyroEnabled ? 'Turn body to explore' : 'Drag to rotate'}
          </p>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-purple-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">New Memory</h2>
            <input
              type="text"
              placeholder="Title (e.g., Grocery List)"
              className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 border border-gray-700 focus:border-cyan-500 outline-none"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <textarea
              placeholder="Content..."
              className="w-full bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700 focus:border-cyan-500 outline-none h-32 resize-none"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setAddModalOpen(false)}
                className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-cyan-900/50"
              >
                Pin to Space
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
