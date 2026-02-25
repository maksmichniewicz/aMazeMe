import { useTranslation } from '../../i18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${lang === 'pl' ? 'active' : ''}`}
        onClick={() => setLang('pl')}
        title="Polski"
      >
        PL
      </button>
    </div>
  );
}
