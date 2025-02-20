'use client';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { pb } from '@/lib/db';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ProductGridProps {
  initialProducts: Product[];
  totalProducts: number;
}

export default function ProductGrid({ initialProducts, totalProducts }: ProductGridProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await pb.collection('products').getList<Product>(nextPage, 12, {
        sort: '-created',
        expand: 'category'
      });
      
      setProducts(prev => [...prev, ...response.items as Product[]]);
      setPage(nextPage);
      setHasMore(response.totalItems > (nextPage * 12));
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!mounted ? '' : loading ? t('loading') : t('load_more')}
          </button>
        </div>
      )}
    </div>
  );
} 