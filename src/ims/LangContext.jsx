import { createContext, useContext, useEffect, useState } from 'react';
import { t as translate } from './i18n';

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ims_lang') || 'en');
  useEffect(() => { localStorage.setItem('ims_lang', lang); }, [lang]);
  const t = (key) => translate(key, lang);
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Render a bilingual label pair [en, hi] in the active language. */
export function useLabel() {
  const { lang } = useLang();
  return (pair) => (Array.isArray(pair) ? (lang === 'hi' ? pair[1] : pair[0]) : pair);
}
