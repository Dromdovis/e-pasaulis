// src/app/favorites/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductRecord {
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useStore();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (favorites.length === 0) {
          setProducts([]);
          return;
        }

        const response = await pb.collection('products').getList<ProductRecord>(1, 50, {
          filter: `id in "${favorites.join('","')}"`,
        });

        // PocketBase response is now properly typed
        const mappedProducts: Product[] = response.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (loading) {
    return <div className="p-8">Loading favorites...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
        <p className="text-gray-600">You haven't added any products to your favorites yet.</p>
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