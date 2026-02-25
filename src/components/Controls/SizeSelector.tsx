import { MIN_MAZE_SIZE, MAX_MAZE_SIZE } from '../../utils/constants';
import { useTranslation } from '../../i18n';

interface SizeSelectorProps {
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
}

const PRESETS = [
  { key: 'small', width: 10, height: 10 },
  { key: 'medium', width: 20, height: 20 },
  { key: 'large', width: 30, height: 30 },
  { key: 'giant', width: 50, height: 50 },
];

export function SizeSelector({ width, height, onWidthChange, onHeightChange }: SizeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <label className="control-label">{t('mazeSize')}</label>
      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            className={`preset-btn ${width === p.width && height === p.height ? 'active' : ''}`}
            onClick={() => {
              onWidthChange(p.width);
              onHeightChange(p.height);
            }}
          >
            {t(p.key)}
          </button>
        ))}
      </div>
      <div className="size-inputs">
        <div className="size-input">
          <span>{t('width')}</span>
          <input
            type="number"
            min={MIN_MAZE_SIZE}
            max={MAX_MAZE_SIZE}
            value={width}
            onChange={(e) => onWidthChange(Math.max(MIN_MAZE_SIZE, Math.min(MAX_MAZE_SIZE, Number(e.target.value))))}
          />
        </div>
        <div className="size-input">
          <span>{t('height')}</span>
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
