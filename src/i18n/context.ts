import { createContext } from 'react';

export type Language = 'en' | 'pl';

export interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
