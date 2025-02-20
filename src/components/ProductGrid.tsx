'use client';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { pb } from '@/lib/db';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

interface ProductGridProps {
  initialProducts: Product[];
  totalProducts: number;
}

export default function ProductGrid({ initialProducts, totalProducts }: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < totalProducts);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await pb.collection('products').getList<Product>(nextPage, 12);
      
      setProducts(prev => [...prev, ...response.items]);
      setPage(nextPage);
      setHasMore(products.length + response.items.length < totalProducts);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={loadMore}
          disabled={loading}
          className="load-more"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
} 