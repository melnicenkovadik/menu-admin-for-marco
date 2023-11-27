import { useCallback, useContext, useEffect, useState } from 'react';

import {
  LanguageContext,
  defaultLocale,
  // locales,
} from '../contexts/LanguageContext';
import { LangStrings } from '../lib/strings';
import { useRecoilState } from 'recoil';
import { langState } from '../store/atoms/lang';
import axios from 'axios';

async function getLanguages() {
  const langs = axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/lang');
  const res = await langs;
  const data = res.data.data;
  return data;
}


export default function useTranslation() {
  const [locale, setLocale] = useContext(LanguageContext);
  // const [languages, setLang] = useRecoilState(langState);
  const [languages, setLang] = useState([]);

  useEffect(() => {
    if (!languages?.length) {
      (async () => {
        const langs = await getLanguages();
        setLang(langs);

        const curLocale = localStorage.getItem('lang') || locale;
        const defaultLang = languages.find((lang) => lang.default);
        console.log('defaultLang', defaultLang);
        setLocale(defaultLang?.prefix || curLocale);
      })();
    }
  }, []);

  const t = useCallback((key: string) => {
    if (!LangStrings[locale][key]) {
      console.warn(`No string '${key}' for locale '${locale}'`);
    }

    return LangStrings[locale][key] || LangStrings[defaultLocale][key] || '';
  }, [locale]);

  return { t, locale, setLocale, locales: languages?.map((lang) => lang.prefix) };
}
