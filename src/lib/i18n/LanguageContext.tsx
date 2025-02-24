'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { en } from './en';
import { lt } from './lt';
import { translations } from './translations';
import type { Language } from './translations';
import type { TranslationKey } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isInitialized: boolean;
}

const translations: Record<string, Translations> = {
  en,
  lt
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('lt'); // Default to Lithuanian
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from localStorage after mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'lt';
    setLanguage(storedLanguage);
    setIsInitialized(true);
  }, []);

  // Update localStorage and document lang when language changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, String(value));
      });
    }
    
    return translation;
  }, [language]);

  // Show minimal content while initializing
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 