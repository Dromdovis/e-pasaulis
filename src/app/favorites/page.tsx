// src/app/favorites/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useStore();

  useEffect(() => {
    let isSubscribed = true;

    const fetchFavorites = async () => {
      try {
        if (favorites.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const filterConditions = favorites.map(id => `id = "${id}"`).join(' || ');
        const response = await pb.collection('products').getList<Product>(1, 50, {
          filter: filterConditions,
          requestKey: null,
        });

        if (isSubscribed) {
          setProducts(response.items);
        }
      } catch (error: Error | unknown) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      isSubscribed = false;
    };
  }, [favorites]);

  if (loading) {
    return <div className="p-8">Loading favorites...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
        <p>Couldn&apos;t find any favorites</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Your Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}