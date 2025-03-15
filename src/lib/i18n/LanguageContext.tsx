'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { en } from './en';
import { lt } from './lt';
import { ru } from './ru';
import type { Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isInitialized: boolean;
  isLoaded: boolean;
}

const translationMap: Record<string, TranslationKeys> = {
  en,
  lt,
  ru
};

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Helper function to get nested translation values using dot notation
 */
function getNestedTranslation(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }
  
  return typeof current === 'string' ? current : undefined;
}

// Add a new loading placeholder function
function getLoadingPlaceholder(key: string): string {
  // For navigation items, return empty string to avoid flickering
  if (key.startsWith('navigation.')) {
    return '';
  }
  
  // Return a generic loading message for other keys
  return '';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language from cookie after mount
  useEffect(() => {
    setIsHydrated(true);
    const cookieLang = Cookies.get('NEXT_LOCALE') || 'en';
    if (cookieLang === 'en' || cookieLang === 'lt' || cookieLang === 'ru') {
      setLanguageState(cookieLang as Language);
    }
    
    setIsInitialized(true);
    setIsLoaded(true);
    
    // Update html lang attribute
    document.documentElement.lang = cookieLang as Language;
  }, []);

  // Set language handler
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    
    // Update cookie
    Cookies.set('NEXT_LOCALE', newLang, { path: '/' });
    
    // Update html lang attribute
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // If translations aren't loaded yet, return a placeholder or English default
    if (!isLoaded) {
      // Try to get from our fallback translations
      const englishFallback = getNestedTranslation(translationMap.en, key);
      if (englishFallback) {
        if (params) {
          let finalTranslation = englishFallback;
          Object.entries(params).forEach(([paramKey, value]) => {
            finalTranslation = finalTranslation.replace(`{{${paramKey}}}`, String(value));
          });
          return finalTranslation;
        }
        return englishFallback;
      }
      // Return loading placeholder to avoid showing keys during loading
      return getLoadingPlaceholder(key);
    }
    
    // First check if key exists directly in our translation maps
    const directTranslation = translationMap[language]?.[key as keyof TranslationKeys];
    
    if (typeof directTranslation === 'string') {
      if (params) {
        let finalTranslation = directTranslation;
        Object.entries(params).forEach(([paramKey, value]) => {
          finalTranslation = finalTranslation.replace(`{{${paramKey}}}`, String(value));
        });
        return finalTranslation;
      }
      return directTranslation;
    }
    
    // Try to get nested translation
    const nestedTranslation = getNestedTranslation(translationMap[language], key);
    if (nestedTranslation) {
      if (params) {
        let finalTranslation = nestedTranslation;
        Object.entries(params).forEach(([paramKey, value]) => {
          finalTranslation = finalTranslation.replace(`{{${paramKey}}}`, String(value));
        });
        return finalTranslation;
      }
      return nestedTranslation;
    }
    
    // Fallback to English
    const englishTranslation = translationMap.en?.[key as keyof TranslationKeys] || 
                               getNestedTranslation(translationMap.en, key);
    
    if (typeof englishTranslation === 'string') {
      if (params) {
        let finalTranslation = englishTranslation;
        Object.entries(params).forEach(([paramKey, value]) => {
          finalTranslation = finalTranslation.replace(`{{${paramKey}}}`, String(value));
        });
        return finalTranslation;
      }
      return englishTranslation;
    }
    
    // Get a sensible default based on the key
    if (key.startsWith('navigation.')) {
      return key.split('.').pop() || key;
    }
    
    return String(key);
  }, [language, isLoaded]);

  // Show minimal content while initializing
  if (!isInitialized) {
    return null;
  }

  // Return the provider with the language context
  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage: language,
        setLanguage,
        changeLanguage: setLanguage,
        t,
        isInitialized: isInitialized && isHydrated,
        isLoaded
      }}
    >
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