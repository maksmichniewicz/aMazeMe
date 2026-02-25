import { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { Layout } from './components/Layout/Layout';
import { MazeControls } from './components/Controls/MazeControls';
import { MazeCanvas } from './components/MazeCanvas/MazeCanvas';
import { PrintView } from './components/PrintView/PrintView';
import { useMazeGenerator, type MazeError } from './hooks/useMazeGenerator';
import { usePrint } from './hooks/usePrint';
import { useTranslation } from './i18n';
import { themeRegistry } from './themes/index';
import type { Maze, DoorKeyMode } from './core/types';
import type { ItemInstance } from './items/types';
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_DIFFICULTY,
  DEFAULT_DOOR_KEY_MODE,
  MAX_KEY_DOOR_PAIRS,
} from './utils/constants';
import './App.css';

interface MazeEntry {
  maze: Maze;
  items: ItemInstance[];
}

function getMaxMazeCount(width: number, height: number): number {
  if (width <= 15 && height <= 15) return 12;  // Small: 3x4
  if (width <= 25 && height <= 25) return 6;   // Medium: 2x3
  if (width <= 40 && height <= 40) return 4;   // Large: 2x2
  return 2;                                     // Giant: 1x2
}

function getGridCols(width: number, height: number, count: number): number {
  if (count <= 1) return 1;
  if (width > 40 || height > 40) return 1;
  if (width > 15 || height > 15) return 2;
  return Math.min(3, count);
}

function getPrintCols(width: number, height: number): number {
  if (width > 40 || height > 40) return 1;
  if (width > 15 || height > 15) return 2;
  return 3;
}

function getMaxKeyDoorPairs(width: number, height: number): number {
  return Math.min(MAX_KEY_DOOR_PAIRS, Math.floor(Math.min(width, height) / 5));
}

function App() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [themeId, setThemeId] = useState('basic');
  const [keyDoorPairs, setKeyDoorPairs] = useState(0);
  const [treasures, setTreasures] = useState(0);
  const [doorKeyMode, setDoorKeyMode] = useState<DoorKeyMode>(DEFAULT_DOOR_KEY_MODE);
  const [mazeCount, setMazeCount] = useState(1);
  const [mazes, setMazes] = useState<MazeEntry[]>([]);
  const [error, setError] = useState<MazeError | null>(null);

  const printCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const { generateMultiple, updateItems } = useMazeGenerator();
  const { print } = usePrint();
  const { t } = useTranslation();

  const theme = themeRegistry.get(themeId) || themeRegistry.getAll()[0];
  const maxMazeCount = getMaxMazeCount(width, height);
  const maxKeyDoorPairs = getMaxKeyDoorPairs(width, height);

  const handleWidthChange = useCallback((w: number) => {
    setWidth(w);
    const newMax = getMaxMazeCount(w, height);
    setMazeCount((prev) => Math.min(prev, newMax));
    const newMaxPairs = getMaxKeyDoorPairs(w, height);
    setKeyDoorPairs((prev) => Math.min(prev, newMaxPairs));
  }, [height]);

  const handleHeightChange = useCallback((h: number) => {
    setHeight(h);
    const newMax = getMaxMazeCount(width, h);
    setMazeCount((prev) => Math.min(prev, newMax));
    const newMaxPairs = getMaxKeyDoorPairs(width, h);
    setKeyDoorPairs((prev) => Math.min(prev, newMaxPairs));
  }, [width]);

  const handleGenerate = useCallback(() => {
    const results = generateMultiple({ width, height, difficulty, keyDoorPairs, treasures, doorKeyMode }, mazeCount);
    const entries: MazeEntry[] = results.map((r) => ({ maze: r.maze, items: r.items }));
    setMazes(entries);
    const firstError = results.find((r) => r.error)?.error;
    setError(firstError || null);
  }, [width, height, difficulty, keyDoorPairs, treasures, doorKeyMode, mazeCount, generateMultiple]);

  const handleKeyDoorPairsChange = useCallback((value: number) => {
    setKeyDoorPairs(value);
    if (mazes.length > 0) {
      const updated = mazes.map((entry) => {
        const result = updateItems(entry.maze, value, treasures, doorKeyMode);
        return { maze: entry.maze, items: result.items };
      });
      setMazes(updated);
    }
  }, [mazes, treasures, doorKeyMode, updateItems]);

  const handleTreasuresChange = useCallback((value: number) => {
    setTreasures(value);
    if (mazes.length > 0) {
      const updated = mazes.map((entry) => {
        const result = updateItems(entry.maze, keyDoorPairs, value, doorKeyMode);
        return { maze: entry.maze, items: result.items };
      });
      setMazes(updated);
    }
  }, [mazes, keyDoorPairs, doorKeyMode, updateItems]);

  const handleDoorKeyModeChange = useCallback((mode: DoorKeyMode) => {
    setDoorKeyMode(mode);
    if (mazes.length > 0 && keyDoorPairs > 0) {
      const updated = mazes.map((entry) => {
        const result = updateItems(entry.maze, keyDoorPairs, treasures, mode);
        return { maze: entry.maze, items: result.items };
      });
      setMazes(updated);
    }
  }, [mazes, keyDoorPairs, treasures, updateItems]);

  const handlePrint = useCallback(() => {
    const canvases = printCanvasRefs.current.filter((c): c is HTMLCanvasElement => c !== null);
    if (canvases.length > 0) {
      const cols = Math.min(getPrintCols(width, height), canvases.length);
      print(canvases, cols, t('printTitle'));
    }
  }, [print, width, height, t]);

  const gridCols = getGridCols(width, height, mazes.length);

  return (
    <div className="app">
      <Header />
      {error && <div className="error-banner">{t(error.key, error.params)}</div>}
      <Layout
        sidebar={
          <MazeControls
            width={width}
            height={height}
            difficulty={difficulty}
            themeId={themeId}
            keyDoorPairs={keyDoorPairs}
            treasures={treasures}
            doorKeyMode={doorKeyMode}
            maxKeyDoorPairs={maxKeyDoorPairs}
            mazeCount={mazeCount}
            maxMazeCount={maxMazeCount}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
            onDifficultyChange={setDifficulty}
            onThemeChange={setThemeId}
            onKeyDoorPairsChange={handleKeyDoorPairsChange}
            onTreasuresChange={handleTreasuresChange}
            onDoorKeyModeChange={handleDoorKeyModeChange}
            onMazeCountChange={setMazeCount}
            onGenerate={handleGenerate}
            onPrint={handlePrint}
            hasMaze={mazes.length > 0}
          />
        }
      >
        {mazes.length === 0 ? (
          <MazeCanvas maze={null} theme={theme} items={[]} doorKeyMode={doorKeyMode} />
        ) : (
          <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
            {mazes.map((entry, i) => (
              <MazeCanvas
                key={i}
                maze={entry.maze}
                theme={theme}
                items={entry.items}
                doorKeyMode={doorKeyMode}
              />
            ))}
          </div>
        )}
      </Layout>
      <PrintView
        mazes={mazes}
        theme={theme}
        canvasRefs={printCanvasRefs}
        doorKeyMode={doorKeyMode}
      />
    </div>
  );
}

export default App;
