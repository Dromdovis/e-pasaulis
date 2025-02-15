// src/components/ProductCard.tsx
'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, favorites } = useStore();
  const isFavorite = favorites.includes(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button 
          onClick={() => toggleFavorite(product.id)}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        <button 
          onClick={() => product.stock > 0 && addToCart(product.id)}
          className={`p-2 rounded-full bg-white shadow-md transition-colors ${
            product.stock > 0 ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={product.stock === 0}
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="relative w-full h-48 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Product Image
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold truncate">{product.name}</h2>
        <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}