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

const translationMap: Record<Language, TranslationKeys> = {
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

// Get a loading placeholder for keys
function getLoadingPlaceholder(key: string): string {
  return key.split('_').pop() || key;
}

/**
 * Hook to use language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Provider component for language context
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize language from cookie or browser
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check if we have a language cookie
        const cookieLanguage = Cookies.get('NEXT_LOCALE') as Language;
        
        // If we have a valid cookie language, use it
        if (cookieLanguage && ['en', 'lt', 'ru'].includes(cookieLanguage)) {
          setLanguageState(cookieLanguage);
        } else {
          // Set English as default
          setLanguageState('en');
        }
        
        setIsLoaded(true);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing language:', error);
        setLanguageState('en'); // Default to English on error
        setIsLoaded(true);
        setIsInitialized(true);
      }
    };

    initializeLanguage();
    
    // Mark as hydrated on client
    setIsHydrated(true);
  }, []);

  // Change language
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    Cookies.set('NEXT_LOCALE', newLang, { path: '/' });
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
    const keyParts = key.split('_');
    return keyParts[keyParts.length - 1] || key;
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