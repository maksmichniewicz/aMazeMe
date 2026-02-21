import { useEffect, useCallback } from 'react';
import type { Maze, DoorKeyMode } from '../../core/types';
import type { ThemeConfig } from '../../themes/types';
import type { ItemInstance } from '../../items/types';
import { renderMaze } from '../../renderer/MazeRenderer';
import { DEFAULT_CELL_SIZE } from '../../utils/constants';
import './PrintView.css';

interface MazeEntry {
  maze: Maze;
  items: ItemInstance[];
}

interface PrintViewProps {
  mazes: MazeEntry[];
  theme: ThemeConfig;
  canvasRefs: React.MutableRefObject<(HTMLCanvasElement | null)[]>;
  doorKeyMode: DoorKeyMode;
}

export function PrintView({ mazes, theme, canvasRefs, doorKeyMode }: PrintViewProps) {
  const setCanvasRef = useCallback((el: HTMLCanvasElement | null, index: number) => {
    canvasRefs.current[index] = el;
  }, [canvasRefs]);

  useEffect(() => {
    mazes.forEach((entry, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      renderMaze(canvas, entry.maze, theme, DEFAULT_CELL_SIZE, entry.items, true, doorKeyMode);
    });
  }, [mazes, theme, canvasRefs, doorKeyMode]);

  if (mazes.length === 0) return null;

  return (
    <div className="print-view">
      {mazes.map((_, i) => (
        <canvas key={i} ref={(el) => setCanvasRef(el, i)} />
      ))}
    </div>
  );
}
