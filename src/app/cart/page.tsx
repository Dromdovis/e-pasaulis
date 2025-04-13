// src/app/cart/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import PriceDisplay from '@/components/PriceDisplay';
import { Minus, Plus, Trash2, Heart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

interface CartProduct extends Product {
  quantity: number;
}

export default function CartPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, removeFromCart, updateQuantity, toggleFavorite } = useStore();

  // Add scroll restoration
  const { isRestoring } = useScrollRestoration('cart_page');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = cart.map(item => item.productId);
        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetchedProducts = await pb.collection('products').getList<Product>(1, 50, {
          filter: `id ~ "${productIds.join('" || id ~ "')}"`,
          requestKey: null,
        });

        const cartProducts = fetchedProducts.items.map(product => ({
          ...product,
          quantity: cart.find(item => item.productId === product.id)?.quantity || 0,
        }));

        setProducts(cartProducts);
      } catch (error: Error | unknown) {
        console.error('Failed to fetch cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart]);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleAddAllToFavorites = async () => {
    try {
      for (const product of products) {
        await toggleFavorite(product.id);
      }
    } catch (error) {
      console.error('Failed to add items to favorites:', error);
    }
  };

  function getImageUrl(product: Product): string {
    if (!product.image) {
      return '/no-image400.jpg';
    }
    return `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`;
  }

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="text-blue-600 hover:underline flex items-center mr-2">
          <ArrowLeft size={16} className="mr-1" />
          <span>{t('home')}</span>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-700 dark:text-gray-300">{t('cart')}</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t('cart')}</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">{t('cart_empty')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('cart_add_items')}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('continue_shopping')}
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} 
                   className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium dark:text-white">{product.name}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {product.stock > 0 ? `${product.stock} ${t('stockStatus_inStock')}` : t('stockStatus_outOfStock')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityUpdate(product.id, Math.max(0, product.quantity - 1))}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={product.quantity <= 1}
                  >
                    <Minus className="h-4 w-4 dark:text-white" />
                  </button>
                  <span className="w-8 text-center dark:text-white">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityUpdate(product.id, Math.min(product.stock, product.quantity + 1))}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    disabled={product.quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4 dark:text-white" />
                  </button>
                </div>

                <PriceDisplay 
                  price={product.price * product.quantity} 
                  className="w-24 text-right font-medium dark:text-white"
                />

                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
                  aria-label={t('products.actions.removeFromCart')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t dark:border-gray-600 flex justify-between items-center">
            <div className="text-lg">
              <span className="font-medium dark:text-white">{t('cart.total')}:</span>
              <PriceDisplay price={total} className="ml-2 text-xl font-bold dark:text-white" />
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft size={20} />
                <span>{t('products_actions_continue_shopping')}</span>
              </Link>
              <Link 
                href="/checkout"
                className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {t('cart_checkout')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}