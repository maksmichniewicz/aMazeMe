export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
  walls: Record<Direction, boolean>;
  visited: boolean;
}

export interface Maze {
  width: number;
  height: number;
  grid: Cell[][];
  entrance: Position;
  exit: Position;
  seed: number;
  solution: Position[];
}
