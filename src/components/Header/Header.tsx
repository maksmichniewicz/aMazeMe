import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="header-icon">🏰</span>
          <h1>aMazeMe</h1>
        </div>
        <LanguageSwitcher />
      </div>
      <p className="header-subtitle">{t('subtitle')}</p>
    </header>
  );
}
