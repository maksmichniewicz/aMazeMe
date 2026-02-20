import { useRef, useEffect } from 'react';
import type { Maze } from '../../core/types';
import type { ThemeConfig } from '../../themes/types';
import type { ItemInstance } from '../../items/types';
import { renderMaze } from '../../renderer/MazeRenderer';
import { DEFAULT_CELL_SIZE } from '../../utils/constants';

interface MazeCanvasProps {
  maze: Maze | null;
  theme: ThemeConfig;
  items: ItemInstance[];
}

export function MazeCanvas({ maze, theme, items }: MazeCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!maze || !ref.current) return;

    const container = ref.current.parentElement;
    if (!container) return;

    const maxWidth = container.clientWidth - 40;
    const maxHeight = window.innerHeight - 120;
    const cellSizeW = Math.floor((maxWidth - 40) / maze.width);
    const cellSizeH = Math.floor((maxHeight - 40) / maze.height);
    const cellSize = Math.min(cellSizeW, cellSizeH, DEFAULT_CELL_SIZE);

    renderMaze(ref.current, maze, theme, Math.max(cellSize, 20), items);
  }, [maze, theme, items]);

  if (!maze) {
    return (
      <div className="maze-placeholder">
        <p>Kliknij "Utwórz" aby rozpocząć</p>
      </div>
    );
  }

  return (
    <div className="maze-canvas-container">
      <canvas ref={ref} />
    </div>
  );
}
