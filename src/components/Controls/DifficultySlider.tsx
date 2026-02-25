import { MIN_DIFFICULTY, MAX_DIFFICULTY } from '../../utils/constants';
import { useTranslation } from '../../i18n';

interface DifficultySliderProps {
  value: number;
  onChange: (v: number) => void;
}

const LABEL_KEYS: Record<number, string> = {
  0: 'singlePath',
  1: 'veryHard',
  3: 'hard',
  5: 'moderate',
  7: 'easy',
  10: 'veryEasy',
};

function getClosestKey(value: number): string {
  const keys = Object.keys(LABEL_KEYS).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(k - value) < Math.abs(closest - value)) {
      closest = k;
    }
  }
  return LABEL_KEYS[closest];
}

export function DifficultySlider({ value, onChange }: DifficultySliderProps) {
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <label className="control-label">
        {t('difficulty')} <strong>{t(getClosestKey(value))}</strong> ({value})
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
        <span>{t('hard')}</span>
        <span>{t('easy')}</span>
      </div>
    </div>
  );
}
