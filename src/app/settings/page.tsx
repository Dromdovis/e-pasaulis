'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { Check, Moon, Sun, Globe } from 'lucide-react';
import { useToast } from '@/lib/providers/ToastProvider';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration mismatch is avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && mounted) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user) {
    return null;
  }

  const handleLanguageChange = (newLang: string) => {
    changeLanguage(newLang as 'en' | 'lt' | 'ru');
    showToast(t('settings_language_changed'), 'success');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    showToast(t('settings_theme_changed'), 'success');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        {t('settings_title')}
      </h1>

      {/* Theme Settings */}
      <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('settings_appearance')}
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('settings_theme_description')}
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                theme === 'light' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Sun className={`h-6 w-6 mb-2 ${
                theme === 'light' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'light' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {t('settings_light')}
              </span>
              {theme === 'light' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                theme === 'dark' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Moon className={`h-6 w-6 mb-2 ${
                theme === 'dark' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'dark' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {t('settings_dark')}
              </span>
              {theme === 'dark' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => handleThemeChange('system')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                theme === 'system' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className={`h-6 w-6 mb-2 flex ${
                theme === 'system' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                <Sun className="h-5 w-5" />
                <Moon className="h-5 w-5 -ml-1" />
              </div>
              <span className={`text-sm font-medium ${
                theme === 'system' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {t('settings_system')}
              </span>
              {theme === 'system' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('settings_language')}
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('settings_language_description')}
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 relative ${
                currentLanguage === 'en' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Globe className={`h-6 w-6 mb-2 ${
                currentLanguage === 'en' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                currentLanguage === 'en' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                English
              </span>
              {currentLanguage === 'en' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => handleLanguageChange('lt')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 relative ${
                currentLanguage === 'lt' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Globe className={`h-6 w-6 mb-2 ${
                currentLanguage === 'lt' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                currentLanguage === 'lt' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                Lietuvių
              </span>
              {currentLanguage === 'lt' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => handleLanguageChange('ru')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 relative ${
                currentLanguage === 'ru' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Globe className={`h-6 w-6 mb-2 ${
                currentLanguage === 'ru' 
                  ? 'text-primary-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                currentLanguage === 'ru' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                Русский
              </span>
              {currentLanguage === 'ru' && (
                <Check className="h-4 w-4 text-primary-500 absolute top-2 right-2" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 