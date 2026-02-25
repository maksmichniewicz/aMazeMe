import { themeRegistry } from '../../themes/index';
import { useTranslation } from '../../i18n';

const THEME_EMOJI: Record<string, string> = {
  basic: '⬛',
  garden: '🌿',
  mine: '⛏️',
  desert: '🏜️',
  ocean: '🌊',
};

interface ThemeSelectorProps {
  selectedThemeId: string;
  onChange: (id: string) => void;
}

export function ThemeSelector({ selectedThemeId, onChange }: ThemeSelectorProps) {
  const themes = themeRegistry.getAll();
  const { t } = useTranslation();

  return (
    <div className="control-group">
      <label className="control-label">{t('theme')}</label>
      <div className="theme-cards">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-card ${selectedThemeId === theme.id ? 'active' : ''}`}
            onClick={() => onChange(theme.id)}
          >
            <span className="theme-card-name">{THEME_EMOJI[theme.id] ?? ''} {t(`theme_${theme.id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
