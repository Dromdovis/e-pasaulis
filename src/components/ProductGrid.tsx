'use client';

import React from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import type { TranslationKey } from '@/lib/i18n/types';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';
import { ClientResponseError } from 'pocketbase';

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
    inStockOnly,
    query: searchQuery
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

  const getLoadingCardCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1536) return 6; // 2xl
      if (width >= 1280) return 5; // xl
      if (width >= 1024) return 4; // lg
      if (width >= 768) return 3; // md
      if (width >= 640) return 2; // sm
      return 1;
    }
    return 4;
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
      {isError && error instanceof ClientResponseError ? (
        <div className="text-center text-red-500 p-4">
          <p>Error loading products: {error.message}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-fr">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isPriority={index < 4}
            />
          ))}
          {isFetchingNextPage && (
            <>
              {Array.from({ length: getLoadingCardCount() }).map((_, i) => (
                <ProductCardSkeleton key={`loading-${i}`} />
              ))}
            </>
          )}
          <div ref={ref} className="col-span-full h-1" />
        </div>
      )}
    </div>
  );
} 