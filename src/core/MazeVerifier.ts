import type { Maze } from './types';
import { solveMaze } from './MazeSolver';

/**
 * Verifies that the maze is solvable (path exists from entrance to exit).
 */
export function verifyMaze(maze: Maze): boolean {
  const solution = solveMaze(maze.grid, maze.entrance, maze.exit, maze.width, maze.height);
  return solution.length > 0;
}
