'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function FavoritesButton() {
  const { t } = useLanguage();
  const favorites = useStore((state) => state.favorites);

  return (
    <Link 
      href="/favorites" 
      className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      aria-label={t('favorites')}
    >
      <Heart className="w-6 h-6" />
      {favorites.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {favorites.length}
        </span>
      )}
    </Link>
  );
} 