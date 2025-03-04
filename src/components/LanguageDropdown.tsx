'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';

interface LanguageOption {
  code: string;
  label: string;
}

export function LanguageDropdown() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LanguageOption[] = [
    { code: 'en', label: t('language.en') },
    { code: 'lt', label: t('language.lt') },
  ];

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    router.push(router.asPath, router.asPath, { locale: langCode });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('language.select')}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                i18n.language === lang.code
                  ? 'text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 