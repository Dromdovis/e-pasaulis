'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';

export default function NavigationBar() {
  const { t } = useLanguage();

  return (
    <div className="flex space-x-4">
      <Link 
        href="/" 
        className="text-lg font-bold"
      >
        E-pasaulis
      </Link>
      <div className="hidden md:flex space-x-4">
        <Link href="/products" className="hover:text-blue-500">
          {t('navigation.home')}
        </Link>
        <Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400">
          {t('navigation.about')}
        </Link>
        <Link href="/contact" className="hover:text-blue-500">
          {t('navigation.contact')}
        </Link>
      </div>
    </div>
  );
} 