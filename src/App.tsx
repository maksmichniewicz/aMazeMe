import { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { Layout } from './components/Layout/Layout';
import { MazeControls } from './components/Controls/MazeControls';
import { MazeCanvas } from './components/MazeCanvas/MazeCanvas';
import { PrintView } from './components/PrintView/PrintView';
import { useMazeGenerator } from './hooks/useMazeGenerator';
import { usePrint } from './hooks/usePrint';
import { themeRegistry } from './themes/index';
import type { Maze } from './core/types';
import type { ItemInstance } from './items/types';
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_DIFFICULTY,
} from './utils/constants';
import './App.css';

interface MazeEntry {
  maze: Maze;
  items: ItemInstance[];
}

function getMaxMazeCount(width: number, height: number): number {
  if (width <= 15 && height <= 15) return 12;
  if (width <= 25 && height <= 25) return 6;
  return 4;
}

function App() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [themeId, setThemeId] = useState('basic');
  const [keyDoorPairs, setKeyDoorPairs] = useState(0);
  const [treasures, setTreasures] = useState(0);
  const [mazeCount, setMazeCount] = useState(1);
  const [mazes, setMazes] = useState<MazeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const printCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const { generateMultiple, updateItems } = useMazeGenerator();
  const { print } = usePrint();

  const theme = themeRegistry.get(themeId) || themeRegistry.getAll()[0];
  const maxMazeCount = getMaxMazeCount(width, height);

  const handleWidthChange = useCallback((w: number) => {
    setWidth(w);
    const newMax = getMaxMazeCount(w, height);
    setMazeCount((prev) => Math.min(prev, newMax));
  }, [height]);

  const handleHeightChange = useCallback((h: number) => {
    setHeight(h);
    const newMax = getMaxMazeCount(width, h);
    setMazeCount((prev) => Math.min(prev, newMax));
  }, [width]);

  const handleGenerate = useCallback(() => {
    const results = generateMultiple({ width, height, difficulty, keyDoorPairs, treasures }, mazeCount);
    const entries: MazeEntry[] = results.map((r) => ({ maze: r.maze, items: r.items }));
    setMazes(entries);
    const firstError = results.find((r) => r.error)?.error;
    setError(firstError || null);
  }, [width, height, difficulty, keyDoorPairs, treasures, mazeCount, generateMultiple]);

  const handleKeyDoorPairsChange = useCallback((value: number) => {
    setKeyDoorPairs(value);
    if (mazes.length > 0) {
      const updated = mazes.map((entry) => {
        const result = updateItems(entry.maze, value, treasures);
        return { maze: entry.maze, items: result.items };
      });
      setMazes(updated);
    }
  }, [mazes, treasures, updateItems]);

  const handleTreasuresChange = useCallback((value: number) => {
    setTreasures(value);
    if (mazes.length > 0) {
      const updated = mazes.map((entry) => {
        const result = updateItems(entry.maze, keyDoorPairs, value);
        return { maze: entry.maze, items: result.items };
      });
      setMazes(updated);
    }
  }, [mazes, keyDoorPairs, updateItems]);

  const handlePrint = useCallback(() => {
    const canvases = printCanvasRefs.current.filter((c): c is HTMLCanvasElement => c !== null);
    if (canvases.length > 0) {
      const cols = width <= 15 ? (canvases.length > 6 ? 4 : 3) : width <= 25 ? 2 : 1;
      print(canvases, cols);
    }
  }, [print, width]);

  const gridCols = mazes.length <= 1 ? 1
    : mazes.length <= 2 ? 2
    : mazes.length <= 4 ? 2
    : mazes.length <= 6 ? 3
    : 4;

  return (
    <div className="app">
      <Header />
      {error && <div className="error-banner">{error}</div>}
      <Layout
        sidebar={
          <MazeControls
            width={width}
            height={height}
            difficulty={difficulty}
            themeId={themeId}
            keyDoorPairs={keyDoorPairs}
            treasures={treasures}
            mazeCount={mazeCount}
            maxMazeCount={maxMazeCount}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
            onDifficultyChange={setDifficulty}
            onThemeChange={setThemeId}
            onKeyDoorPairsChange={handleKeyDoorPairsChange}
            onTreasuresChange={handleTreasuresChange}
            onMazeCountChange={setMazeCount}
            onGenerate={handleGenerate}
            onPrint={handlePrint}
            hasMaze={mazes.length > 0}
          />
        }
      >
        {mazes.length === 0 ? (
          <MazeCanvas maze={null} theme={theme} items={[]} />
        ) : (
          <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
            {mazes.map((entry, i) => (
              <MazeCanvas
                key={i}
                maze={entry.maze}
                theme={theme}
                items={entry.items}
              />
            ))}
          </div>
        )}
      </Layout>
      <PrintView
        mazes={mazes}
        theme={theme}
        canvasRefs={printCanvasRefs}
      />
    </div>
  );
}

export default App;
