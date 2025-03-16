'use client';

import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Cookies from 'js-cookie';

// Supported languages
const locales = ['en', 'lt', 'ru'] as const;
type Locale = typeof locales[number];

// Language names in their native language
const languageNames: Record<Locale, string> = {
  en: 'English',
  lt: 'Lietuvių',
  ru: 'Русский'
};

export default function MobileLanguageSwitcher() {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark component as hydrated after first render on client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const changeLanguageHandler = async (locale: Locale) => {
    if (locale === language) {
      setIsOpen(false);
      return;
    }

    // Set cookie for persistence
    Cookies.set('NEXT_LOCALE', locale, { path: '/' });

    // Change language
    await changeLanguage(locale);
    
    // Set html lang attribute for accessibility
    document.documentElement.lang = locale;
    
    setIsOpen(false);
  };

  return (
    <div className="px-3 py-2 border-t dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Language: {t(`language_${language}`)}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 ml-7 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => changeLanguageHandler(locale)}
              className={`block w-full text-left py-2 px-3 text-sm rounded-md ${
                locale === language
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t(`language_${locale}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 