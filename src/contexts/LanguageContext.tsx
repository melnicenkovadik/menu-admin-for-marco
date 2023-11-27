import { createContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { langState } from '../store/atoms/lang';
import Loader from '../components/Loader';

export const defaultLocale = 'it';
// export const locales = ['ua', 'en', 'it'];
export const LanguageContext = createContext([]);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale);
  const [loading, setLoading] = useState(true);
  const [languages] = useRecoilState(langState);

  useEffect(() => {
    setLoading(false);
  }, [locale, languages]);


  return (
    <LanguageContext.Provider value={[locale, setLocale]}>
      {loading ?
        <Loader />
        : children}
    </LanguageContext.Provider>
  );
}


