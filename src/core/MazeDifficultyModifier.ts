import type { Maze, Direction } from './types';
import { SeededRandom } from '../utils/random';
import { OPPOSITE_DIRECTION, ALL_DIRECTIONS, getNeighbor, isInBounds } from '../utils/gridHelpers';
import { solveMaze } from './MazeSolver';

interface InternalWall {
  row: number;
  col: number;
  direction: Direction;
}

/**
 * Modifies maze difficulty by removing extra walls.
 * difficulty 0 = perfect maze (1 path), 10 = 10% of internal walls removed.
 */
export function applyDifficultyModifier(maze: Maze, difficulty: number, seed: number): Maze {
  if (difficulty <= 0) return maze;

  const rng = new SeededRandom(seed + 1000);

  // Collect all internal walls
  const internalWalls: InternalWall[] = [];
  for (let row = 0; row < maze.height; row++) {
    for (let col = 0; col < maze.width; col++) {
      for (const dir of ALL_DIRECTIONS) {
        if (!maze.grid[row][col].walls[dir]) continue;
        const neighbor = getNeighbor({ row, col }, dir);
        if (!isInBounds(neighbor, maze.width, maze.height)) continue;

        // Only count each wall once (south & east to avoid duplicates)
        if (dir === 'south' || dir === 'east') {
          internalWalls.push({ row, col, direction: dir });
        }
      }
    }
  }

  const wallsToRemove = Math.floor(internalWalls.length * (difficulty / 100));
  rng.shuffle(internalWalls);

  for (let i = 0; i < wallsToRemove && i < internalWalls.length; i++) {
    const wall = internalWalls[i];
    const neighbor = getNeighbor({ row: wall.row, col: wall.col }, wall.direction);

    maze.grid[wall.row][wall.col].walls[wall.direction] = false;
    maze.grid[neighbor.row][neighbor.col].walls[OPPOSITE_DIRECTION[wall.direction]] = false;
  }

  // Recalculate solution with new paths
  maze.solution = solveMaze(maze.grid, maze.entrance, maze.exit, maze.width, maze.height);

  return maze;
}
