'use client';

import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { withErrorBoundary } from './ErrorBoundary';
import type { TranslationKey } from '@/lib/i18n/types';
import { ChevronDown } from 'lucide-react';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

interface ProductGridProps {
  selectedCategory?: string;
  priceRange?: { min: number; max: number };
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

export default function ProductGrid({ 
  selectedCategory, 
  priceRange, 
  inStockOnly, 
  searchQuery,
  sortBy = 'newest'
}: ProductGridProps) {
  const { t } = useLanguage();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    refetch
  } = useProducts({
    categoryId: selectedCategory,
    priceMin: priceRange?.min,
    priceMax: priceRange?.max,
    sortBy,
    inStockOnly
  });

  const { isRestoring } = useScrollRestoration(
    `product_grid_${selectedCategory ?? 'all'}_${sortBy}`
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const products = data?.pages.flatMap(page => page.items) ?? [];

  const handleRetry = () => {
    refetch();
  };

  if (isLoading || isRestoring) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {isError ? (
        <div className="text-center text-red-500 p-4">
          <p>Error loading products: {error?.message}</p>
          <button 
            onClick={handleRetry} 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('try_again')}
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <p>{t('no_products_found' as TranslationKey)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isPriority={index < 4}
            />
          ))}
          {isFetchingNextPage && (
            [...Array(4)].map((_, i) => <ProductCardSkeleton key={`loading-${i}`} />)
          )}
          <div ref={ref} />
        </div>
      )}
    </div>
  );
} 