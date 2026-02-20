import type { Position } from '../core/types';

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
