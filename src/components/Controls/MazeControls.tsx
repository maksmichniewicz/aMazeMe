import { SizeSelector } from './SizeSelector';
import { DifficultySlider } from './DifficultySlider';
import { ThemeSelector } from './ThemeSelector';
import { ItemConfigPanel } from './ItemConfigPanel';
import type { DoorKeyMode } from '../../core/types';
import { useTranslation } from '../../i18n';

interface MazeControlsProps {
  width: number;
  height: number;
  difficulty: number;
  themeId: string;
  keyDoorPairs: number;
  treasures: number;
  doorKeyMode: DoorKeyMode;
  maxKeyDoorPairs: number;
  mazeCount: number;
  maxMazeCount: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  onDifficultyChange: (d: number) => void;
  onThemeChange: (id: string) => void;
  onKeyDoorPairsChange: (v: number) => void;
  onTreasuresChange: (v: number) => void;
  onDoorKeyModeChange: (m: DoorKeyMode) => void;
  onMazeCountChange: (v: number) => void;
  onGenerate: () => void;
  onPrint: () => void;
  hasMaze: boolean;
}

export function MazeControls(props: MazeControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="maze-controls">
      <div className="maze-controls-scroll">
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
        <div className="control-group">
          <label className="control-label">{t('mazeCount')}</label>
          <div className="item-config">
            <div className="item-row">
              <span>{t('perPage')}</span>
              <div className="stepper">
                <button onClick={() => props.onMazeCountChange(Math.max(1, props.mazeCount - 1))}>−</button>
                <span className="stepper-value">{props.mazeCount}</span>
                <button onClick={() => props.onMazeCountChange(Math.min(props.maxMazeCount, props.mazeCount + 1))}>+</button>
              </div>
            </div>
          </div>
        </div>
        <hr className="controls-separator" />
        <ThemeSelector
          selectedThemeId={props.themeId}
          onChange={props.onThemeChange}
        />
        <ItemConfigPanel
          keyDoorPairs={props.keyDoorPairs}
          treasures={props.treasures}
          doorKeyMode={props.doorKeyMode}
          maxKeyDoorPairs={props.maxKeyDoorPairs}
          onKeyDoorPairsChange={props.onKeyDoorPairsChange}
          onTreasuresChange={props.onTreasuresChange}
          onDoorKeyModeChange={props.onDoorKeyModeChange}
        />
      </div>
      <div className="control-buttons">
        <button className="btn btn-primary" onClick={props.onGenerate}>
          {t('generate')}
        </button>
        {props.hasMaze && (
          <button className="btn btn-secondary" onClick={props.onPrint}>
            {t('print')}
          </button>
        )}
      </div>
    </div>
  );
}
