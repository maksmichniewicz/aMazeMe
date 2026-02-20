import { MIN_MAZE_SIZE, MAX_MAZE_SIZE } from '../../utils/constants';

interface SizeSelectorProps {
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
}

const PRESETS = [
  { label: 'Mały (10x10)', width: 10, height: 10 },
  { label: 'Średni (20x20)', width: 20, height: 20 },
  { label: 'Duży (30x30)', width: 30, height: 30 },
];

export function SizeSelector({ width, height, onWidthChange, onHeightChange }: SizeSelectorProps) {
  return (
    <div className="control-group">
      <label className="control-label">Rozmiar labiryntu</label>
      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn ${width === p.width && height === p.height ? 'active' : ''}`}
            onClick={() => {
              onWidthChange(p.width);
              onHeightChange(p.height);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="size-inputs">
        <div className="size-input">
          <span>Szerokość:</span>
          <input
            type="number"
            min={MIN_MAZE_SIZE}
            max={MAX_MAZE_SIZE}
            value={width}
            onChange={(e) => onWidthChange(Math.max(MIN_MAZE_SIZE, Math.min(MAX_MAZE_SIZE, Number(e.target.value))))}
          />
        </div>
        <div className="size-input">
          <span>Wysokość:</span>
          <input
            type="number"
            min={MIN_MAZE_SIZE}
            max={MAX_MAZE_SIZE}
            value={height}
            onChange={(e) => onHeightChange(Math.max(MIN_MAZE_SIZE, Math.min(MAX_MAZE_SIZE, Number(e.target.value))))}
          />
        </div>
      </div>
    </div>
  );
}
