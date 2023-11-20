import { createContext, useEffect, useState } from 'react';

export const defaultLocale = 'it';
export const locales = ['ua', 'en','it'];
export const LanguageContext = createContext([]);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    if (!window) {
      return;
    }

    const language = localStorage.getItem('lang') || locale;
    setLocale(language);
  }, [locale]);

  return (
    <LanguageContext.Provider value={[locale, setLocale]}>
      {children}
    </LanguageContext.Provider>
  );
}
