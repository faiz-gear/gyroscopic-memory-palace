import { MemoryType, MemoryItem } from './types';

export const COLORS = {
  void: '#050505',
  neonBlue: '#00f3ff',
  neonPurple: '#bc13fe',
  glass: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff'
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: '1',
    type: MemoryType.NOTE,
    title: 'Welcome to Aether',
    content: 'Turn your body to explore. This space is persistent. Items stay where you leave them.',
    position: [0, 0, -3],
    timestamp: Date.now()
  },
  {
    id: '2',
    type: MemoryType.IMAGE,
    title: 'Inspiration',
    content: 'https://picsum.photos/400/400',
    position: [2.5, 0.5, -2],
    timestamp: Date.now() - 10000
  },
  {
    id: '3',
    type: MemoryType.NOTE,
    title: 'The Void',
    content: 'Look down to find the Black Hole. Trash items by sending them there.',
    position: [-2, -1, -2.5],
    timestamp: Date.now() - 20000
  }
];

export const MAX_ITEMS = 50;
export const BLACK_HOLE_POSITION: [number, number, number] = [0, -8, 0];
