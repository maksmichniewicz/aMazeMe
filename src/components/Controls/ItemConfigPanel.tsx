import { MAX_TREASURES } from '../../utils/constants';
import type { DoorKeyMode } from '../../core/types';
import { useTranslation } from '../../i18n';

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
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <label className="control-label">{t('items')}</label>
      <div className="item-config">
        <div className="item-row">
          <span>{t('passages')}</span>
          <div className="stepper">
            <button onClick={() => onKeyDoorPairsChange(Math.max(0, keyDoorPairs - 1))}>−</button>
            <span className="stepper-value">{keyDoorPairs}</span>
            <button onClick={() => onKeyDoorPairsChange(Math.min(maxKeyDoorPairs, keyDoorPairs + 1))}>+</button>
          </div>
        </div>
        {keyDoorPairs > 0 && (
          <div className="item-row">
            <span>{t('mode')}</span>
            <div className="mode-selector">
              <button
                className={doorKeyMode === 'colored' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('colored')}
              >
                {t('colors')}
              </button>
              <button
                className={doorKeyMode === 'numbered' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('numbered')}
              >
                {t('symbols')}
              </button>
              <button
                className={doorKeyMode === 'generic' ? 'active' : ''}
                onClick={() => onDoorKeyModeChange('generic')}
              >
                {t('generic')}
              </button>
            </div>
          </div>
        )}
        <div className="item-row">
          <span>{t('treasures')}</span>
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
