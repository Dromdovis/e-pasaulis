'use client';

import { Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useProductCount } from '@/lib/hooks/useProductCount';

export function SearchBar() {
  const { t } = useLanguage();
  const { data: productCount = 0 } = useProductCount();

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={t('search_placeholder', { count: productCount.toLocaleString() })}
        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full 
        text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        transition-colors duration-200"
      />
    </div>
  );
} 