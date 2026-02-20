import { themeRegistry } from '../../themes/index';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onChange: (id: string) => void;
}

export function ThemeSelector({ selectedThemeId, onChange }: ThemeSelectorProps) {
  const themes = themeRegistry.getAll();

  return (
    <div className="control-group">
      <label className="control-label">Motyw</label>
      <div className="theme-cards">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-card ${selectedThemeId === theme.id ? 'active' : ''}`}
            onClick={() => onChange(theme.id)}
          >
            <span className="theme-card-name">{theme.name}</span>
            <span className="theme-card-desc">{theme.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
