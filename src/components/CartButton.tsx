'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function CartButton() {
  const { t } = useLanguage();
  const cart = useStore((state) => state.cart);

  return (
    <Link 
      href="/cart" 
      className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      aria-label={t('cart')}
    >
      <ShoppingCart className="w-6 h-6" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {cart.length}
        </span>
      )}
    </Link>
  );
} 