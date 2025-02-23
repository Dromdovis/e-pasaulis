// src/components/ProductCard.tsx
"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import PriceDisplay from "@/components/PriceDisplay";
import Link from "next/link";
import Image from "next/image";
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { memo, useCallback } from 'react';

const ProductCard = memo(({ product }: { product: Product }) => {
  const { t } = useLanguage();
  
  // Split store selectors to minimize re-renders
  const favorites = useStore(state => state.favorites);
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  
  const isFavorite = favorites.includes(product.id);
  const cartQuantity = cart.find(item => item.productId === product.id)?.quantity || 0;

  const imageUrl = product.image 
    ? `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`
    : '/no-image.jpg';

  const handleAction = useCallback((e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  }, []);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    handleAction(e, () => addToCart(product.id));
  }, [addToCart, handleAction, product.id]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    handleAction(e, () => toggleFavorite(product.id));
  }, [toggleFavorite, handleAction, product.id]);

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
        <div className="relative w-full pt-[100%]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover absolute top-0 left-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
            quality={75}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
              aria-label={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 hover:text-primary-500 transition-colors"
              aria-label={t('add_to_cart')}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

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
            <div className="text-sm text-gray-500 mt-1">
              {product.stock > 0 ? `${product.stock} ${t('in_stock')}` : t('out_of_stock')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;