'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-9 h-9"></div>; // Placeholder with same size
  }
  
  const isDark = theme === 'dark';
  
  return (
    <button
      type="button"
      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? t('theme_switch_light') : t('theme_switch_dark')}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
} 