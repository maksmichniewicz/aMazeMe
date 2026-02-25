import type { Maze, Position, WallPosition, DoorKeyMode } from '../core/types';
import type { ItemInstance } from './types';
import { SeededRandom } from '../utils/random';
import {
  getAccessibleNeighbors,
  positionKey,
  positionsEqual,
  bfsDistanceMap,
  wallPositionKey,
  bfsWithBlockedPassages,
  getSolutionPassages,
} from '../utils/gridHelpers';

/**
 * Places items (keys, doors, treasures) in the maze.
 */
export function placeItems(
  maze: Maze,
  keyDoorPairs: number,
  treasureCount: number,
  seed: number,
  doorKeyMode: DoorKeyMode,
): { items: ItemInstance[]; errorKey?: string; errorParams?: Record<string, string> } {
  const rng = new SeededRandom(seed + 3000);
  const items: ItemInstance[] = [];
  const occupied = new Set<string>();
  const occupiedPassages = new Set<string>();

  // Mark entrance and exit as occupied
  occupied.add(positionKey(maze.entrance));
  occupied.add(positionKey(maze.exit));

  const solutionSet = new Set(maze.solution.map(positionKey));
  const deadEnds = findDeadEnds(maze);
  const deadEndSet = new Set(deadEnds.map(positionKey));
  const offPathDeadEnds = deadEnds.filter((p) => !solutionSet.has(positionKey(p)));

  // Place key-door pairs
  for (let i = 0; i < keyDoorPairs; i++) {
    const doorPassage = findDoorPassage(maze, occupiedPassages, rng, i, keyDoorPairs);
    if (!doorPassage) {
      return {
        items,
        errorKey: 'error.doorPlacement',
        errorParams: { n: String(i + 1) },
      };
    }

    const keyPos = findKeyPosition(maze, doorPassage, occupied, deadEndSet, rng);
    if (!keyPos) {
      return {
        items,
        errorKey: 'error.keyPlacement',
        errorParams: { n: String(i + 1) },
      };
    }

    const doorId = `door-${i}`;
    const keyId = `key-${i}`;
    const isGeneric = doorKeyMode === 'generic';

    items.push({
      id: doorId,
      typeId: 'door',
      position: doorPassage.cell,
      wallPosition: doorPassage,
      pairedItemId: isGeneric ? undefined : keyId,
      colorIndex: isGeneric ? -1 : i,
    });
    items.push({
      id: keyId,
      typeId: 'key',
      position: keyPos,
      pairedItemId: isGeneric ? undefined : doorId,
      colorIndex: isGeneric ? -1 : i,
    });

    occupiedPassages.add(wallPositionKey(doorPassage));
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
      errorKey: 'error.partialTreasures',
      errorParams: { actual: String(actualTreasures), total: String(treasureCount) },
    };
  }

  return { items };
}

function findDoorPassage(
  maze: Maze,
  occupiedPassages: Set<string>,
  rng: SeededRandom,
  pairIndex: number,
  totalPairs: number,
): WallPosition | null {
  const solutionPassages = getSolutionPassages(maze.solution);
  if (solutionPassages.length === 0) return null;

  // Target window: distribute doors evenly along solution
  const targetIdx = Math.round(
    solutionPassages.length * (pairIndex + 1) / (totalPairs + 1),
  );
  const windowSize = Math.max(Math.round(solutionPassages.length * 0.15), 2);
  // Skip first and last passage (near entrance/exit)
  const minIdx = Math.max(1, targetIdx - windowSize);
  const maxIdx = Math.min(solutionPassages.length - 2, targetIdx + windowSize);

  // Candidates within the target window
  const windowCandidates: WallPosition[] = [];
  for (let j = minIdx; j <= maxIdx; j++) {
    const passage = solutionPassages[j];
    if (!occupiedPassages.has(wallPositionKey(passage))) {
      windowCandidates.push(passage);
    }
  }

  // Shuffle and test candidates for effectiveness (bypass detection)
  const shuffled = [...windowCandidates];
  rng.shuffle(shuffled);

  for (const candidate of shuffled) {
    if (isPassageEffective(maze, candidate, occupiedPassages)) {
      return candidate;
    }
  }

  // Fallback: any unoccupied solution passage (skip first and last)
  const fallback: WallPosition[] = [];
  for (let j = 1; j < solutionPassages.length - 1; j++) {
    const passage = solutionPassages[j];
    if (!occupiedPassages.has(wallPositionKey(passage))) {
      fallback.push(passage);
    }
  }
  rng.shuffle(fallback);

  for (const candidate of fallback) {
    if (isPassageEffective(maze, candidate, occupiedPassages)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Check if blocking this passage (plus already-placed doors) prevents reaching the exit.
 * If the exit is still reachable without this door, it's bypassable and thus not effective.
 */
function isPassageEffective(
  maze: Maze,
  passage: WallPosition,
  alreadyBlockedPassages: Set<string>,
): boolean {
  const blockedSet = new Set(alreadyBlockedPassages);
  blockedSet.add(wallPositionKey(passage));

  const reachable = bfsWithBlockedPassages(
    maze.grid,
    maze.entrance,
    maze.width,
    maze.height,
    blockedSet,
  );

  return !reachable.has(positionKey(maze.exit));
}

function findKeyPosition(
  maze: Maze,
  doorPassage: WallPosition,
  occupied: Set<string>,
  deadEndSet: Set<string>,
  rng: SeededRandom,
): Position | null {
  // Key must be reachable from entrance WITHOUT passing through the door passage
  const reachable = bfsReachableWithoutPassage(maze, maze.entrance, doorPassage);
  const candidates = reachable.filter(
    (p) =>
      !positionsEqual(p, maze.entrance) &&
      !occupied.has(positionKey(p)),
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

function bfsReachableWithoutPassage(
  maze: Maze,
  start: Position,
  blockedPassage: WallPosition,
): Position[] {
  const blockedKey = wallPositionKey(blockedPassage);
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

    for (const { position, direction } of neighbors) {
      const key = positionKey(position);
      if (visited.has(key)) continue;

      const passageKey = wallPositionKey({ cell: current, direction });
      if (passageKey === blockedKey) continue;

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
