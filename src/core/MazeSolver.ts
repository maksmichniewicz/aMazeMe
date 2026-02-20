import type { Cell, Position } from './types';
import { getAccessibleNeighbors, positionsEqual, positionKey } from '../utils/gridHelpers';

/**
 * BFS solver — finds shortest path from start to end.
 */
export function solveMaze(
  grid: Cell[][],
  start: Position,
  end: Position,
  width: number,
  height: number,
): Position[] {
  const visited = new Set<string>();
  const parentMap = new Map<string, Position | null>();
  const queue: Position[] = [start];

  visited.add(positionKey(start));
  parentMap.set(positionKey(start), null);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (positionsEqual(current, end)) {
      return reconstructPath(parentMap, end);
    }

    const neighbors = getAccessibleNeighbors(grid, current, width, height);
    for (const { position } of neighbors) {
      const key = positionKey(position);
      if (!visited.has(key)) {
        visited.add(key);
        parentMap.set(key, current);
        queue.push(position);
      }
    }
  }

  return []; // No path found
}

function reconstructPath(parentMap: Map<string, Position | null>, end: Position): Position[] {
  const path: Position[] = [];
  let current: Position | null = end;

  while (current !== null) {
    path.unshift(current);
    current = parentMap.get(positionKey(current)) ?? null;
  }

  return path;
}
