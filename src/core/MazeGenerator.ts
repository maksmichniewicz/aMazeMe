import type { Cell, Maze, Position } from './types';
import { SeededRandom } from '../utils/random';
import {
  createGrid,
  isInBounds,
  getNeighbor,
  ALL_DIRECTIONS,
  OPPOSITE_DIRECTION,
} from '../utils/gridHelpers';
import { solveMaze } from './MazeSolver';

export function generateMaze(width: number, height: number, seed: number): Maze {
  const rng = new SeededRandom(seed);
  const grid = createGrid(width, height);

  // Iterative DFS (Recursive Backtracker)
  const stack: Position[] = [];
  const start: Position = { row: 0, col: 0 };
  grid[start.row][start.col].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, current, width, height);

    if (unvisitedNeighbors.length === 0) {
      stack.pop();
      continue;
    }

    rng.shuffle(unvisitedNeighbors);
    const { position: next, direction } = unvisitedNeighbors[0];

    // Remove walls between current and next
    grid[current.row][current.col].walls[direction] = false;
    grid[next.row][next.col].walls[OPPOSITE_DIRECTION[direction]] = false;

    grid[next.row][next.col].visited = true;
    stack.push(next);
  }

  const entrance: Position = { row: 0, col: 0 };
  const exit: Position = { row: height - 1, col: width - 1 };

  // Open entrance (west wall) and exit (east wall)
  grid[entrance.row][entrance.col].walls.west = false;
  grid[exit.row][exit.col].walls.east = false;

  const solution = solveMaze(grid, entrance, exit, width, height);

  return {
    width,
    height,
    grid,
    entrance,
    exit,
    seed,
    solution,
  };
}

function getUnvisitedNeighbors(
  grid: Cell[][],
  pos: Position,
  width: number,
  height: number,
) {
  const neighbors: { position: Position; direction: (typeof ALL_DIRECTIONS)[number] }[] = [];
  for (const dir of ALL_DIRECTIONS) {
    const neighbor = getNeighbor(pos, dir);
    if (isInBounds(neighbor, width, height) && !grid[neighbor.row][neighbor.col].visited) {
      neighbors.push({ position: neighbor, direction: dir });
    }
  }
  return neighbors;
}
