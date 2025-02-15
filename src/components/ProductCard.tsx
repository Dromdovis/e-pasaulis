// src/components/ProductCard.tsx
"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import PriceDisplay from "@/components/PriceDisplay";
import Link from "next/link";

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

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-[420px]">
      <div className="bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-lg overflow-hidden relative h-full flex flex-col">
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
            className={`p-2 rounded-full bg-white dark:bg-secondary-700 shadow-md transition-colors ${
              product.stock > 0
                ? "hover:bg-secondary-100 dark:hover:bg-secondary-600"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-48 bg-secondary-100 dark:bg-secondary-700 flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
            Product Image
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold truncate text-secondary-900 dark:text-secondary-100">
            {product.name}
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 mt-2 line-clamp-3">
            {product.description}
          </p>
          <div className="mt-auto pt-4 flex justify-between items-center">
            <PriceDisplay
              price={product.price}
              className="text-2xl text-primary-600 dark:text-primary-400"
            />
            <span
              className={`${
                product.stock > 0
                  ? "text-success dark:text-success/90"
                  : "text-error dark:text-error/90"
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