'use client';

import { useState, useRef, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'lt', label: 'Lietuvių' },
];

export function LanguageSelector() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get current language from URL
  const currentLang = pathname?.split('/')[1] || 'en';

  const handleLanguageChange = (langCode: string) => {
    // Get the path after the locale
    const pathWithoutLocale = pathname?.split('/').slice(2).join('/') || '';
    const newPath = `/${langCode}/${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Languages className="w-5 h-5" />
        <span className="text-sm font-medium">{currentLang.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentLang === lang.code
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