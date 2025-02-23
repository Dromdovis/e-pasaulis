'use client';

import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { withErrorBoundary } from './ErrorBoundary';

function ProductGrid() {
  const { t } = useLanguage();
  const { ref, inView } = useInView();
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useProducts();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const products = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-8">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? t('loading') : t('load_more')}
          </button>
        </div>
      )}
    </div>
  );
}

export default withErrorBoundary(ProductGrid); 