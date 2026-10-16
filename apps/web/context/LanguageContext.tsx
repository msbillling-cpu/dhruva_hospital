'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language } from '@/types';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (en: string, te?: string, hi?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync document element attributes with language
  const syncHtmlLang = (targetLang: Language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = targetLang;
      document.documentElement.setAttribute('data-lang', targetLang);
      document.documentElement.classList.remove('lang-en', 'lang-te', 'lang-hi');
      document.documentElement.classList.add(`lang-${targetLang}`);
    }
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('dhruva_lang') as Language;
    if (savedLang && ['en', 'te', 'hi'].includes(savedLang)) {
      setLang(savedLang);
      syncHtmlLang(savedLang);
    } else {
      syncHtmlLang('en');
    }
    setIsInitialized(true);
  }, []);

  // Save language to localStorage when it changes
  const updateLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('dhruva_lang', newLang);
    syncHtmlLang(newLang);
  };

  const t = (en: string, te?: string, hi?: string): string => {
    if (!isInitialized) return en; // Default to English during hydration
    if (lang === 'te') return te || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: updateLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
