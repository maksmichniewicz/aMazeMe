import type { Cell, Direction, Position } from '../core/types';

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};

export const DIRECTION_OFFSETS: Record<Direction, { dRow: number; dCol: number }> = {
  north: { dRow: -1, dCol: 0 },
  south: { dRow: 1, dCol: 0 },
  east: { dRow: 0, dCol: 1 },
  west: { dRow: 0, dCol: -1 },
};

export const ALL_DIRECTIONS: Direction[] = ['north', 'south', 'east', 'west'];

export function createGrid(width: number, height: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let row = 0; row < height; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < width; col++) {
      rowCells.push({
        row,
        col,
        walls: { north: true, south: true, east: true, west: true },
        visited: false,
      });
    }
    grid.push(rowCells);
  }
  return grid;
}

export function isInBounds(pos: Position, width: number, height: number): boolean {
  return pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width;
}

export function getNeighbor(pos: Position, direction: Direction): Position {
  const offset = DIRECTION_OFFSETS[direction];
  return { row: pos.row + offset.dRow, col: pos.col + offset.dCol };
}

export function getAccessibleNeighbors(
  grid: Cell[][],
  pos: Position,
  width: number,
  height: number,
): { position: Position; direction: Direction }[] {
  const neighbors: { position: Position; direction: Direction }[] = [];
  for (const dir of ALL_DIRECTIONS) {
    if (!grid[pos.row][pos.col].walls[dir]) {
      const neighbor = getNeighbor(pos, dir);
      if (isInBounds(neighbor, width, height)) {
        neighbors.push({ position: neighbor, direction: dir });
      }
    }
  }
  return neighbors;
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function positionKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

/**
 * BFS distance map — returns distance from start to every reachable cell.
 */
export function bfsDistanceMap(
  grid: Cell[][],
  start: Position,
  width: number,
  height: number,
): Map<string, number> {
  const distances = new Map<string, number>();
  const queue: Position[] = [start];
  distances.set(positionKey(start), 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const dist = distances.get(positionKey(current))!;
    const neighbors = getAccessibleNeighbors(grid, current, width, height);

    for (const { position } of neighbors) {
      const key = positionKey(position);
      if (!distances.has(key)) {
        distances.set(key, dist + 1);
        queue.push(position);
      }
    }
  }

  return distances;
}
