import { useState, useCallback, type ReactNode } from 'react';
import { en } from './translations/en';
import { pl } from './translations/pl';
import { LanguageContext, type Language } from './context';

const translations: Record<Language, Record<string, string>> = { en, pl };

function getInitialLang(): Language {
  const stored = localStorage.getItem('amazeme-lang');
  if (stored === 'en' || stored === 'pl') return stored;
  const browserLang = navigator.language.slice(0, 2);
  return browserLang === 'pl' ? 'pl' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('amazeme-lang', newLang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = translations[lang][key] ?? translations.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
