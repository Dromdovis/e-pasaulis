'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
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

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get current language from i18n
  const currentLang = isHydrated 
    ? (language || 'en') as Locale 
    : 'en'; // Default to 'en' during server-side rendering

  // Mark component as hydrated after first render on client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeLanguage = async (locale: Locale) => {
    if (locale === currentLang) {
      setIsOpen(false);
      return;
    }

    // Set cookie for persistence
    Cookies.set('NEXT_LOCALE', locale, { path: '/' });

    // Change i18next language
    await changeLanguage(locale);
    
    // Set html lang attribute for accessibility
    document.documentElement.lang = locale;
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">{t(`language_${currentLang}`)}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleChangeLanguage(locale)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                locale === currentLang
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