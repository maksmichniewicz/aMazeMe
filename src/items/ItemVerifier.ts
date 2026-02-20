import type { Maze, Position } from '../core/types';
import type { ItemInstance } from './types';
import {
  getAccessibleNeighbors,
  positionKey,
  positionsEqual,
} from '../utils/gridHelpers';

/**
 * Verifies that the maze with items is solvable using Progressive BFS.
 * Also checks for deadlocks in key-door dependencies.
 * Verifies all treasures are reachable.
 */
export function verifyItemPlacement(maze: Maze, items: ItemInstance[]): boolean {
  const doors = items.filter((i) => i.typeId === 'door');
  const keys = items.filter((i) => i.typeId === 'key');
  const treasures = items.filter((i) => i.typeId === 'treasure');

  if (doors.length === 0) {
    // No doors — just verify all treasures are reachable via simple BFS
    if (treasures.length === 0) return true;
    const reachable = bfsReachableFromEntrance(maze);
    return treasures.every((t) => reachable.has(positionKey(t.position)));
  }

  // Check for dependency cycles (deadlocks)
  if (hasDeadlock(maze, keys, doors)) return false;

  // Progressive BFS — returns visited set
  const visited = progressiveBFS(maze, keys, doors);
  if (!visited.has(positionKey(maze.exit))) return false;

  // Verify all treasures are reachable
  return treasures.every((t) => visited.has(positionKey(t.position)));
}

/**
 * Progressive BFS: expand reachable area, collect keys, open doors, repeat.
 */
function progressiveBFS(maze: Maze, keys: ItemInstance[], doors: ItemInstance[]): Set<string> {
  const doorPositions = new Map<string, ItemInstance>();
  for (const door of doors) {
    doorPositions.set(positionKey(door.position), door);
  }

  const keyPositions = new Map<string, ItemInstance>();
  for (const key of keys) {
    keyPositions.set(positionKey(key.position), key);
  }

  const collectedKeys = new Set<string>(); // key item IDs
  const openedDoors = new Set<string>(); // door item IDs
  const visited = new Set<string>();
  let frontier: Position[] = [maze.entrance];
  visited.add(positionKey(maze.entrance));

  let changed = true;
  while (changed) {
    changed = false;

    // BFS expansion
    while (frontier.length > 0) {
      const nextFrontier: Position[] = [];

      for (const pos of frontier) {
        // Collect key at current position
        const keyHere = keyPositions.get(positionKey(pos));
        if (keyHere && !collectedKeys.has(keyHere.id)) {
          collectedKeys.add(keyHere.id);
          changed = true;
        }

        const neighbors = getAccessibleNeighbors(maze.grid, pos, maze.width, maze.height);
        for (const { position } of neighbors) {
          const key = positionKey(position);
          if (visited.has(key)) continue;

          // Check if blocked by unopened door
          const doorHere = doorPositions.get(key);
          if (doorHere && !openedDoors.has(doorHere.id)) {
            continue; // Can't pass through this door yet
          }

          visited.add(key);
          nextFrontier.push(position);
        }
      }

      frontier = nextFrontier;
    }

    // Try opening doors with collected keys
    for (const door of doors) {
      if (openedDoors.has(door.id)) continue;
      const pairedKey = keys.find((k) => k.id === door.pairedItemId);
      if (pairedKey && collectedKeys.has(pairedKey.id)) {
        openedDoors.add(door.id);
        changed = true;

        // Add the door position back as frontier if its neighbor is visited
        const doorKey = positionKey(door.position);
        if (!visited.has(doorKey)) {
          // Check if any visited neighbor leads here
          const neighbors = getAccessibleNeighbors(
            maze.grid,
            door.position,
            maze.width,
            maze.height,
          );
          for (const { position } of neighbors) {
            if (visited.has(positionKey(position))) {
              visited.add(doorKey);
              frontier.push(door.position);
              break;
            }
          }
        }
      }
    }
  }

  return visited;
}

/**
 * Simple BFS from entrance — returns all reachable positions (no doors to worry about).
 */
function bfsReachableFromEntrance(maze: Maze): Set<string> {
  const visited = new Set<string>();
  const queue: Position[] = [maze.entrance];
  visited.add(positionKey(maze.entrance));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getAccessibleNeighbors(maze.grid, current, maze.width, maze.height);
    for (const { position } of neighbors) {
      const key = positionKey(position);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(position);
      }
    }
  }

  return visited;
}

/**
 * Detects deadlocks by building key-door dependency graph and checking for cycles.
 * A deadlock occurs when key A is behind door B and key B is behind door A (circular).
 */
function hasDeadlock(maze: Maze, keys: ItemInstance[], doors: ItemInstance[]): boolean {
  // Build: for each key, which doors block access to it from the entrance?
  // If key K is behind door D, then K depends on D's key.
  const keyDependencies = new Map<string, Set<string>>(); // keyId -> set of keyIds it depends on

  for (const key of keys) {
    keyDependencies.set(key.id, new Set());
  }

  for (const key of keys) {
    // BFS from entrance, doors are walls unless we assume we have all other keys
    for (const door of doors) {
      // Check if this key is ONLY reachable through this door
      const reachableWithout = bfsReachable(maze, maze.entrance, door.position, doors);
      const keyReachable = reachableWithout.has(positionKey(key.position));

      if (!keyReachable) {
        // Key depends on passing through this door → depends on door's key
        const doorKey = keys.find((k) => k.id === door.pairedItemId);
        if (doorKey) {
          keyDependencies.get(key.id)!.add(doorKey.id);
        }
      }
    }
  }

  // DFS cycle detection
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const key of keys) {
    color.set(key.id, WHITE);
  }

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GRAY);
    const deps = keyDependencies.get(nodeId);
    if (deps) {
      for (const depId of deps) {
        const c = color.get(depId);
        if (c === GRAY) return true; // cycle!
        if (c === WHITE && dfs(depId)) return true;
      }
    }
    color.set(nodeId, BLACK);
    return false;
  }

  for (const key of keys) {
    if (color.get(key.id) === WHITE) {
      if (dfs(key.id)) return true;
    }
  }

  return false;
}

function bfsReachable(
  maze: Maze,
  start: Position,
  blockedDoor: Position,
  _allDoors: ItemInstance[],
): Set<string> {
  const visited = new Set<string>();
  const queue: Position[] = [start];
  visited.add(positionKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getAccessibleNeighbors(maze.grid, current, maze.width, maze.height);

    for (const { position } of neighbors) {
      const key = positionKey(position);
      if (visited.has(key)) continue;
      if (positionsEqual(position, blockedDoor)) continue;
      visited.add(key);
      queue.push(position);
    }
  }

  return visited;
}
