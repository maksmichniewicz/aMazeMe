import type { Maze, Position } from '../core/types';
import type { ItemInstance } from './types';
import { SeededRandom } from '../utils/random';
import {
  getAccessibleNeighbors,
  positionKey,
  positionsEqual,
  bfsDistanceMap,
} from '../utils/gridHelpers';

/**
 * Places items (keys, doors, treasures) in the maze.
 */
export function placeItems(
  maze: Maze,
  keyDoorPairs: number,
  treasureCount: number,
  seed: number,
): { items: ItemInstance[]; error?: string } {
  const rng = new SeededRandom(seed + 3000);
  const items: ItemInstance[] = [];
  const occupied = new Set<string>();

  // Mark entrance and exit as occupied
  occupied.add(positionKey(maze.entrance));
  occupied.add(positionKey(maze.exit));

  const solutionSet = new Set(maze.solution.map(positionKey));
  const deadEnds = findDeadEnds(maze);
  const deadEndSet = new Set(deadEnds.map(positionKey));
  const offPathDeadEnds = deadEnds.filter((p) => !solutionSet.has(positionKey(p)));

  // Place key-door pairs
  for (let i = 0; i < keyDoorPairs; i++) {
    const doorPos = findDoorPosition(maze, occupied, rng, i, keyDoorPairs);
    if (!doorPos) {
      return {
        items,
        error: `Nie udało się umieścić przejścia nr ${i + 1}. Labirynt jest za mały.`,
      };
    }

    const keyPos = findKeyPosition(maze, doorPos, occupied, deadEndSet, rng);
    if (!keyPos) {
      return {
        items,
        error: `Nie udało się umieścić klucza nr ${i + 1}. Labirynt jest za mały.`,
      };
    }

    const doorId = `door-${i}`;
    const keyId = `key-${i}`;

    items.push({
      id: doorId,
      typeId: 'door',
      position: doorPos,
      pairedItemId: keyId,
      colorIndex: i,
    });
    items.push({
      id: keyId,
      typeId: 'key',
      position: keyPos,
      pairedItemId: doorId,
      colorIndex: i,
    });

    occupied.add(positionKey(doorPos));
    occupied.add(positionKey(keyPos));
  }

  // Place treasures — prefer off-path dead-ends
  let treasureCandidates = offPathDeadEnds.filter((p) => !occupied.has(positionKey(p)));
  rng.shuffle(treasureCandidates);

  // If not enough dead-ends, also use other off-path cells
  if (treasureCandidates.length < treasureCount) {
    const allCells = getAllCells(maze).filter(
      (p) => !solutionSet.has(positionKey(p)) && !occupied.has(positionKey(p)),
    );
    rng.shuffle(allCells);
    treasureCandidates = [...treasureCandidates, ...allCells];
    // Deduplicate
    const seen = new Set<string>();
    treasureCandidates = treasureCandidates.filter((p) => {
      const k = positionKey(p);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  const actualTreasures = Math.min(treasureCount, treasureCandidates.length);
  for (let i = 0; i < actualTreasures; i++) {
    const pos = treasureCandidates[i];
    items.push({
      id: `treasure-${i}`,
      typeId: 'treasure',
      position: pos,
      colorIndex: 0,
    });
    occupied.add(positionKey(pos));
  }

  if (actualTreasures < treasureCount) {
    return {
      items,
      error: `Udało się umieścić tylko ${actualTreasures} z ${treasureCount} skarbów.`,
    };
  }

  return { items };
}

function findDoorPosition(
  maze: Maze,
  occupied: Set<string>,
  rng: SeededRandom,
  pairIndex: number,
  totalPairs: number,
): Position | null {
  // Place door near (pairIndex+1)/(totalPairs+1) along solution path
  const solution = maze.solution;
  const targetIdx = Math.round(solution.length * (pairIndex + 1) / (totalPairs + 1));
  const windowSize = Math.max(Math.round(solution.length * 0.15), 2);
  const minIdx = Math.max(1, targetIdx - windowSize); // skip entrance (index 0)
  const maxIdx = Math.min(solution.length - 2, targetIdx + windowSize); // skip exit (last index)

  // Candidates within the target window
  const windowCandidates: Position[] = [];
  for (let j = minIdx; j <= maxIdx; j++) {
    const p = solution[j];
    if (!occupied.has(positionKey(p))) {
      windowCandidates.push(p);
    }
  }

  if (windowCandidates.length > 0) {
    rng.shuffle(windowCandidates);
    return windowCandidates[0];
  }

  // Fallback: any unoccupied solution cell (not entrance/exit)
  const fallback = solution.filter(
    (p) =>
      !positionsEqual(p, maze.entrance) &&
      !positionsEqual(p, maze.exit) &&
      !occupied.has(positionKey(p)),
  );
  if (fallback.length === 0) return null;
  rng.shuffle(fallback);
  return fallback[0];
}

function findKeyPosition(
  maze: Maze,
  doorPos: Position,
  occupied: Set<string>,
  deadEndSet: Set<string>,
  rng: SeededRandom,
): Position | null {
  // Key must be reachable from entrance WITHOUT passing through the door
  const reachable = bfsWithoutDoor(maze, maze.entrance, doorPos);
  const candidates = reachable.filter(
    (p) =>
      !positionsEqual(p, maze.entrance) &&
      !occupied.has(positionKey(p)) &&
      !positionsEqual(p, doorPos),
  );

  if (candidates.length === 0) return null;

  // Compute BFS distances from entrance — we want key far from start
  const distFromEntrance = bfsDistanceMap(maze.grid, maze.entrance, maze.width, maze.height);

  // Sort by distance from entrance (descending)
  candidates.sort((a, b) => {
    const distA = distFromEntrance.get(positionKey(a)) ?? 0;
    const distB = distFromEntrance.get(positionKey(b)) ?? 0;
    return distB - distA;
  });

  // Take the top 50% farthest candidates
  const topHalf = candidates.slice(0, Math.max(1, Math.ceil(candidates.length * 0.5)));

  // Among those, prefer dead-ends
  const deadEndTopHalf = topHalf.filter((p) => deadEndSet.has(positionKey(p)));
  if (deadEndTopHalf.length > 0) {
    rng.shuffle(deadEndTopHalf);
    return deadEndTopHalf[0];
  }

  // No dead-ends in top half — pick random from top half
  rng.shuffle(topHalf);
  return topHalf[0];
}

function bfsWithoutDoor(maze: Maze, start: Position, doorPos: Position): Position[] {
  const visited = new Set<string>();
  const queue: Position[] = [start];
  visited.add(positionKey(start));
  const result: Position[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getAccessibleNeighbors(
      maze.grid,
      current,
      maze.width,
      maze.height,
    );

    for (const { position } of neighbors) {
      const key = positionKey(position);
      if (visited.has(key)) continue;
      if (positionsEqual(position, doorPos)) continue; // Can't pass through door
      visited.add(key);
      queue.push(position);
      result.push(position);
    }
  }

  return result;
}

function findDeadEnds(maze: Maze): Position[] {
  const deadEnds: Position[] = [];
  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      const cell = maze.grid[row][col];
      const openWalls = (['north', 'south', 'east', 'west'] as const).filter(
        (d) => !cell.walls[d],
      );
      if (openWalls.length === 1) {
        deadEnds.push({ row, col });
      }
    }
  }
  return deadEnds;
}

function getAllCells(maze: Maze): Position[] {
  const cells: Position[] = [];
  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      cells.push({ row, col });
    }
  }
  return cells;
}
