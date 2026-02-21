import { useCallback, useRef } from 'react';
import type { Maze, DoorKeyMode } from '../core/types';
import { generateMaze } from '../core/MazeGenerator';
import { applyDifficultyModifier } from '../core/MazeDifficultyModifier';
import { verifyMaze } from '../core/MazeVerifier';
import type { ItemInstance } from '../items/types';
import { placeItems } from '../items/ItemPlacer';
import { verifyItemPlacement } from '../items/ItemVerifier';

interface MazeConfig {
  width: number;
  height: number;
  difficulty: number;
  keyDoorPairs: number;
  treasures: number;
  doorKeyMode: DoorKeyMode;
}

interface MazeResult {
  maze: Maze;
  items: ItemInstance[];
  error?: string;
}

export function useMazeGenerator() {
  const seedRef = useRef(Math.floor(Math.random() * 1000000));
  const lastSeedRef = useRef(0);

  const generate = useCallback((config: MazeConfig): MazeResult => {
    const seed = seedRef.current++;
    lastSeedRef.current = seed;

    let maze = generateMaze(config.width, config.height, seed);
    maze = applyDifficultyModifier(maze, config.difficulty, seed);

    if (!verifyMaze(maze)) {
      return {
        maze,
        items: [],
        error: 'Nie udało się wygenerować rozwiązywalnego labiryntu. Spróbuj ponownie.',
      };
    }

    // Place items
    const hasItems = config.keyDoorPairs > 0 || config.treasures > 0;
    if (!hasItems) {
      return { maze, items: [] };
    }

    const { items, error: placeError } = placeItems(
      maze,
      config.keyDoorPairs,
      config.treasures,
      seed,
      config.doorKeyMode,
    );

    if (placeError) {
      return { maze, items, error: placeError };
    }

    // Verify item placement (progressive BFS + treasure reachability)
    if (!verifyItemPlacement(maze, items, config.doorKeyMode)) {
      return {
        maze,
        items: [],
        error: 'Układ przedmiotów jest nierozwiązywalny. Spróbuj ponownie lub zmniejsz liczbę par klucz-drzwi.',
      };
    }

    return { maze, items };
  }, []);

  const generateMultiple = useCallback((config: MazeConfig, count: number): MazeResult[] => {
    const results: MazeResult[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generate(config));
    }
    return results;
  }, [generate]);

  const updateItems = useCallback(
    (maze: Maze, keyDoorPairs: number, treasures: number, doorKeyMode: DoorKeyMode): { items: ItemInstance[]; error?: string } => {
      if (keyDoorPairs === 0 && treasures === 0) {
        return { items: [] };
      }

      const seed = lastSeedRef.current;
      const { items, error: placeError } = placeItems(maze, keyDoorPairs, treasures, seed, doorKeyMode);

      if (placeError) {
        return { items, error: placeError };
      }

      if (!verifyItemPlacement(maze, items, doorKeyMode)) {
        return {
          items: [],
          error: 'Układ przedmiotów jest nierozwiązywalny. Zmniejsz liczbę par klucz-drzwi.',
        };
      }

      return { items };
    },
    [],
  );

  return { generate, generateMultiple, updateItems };
}
