// src/components/ProductCard.tsx
"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import PriceDisplay from "@/components/PriceDisplay";
import Link from "next/link";
import Image from "next/image";
import { pb } from '@/lib/db';
import type { Product } from '@/types';  // Use the shared Product type

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, favorites, cart } = useStore();
  const isFavorite = favorites.includes(product.id);
  const cartQuantity = cart.find(item => item.productId === product.id)?.quantity || 0;

  const imageUrl = product.image 
    ? `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`
    : '/no-image.jpg';

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <Link href={`/product/${product.id}`} className="block w-full">
      <div className="bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-lg overflow-hidden h-full flex flex-col">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={(e) => handleAction(e, () => toggleFavorite(product.id))}
            className="p-2 rounded-full bg-white dark:bg-secondary-700 shadow-md hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite
                  ? "fill-accent-500 text-accent-500"
                  : "text-secondary-600 dark:text-secondary-300"
              }`}
            />
          </button>
          <button
            onClick={(e) => handleAction(e, () => product.stock > 0 && addToCart(product.id))}
            className={`p-2 rounded-full bg-white dark:bg-secondary-700 shadow-md transition-colors relative ${
              product.stock > 0
                ? "hover:bg-secondary-100 dark:hover:bg-secondary-600"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
            aria-label={cartQuantity > 0 ? `In cart (${cartQuantity})` : "Add to cart"}
          >
            <ShoppingCart className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartQuantity}
              </span>
            )}
          </button>
        </div>

        {/* Image Container */}
        <div className="relative w-full pt-[100%]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover absolute top-0 left-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-auto pt-4 flex justify-between items-center">
            <PriceDisplay
              price={product.price}
              className="text-xl text-primary-600 dark:text-primary-400"
            />
            <span
              className={`text-sm ${
                product.stock > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}