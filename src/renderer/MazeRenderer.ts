import type { Maze } from '../core/types';
import type { ThemeConfig } from '../themes/types';
import type { ItemInstance } from '../items/types';
import { itemRegistry } from '../items/ItemRegistry';
import type { RenderContext } from './types';
import { cellToRect } from './types';
import { SeededRandom } from '../utils/random';
import { CANVAS_PADDING } from '../utils/constants';

export function renderMaze(
  canvas: HTMLCanvasElement,
  maze: Maze,
  theme: ThemeConfig,
  cellSize: number,
  items: ItemInstance[] = [],
  isPrint: boolean = false,
): void {
  const activeTheme = isPrint && theme.printVariant
    ? { ...theme, ...theme.printVariant }
    : theme;

  const padding = CANVAS_PADDING;
  const canvasWidth = maze.width * cellSize + padding * 2;
  const canvasHeight = maze.height * cellSize + padding * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d')!;
  const rc: RenderContext = { ctx, cellSize, padding, canvasWidth, canvasHeight };

  // 1. Background — white canvas, then theme fills the grid area
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  activeTheme.drawBackground(rc);

  // 2. Paths + decorations
  const rng = new SeededRandom(maze.seed + 2000);
  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      const rect = cellToRect({ row, col }, cellSize, padding);
      activeTheme.drawPath(rc, rect);
      activeTheme.drawPathDecoration(rc, rect, rng);
    }
  }

  // 3. Walls
  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      const cell = maze.grid[row][col];
      const x = col * cellSize + padding;
      const y = row * cellSize + padding;

      if (cell.walls.north) {
        activeTheme.drawWall(rc, { x, y }, { x: x + cellSize, y });
      }
      if (cell.walls.west) {
        activeTheme.drawWall(rc, { x, y }, { x, y: y + cellSize });
      }
      // Right border
      if (col === maze.width - 1 && cell.walls.east) {
        activeTheme.drawWall(rc, { x: x + cellSize, y }, { x: x + cellSize, y: y + cellSize });
      }
      // Bottom border
      if (row === maze.height - 1 && cell.walls.south) {
        activeTheme.drawWall(rc, { x, y: y + cellSize }, { x: x + cellSize, y: y + cellSize });
      }
    }
  }

  // 4. Entrance & Exit markers
  const entranceRect = cellToRect(maze.entrance, cellSize, padding);
  const exitRect = cellToRect(maze.exit, cellSize, padding);
  activeTheme.drawEntrance(rc, entranceRect);
  activeTheme.drawExit(rc, exitRect);

  // 5. Items
  for (const item of items) {
    const itemRect = cellToRect(item.position, cellSize, padding);
    const handled = activeTheme.drawItem?.(rc, itemRect, item);
    if (!handled) {
      const itemDef = itemRegistry.get(item.typeId);
      if (itemDef) {
        itemDef.render(rc, itemRect, item);
      }
    }
  }
}
