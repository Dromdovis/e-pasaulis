'use client';

import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t('search_results_for')} &ldquo;{query}&rdquo;
      </h1>
      <ProductGrid searchQuery={query} />
    </div>
  );
} 