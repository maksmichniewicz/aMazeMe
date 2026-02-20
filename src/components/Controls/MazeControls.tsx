import { SizeSelector } from './SizeSelector';
import { DifficultySlider } from './DifficultySlider';
import { ThemeSelector } from './ThemeSelector';
import { ItemConfigPanel } from './ItemConfigPanel';

interface MazeControlsProps {
  width: number;
  height: number;
  difficulty: number;
  themeId: string;
  keyDoorPairs: number;
  treasures: number;
  mazeCount: number;
  maxMazeCount: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  onDifficultyChange: (d: number) => void;
  onThemeChange: (id: string) => void;
  onKeyDoorPairsChange: (v: number) => void;
  onTreasuresChange: (v: number) => void;
  onMazeCountChange: (v: number) => void;
  onGenerate: () => void;
  onPrint: () => void;
  hasMaze: boolean;
}

export function MazeControls(props: MazeControlsProps) {
  return (
    <div className="maze-controls">
      <SizeSelector
        width={props.width}
        height={props.height}
        onWidthChange={props.onWidthChange}
        onHeightChange={props.onHeightChange}
      />
      <DifficultySlider
        value={props.difficulty}
        onChange={props.onDifficultyChange}
      />
      <ThemeSelector
        selectedThemeId={props.themeId}
        onChange={props.onThemeChange}
      />
      <ItemConfigPanel
        keyDoorPairs={props.keyDoorPairs}
        treasures={props.treasures}
        onKeyDoorPairsChange={props.onKeyDoorPairsChange}
        onTreasuresChange={props.onTreasuresChange}
      />
      <div className="control-group">
        <label className="control-label">Ilość labiryntów</label>
        <div className="item-config">
          <div className="item-row">
            <span>Na stronę:</span>
            <div className="stepper">
              <button onClick={() => props.onMazeCountChange(Math.max(1, props.mazeCount - 1))}>−</button>
              <span className="stepper-value">{props.mazeCount}</span>
              <button onClick={() => props.onMazeCountChange(Math.min(props.maxMazeCount, props.mazeCount + 1))}>+</button>
            </div>
          </div>
        </div>
      </div>
      <div className="control-buttons">
        <button className="btn btn-primary" onClick={props.onGenerate}>
          Utwórz
        </button>
        {props.hasMaze && (
          <button className="btn btn-secondary" onClick={props.onPrint}>
            Drukuj
          </button>
        )}
      </div>
    </div>
  );
}
