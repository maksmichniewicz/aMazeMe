import { MIN_DIFFICULTY, MAX_DIFFICULTY } from '../../utils/constants';

interface DifficultySliderProps {
  value: number;
  onChange: (v: number) => void;
}

const LABELS: Record<number, string> = {
  0: 'Jedna ścieżka',
  1: 'Bardzo trudny',
  3: 'Trudny',
  5: 'Średni',
  7: 'Łatwy',
  10: 'Bardzo łatwy',
};

function getLabel(value: number): string {
  const keys = Object.keys(LABELS).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(k - value) < Math.abs(closest - value)) {
      closest = k;
    }
  }
  return LABELS[closest];
}

export function DifficultySlider({ value, onChange }: DifficultySliderProps) {
  return (
    <div className="control-group">
      <label className="control-label">
        Trudność: <strong>{getLabel(value)}</strong> ({value})
      </label>
      <input
        type="range"
        min={MIN_DIFFICULTY}
        max={MAX_DIFFICULTY}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="difficulty-slider"
      />
      <div className="slider-labels">
        <span>Trudny</span>
        <span>Łatwy</span>
      </div>
    </div>
  );
}
