import { MAX_KEY_DOOR_PAIRS, MAX_TREASURES } from '../../utils/constants';

interface ItemConfigPanelProps {
  keyDoorPairs: number;
  treasures: number;
  onKeyDoorPairsChange: (v: number) => void;
  onTreasuresChange: (v: number) => void;
}

export function ItemConfigPanel({
  keyDoorPairs,
  treasures,
  onKeyDoorPairsChange,
  onTreasuresChange,
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
            <button onClick={() => onKeyDoorPairsChange(Math.min(MAX_KEY_DOOR_PAIRS, keyDoorPairs + 1))}>+</button>
          </div>
        </div>
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
