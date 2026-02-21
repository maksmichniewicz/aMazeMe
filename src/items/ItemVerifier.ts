import type { Maze, Position, DoorKeyMode } from '../core/types';
import type { ItemInstance } from './types';
import {
  getAccessibleNeighbors,
  getNeighbor,
  positionKey,
  wallPositionKey,
  bfsWithBlockedPassages,
} from '../utils/gridHelpers';

/**
 * Verifies that the maze with items is solvable using Progressive BFS.
 * Also checks for deadlocks in key-door dependencies.
 * Verifies all treasures are reachable.
 */
export function verifyItemPlacement(
  maze: Maze,
  items: ItemInstance[],
  doorKeyMode: DoorKeyMode,
): boolean {
  const doors = items.filter((i) => i.typeId === 'door');
  const keys = items.filter((i) => i.typeId === 'key');
  const treasures = items.filter((i) => i.typeId === 'treasure');

  if (doors.length === 0) {
    // No doors — just verify all treasures are reachable via simple BFS
    if (treasures.length === 0) return true;
    const reachable = bfsReachableFromEntrance(maze);
    return treasures.every((t) => reachable.has(positionKey(t.position)));
  }

  // Check for dependency cycles (deadlocks) — only for paired modes
  if (doorKeyMode !== 'generic') {
    if (hasDeadlock(maze, keys, doors)) return false;
  }

  // Progressive BFS — mode determines strategy
  const visited = doorKeyMode === 'generic'
    ? progressiveBFSGeneric(maze, keys, doors)
    : progressiveBFSPaired(maze, keys, doors);

  if (!visited.has(positionKey(maze.exit))) return false;

  // Verify all treasures are reachable
  return treasures.every((t) => visited.has(positionKey(t.position)));
}

/**
 * Progressive BFS for paired modes (colored/numbered):
 * Expand reachable area, collect keys, open matching doors, repeat.
 * Doors block specific passages (edges), not cells.
 */
function progressiveBFSPaired(maze: Maze, keys: ItemInstance[], doors: ItemInstance[]): Set<string> {
  // Map passage keys to door instances
  const doorPassageMap = new Map<string, ItemInstance>();
  for (const door of doors) {
    if (door.wallPosition) {
      doorPassageMap.set(wallPositionKey(door.wallPosition), door);
    }
  }

  // Map cell keys to key instances
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
        for (const { position, direction } of neighbors) {
          const nKey = positionKey(position);
          if (visited.has(nKey)) continue;

          // Check if this EDGE has an unopened door
          const passageKey = wallPositionKey({ cell: pos, direction });
          const doorOnEdge = doorPassageMap.get(passageKey);
          if (doorOnEdge && !openedDoors.has(doorOnEdge.id)) {
            continue; // blocked by door
          }

          visited.add(nKey);
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

        // When door opens, add the cell on the other side to frontier
        if (door.wallPosition) {
          const wp = door.wallPosition;
          const cellA = wp.cell;
          const cellB = getNeighbor(wp.cell, wp.direction);
          const keyA = positionKey(cellA);
          const keyB = positionKey(cellB);

          if (visited.has(keyA) && !visited.has(keyB)) {
            visited.add(keyB);
            frontier.push(cellB);
          } else if (visited.has(keyB) && !visited.has(keyA)) {
            visited.add(keyA);
            frontier.push(cellA);
          }
        }
      }
    }
  }

  return visited;
}

/**
 * Progressive BFS for generic mode:
 * Any key opens any door. Count-based: keysCollected > doorsOpened.
 */
function progressiveBFSGeneric(maze: Maze, keys: ItemInstance[], doors: ItemInstance[]): Set<string> {
  const doorPassageMap = new Map<string, ItemInstance>();
  for (const door of doors) {
    if (door.wallPosition) {
      doorPassageMap.set(wallPositionKey(door.wallPosition), door);
    }
  }

  const keyPositions = new Map<string, ItemInstance>();
  for (const key of keys) {
    keyPositions.set(positionKey(key.position), key);
  }

  const collectedKeyIds = new Set<string>();
  const openedDoors = new Set<string>();
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
        const keyHere = keyPositions.get(positionKey(pos));
        if (keyHere && !collectedKeyIds.has(keyHere.id)) {
          collectedKeyIds.add(keyHere.id);
          changed = true;
        }

        const neighbors = getAccessibleNeighbors(maze.grid, pos, maze.width, maze.height);
        for (const { position, direction } of neighbors) {
          const nKey = positionKey(position);
          if (visited.has(nKey)) continue;

          const passageKey = wallPositionKey({ cell: pos, direction });
          const doorOnEdge = doorPassageMap.get(passageKey);
          if (doorOnEdge && !openedDoors.has(doorOnEdge.id)) {
            continue;
          }

          visited.add(nKey);
          nextFrontier.push(position);
        }
      }

      frontier = nextFrontier;
    }

    // Generic: open any reachable door if we have spare keys
    for (const door of doors) {
      if (openedDoors.has(door.id)) continue;

      // Can open if we have more keys collected than doors opened
      if (collectedKeyIds.size > openedDoors.size) {
        // Only open if one side of the door is visited (reachable)
        if (door.wallPosition) {
          const wp = door.wallPosition;
          const cellA = wp.cell;
          const cellB = getNeighbor(wp.cell, wp.direction);
          const keyA = positionKey(cellA);
          const keyB = positionKey(cellB);

          if (visited.has(keyA) || visited.has(keyB)) {
            openedDoors.add(door.id);
            changed = true;

            if (visited.has(keyA) && !visited.has(keyB)) {
              visited.add(keyB);
              frontier.push(cellB);
            } else if (visited.has(keyB) && !visited.has(keyA)) {
              visited.add(keyA);
              frontier.push(cellA);
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
 * Uses passage-based blocking (wall positions) instead of cell-based.
 */
function hasDeadlock(maze: Maze, keys: ItemInstance[], doors: ItemInstance[]): boolean {
  const keyDependencies = new Map<string, Set<string>>();

  for (const key of keys) {
    keyDependencies.set(key.id, new Set());
  }

  for (const key of keys) {
    for (const door of doors) {
      if (!door.wallPosition) continue;

      // BFS from entrance blocking this door's passage
      const blockedSet = new Set<string>();
      blockedSet.add(wallPositionKey(door.wallPosition));
      const reachable = bfsWithBlockedPassages(
        maze.grid, maze.entrance, maze.width, maze.height, blockedSet,
      );

      if (!reachable.has(positionKey(key.position))) {
        // Key is only reachable through this door
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
