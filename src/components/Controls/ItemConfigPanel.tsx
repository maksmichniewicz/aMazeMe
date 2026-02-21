import { MAX_TREASURES } from '../../utils/constants';
import type { DoorKeyMode } from '../../core/types';

interface ItemConfigPanelProps {
  keyDoorPairs: number;
  treasures: number;
  doorKeyMode: DoorKeyMode;
  maxKeyDoorPairs: number;
  onKeyDoorPairsChange: (v: number) => void;
  onTreasuresChange: (v: number) => void;
  onDoorKeyModeChange: (m: DoorKeyMode) => void;
}

export function ItemConfigPanel({
  keyDoorPairs,
  treasures,
  doorKeyMode,
  maxKeyDoorPairs,
  onKeyDoorPairsChange,
  onTreasuresChange,
  onDoorKeyModeChange,
}: ItemConfigPanelProps) {
  return (
    <div className="control-group">
      <label className="control-label">Przedmioty</label>
      <div className="item-config">
        <div className="item-row">
          <span>Przejścia:</span>
          <div className="stepper">
            <button onClick={() => onKeyDoorPairsChange(Math.max(0, keyDoorPairs - 1))}>−</button>
            <span className="stepper-value">{keyDoorPairs}</span>
            <button onClick={() => onKeyDoorPairsChange(Math.min(maxKeyDoorPairs, keyDoorPairs + 1))}>+</button>
          </div>
        </div>
        {keyDoorPairs > 0 && (
          <div className="item-row">
            <span>Tryb:</span>
            <div className="mode-selector">
              <button
                className={doorKeyMode === 'colored' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('colored')}
              >
                Kolory
              </button>
              <button
                className={doorKeyMode === 'numbered' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('numbered')}
              >
                Symbole
              </button>
              <button
                className={doorKeyMode === 'generic' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('generic')}
              >
                Dowolny
              </button>
            </div>
          </div>
        )}
        <div className="item-row">
          <span>Skarby:</span>
          <div className="stepper">
            <button onClick={() => onTreasuresChange(Math.max(0, treasures - 1))}>−</button>
            <span className="stepper-value">{treasures}</span>
            <button onClick={() => onTreasuresChange(Math.min(MAX_TREASURES, treasures + 1))}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
