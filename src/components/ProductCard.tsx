// src/components/ProductCard.tsx
"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import PriceDisplay from "@/components/PriceDisplay";
import Link from "next/link";
import Image from "next/image";
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import type { Product as StoreProduct } from '@/types/product';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { memo, useCallback } from 'react';

const ProductCard = memo(({ product, isPriority = false }: { product: Product; isPriority?: boolean }) => {
  const { t } = useLanguage();
  const store = useStore();
  
  // Use primitive values directly to avoid reference issues
  const isOutOfStock = product.stock <= 0;
  
  // Check if this product is in favorites
  const isFavorite = store.favorites.includes(product.id);
  
  // Check cart quantity
  const cartItem = store.cart.find(item => item.productId === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const imageUrl = product.image 
    ? `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`
    : '/no-image400.jpg';

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    if (isOutOfStock) return;
    e.preventDefault();
    
    try {
      store.addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [store, product.id, isOutOfStock]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    store.toggleFavorite(product.id);
  }, [store, product.id]);

  // Format the stock information in a human-readable way
  const formatStockInfo = () => {
    if (isOutOfStock) {
      return t('stock_status_out_of_stock');
    }
    
    // If stock is 1, show singular form
    if (product.stock === 1) {
      return t('stock_status_last_item');
    }
    
    // If stock is low (less than 5), show special message
    if (product.stock < 5) {
      return t('stock_status_low_stock', { count: product.stock });
    }
    
    // Otherwise show normal message
    return t('stock_status_in_stock', { count: product.stock });
  };

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className={`h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${isOutOfStock ? 'opacity-75 grayscale-[30%]' : ''}`}>
        <div className="relative w-full pt-[75%]">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover absolute top-0 left-0 ${isOutOfStock ? 'opacity-90' : ''}`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            priority={isPriority}
            loading={isPriority ? undefined : 'lazy'}
            quality={80}
          />
          <div className="absolute top-0 right-0 p-2 flex flex-col space-y-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
              aria-label={isFavorite ? t('products_actions_remove_from_favorites') : t('products_actions_add_to_favorites')}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors ${
                isOutOfStock 
                  ? 'text-gray-400 cursor-not-allowed opacity-60' 
                  : 'text-gray-500 hover:text-primary-500'
              }`}
              aria-label={t('products_actions_add_to_cart')}
              disabled={isOutOfStock}
              title={isOutOfStock ? t('stock_status_out_of_stock') : t('products_actions_add_to_cart')}
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
            <div className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {formatStockInfo()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;