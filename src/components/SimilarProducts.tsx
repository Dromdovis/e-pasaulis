'use client';

import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SimilarProductsProps {
  currentProductId: string;
  categoryId: string;
}

export function SimilarProducts({ currentProductId, categoryId }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!categoryId || !currentProductId) return;
      
      try {
        setIsLoading(true);
        const response = await pb.collection('products').getList<Product>(1, 4, {
          filter: `category = "${categoryId}" && id != "${currentProductId}"`,
          sort: '-created',
          requestKey: `similar_${currentProductId}`,
          $autoCancel: false
        });
        
        if (response?.items) {
          setProducts(response.items);
        }
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'isAbort' in error && !(error as { isAbort: boolean }).isAbort) {
          console.error('Error fetching similar products:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId]);

  if (isLoading || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t('similar_products')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 