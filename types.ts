import { Vector3 } from 'three';

export enum MemoryType {
  NOTE = 'NOTE',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO'
}

export interface MemoryItem {
  id: string;
  type: MemoryType;
  content: string; // Text content or image URL
  position: [number, number, number];
  timestamp: number;
  title: string;
}

export interface AppState {
  items: MemoryItem[];
  isGyroEnabled: boolean;
  is3DMode: boolean;
  activeItemId: string | null;
}

export interface AppContextType extends AppState {
  addItem: (item: Omit<MemoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  setGyroEnabled: (enabled: boolean) => void;
  set3DMode: (enabled: boolean) => void;
  setActiveItem: (id: string | null) => void;
  updateItemPosition: (id: string, position: [number, number, number]) => void;
}

// Global declaration to fix "Property does not exist on type JSX.IntrinsicElements" errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
