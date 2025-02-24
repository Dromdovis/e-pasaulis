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
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await pb.collection('products').getList<Product>(1, 4, {
          filter: `category = "${categoryId}" && id != "${currentProductId}"`,
          sort: '-created',
          $autoCancel: false // Disable auto-cancellation for this request
        });
        setProducts(response.items);
      } catch (error) {
        if (error.isAbort) {
          // Request was cancelled, we can ignore this error
          return;
        }
        console.error('Error fetching similar products:', error);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

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