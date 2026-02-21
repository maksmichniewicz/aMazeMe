import type { Position, WallPosition, DoorKeyMode } from '../core/types';
import { canonicalWallPosition } from '../utils/gridHelpers';

export interface Point {
  x: number;
  y: number;
}

export interface CellRect {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  cellSize: number;
  padding: number;
  canvasWidth: number;
  canvasHeight: number;
  doorKeyMode: DoorKeyMode;
}

export function cellToRect(pos: Position, cellSize: number, padding: number): CellRect {
  return {
    x: pos.col * cellSize + padding,
    y: pos.row * cellSize + padding,
    width: cellSize,
    height: cellSize,
    row: pos.row,
    col: pos.col,
  };
}

/**
 * Convert a WallPosition to a CellRect centered on the wall boundary.
 * For east/west walls (vertical boundary): rect spans across the vertical wall line.
 * For north/south walls (horizontal boundary): rect spans across the horizontal wall line.
 */
export function wallToRect(
  wp: WallPosition,
  cellSize: number,
  padding: number,
): CellRect {
  const c = canonicalWallPosition(wp);
  if (c.direction === 'east') {
    // Vertical wall between cell and its east neighbor
    const x = (c.cell.col + 1) * cellSize + padding - cellSize / 2;
    const y = c.cell.row * cellSize + padding;
    return {
      x, y,
      width: cellSize,
      height: cellSize,
      row: c.cell.row,
      col: c.cell.col,
    };
  } else {
    // south: Horizontal wall between cell and its south neighbor
    const x = c.cell.col * cellSize + padding;
    const y = (c.cell.row + 1) * cellSize + padding - cellSize / 2;
    return {
      x, y,
      width: cellSize,
      height: cellSize,
      row: c.cell.row,
      col: c.cell.col,
    };
  }
}
