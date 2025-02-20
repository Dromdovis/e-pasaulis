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

interface CartProduct extends Product {
  quantity: number;
}

export default function CartPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, removeFromCart, updateQuantity, toggleFavorite } = useStore();

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

  const getImageUrl = (product: CartProduct) => {
    if (!product.image) return '/no-image.jpg';
    return `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`;
  };

  const total = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0);

  const fetchProductDetails = async (productId: string): Promise<Product> => {
    return await pb.collection('products').getOne(productId);
  };

  if (loading) {
    return <div className="p-8">Loading cart...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">{t('cart')}</h1>
          <button
            onClick={handleAddAllToFavorites}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500"
          >
            <Heart size={20} />
            <span>Išsaugoti norų sąraše</span>
          </button>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} 
                 className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
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
                <h3 className="font-medium">{product.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  {product.stock > 0 ? `${product.stock} ${t('in_stock')}` : t('out_of_stock')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityUpdate(product.id, Math.max(0, product.quantity - 1))}
                  className="p-1 rounded hover:bg-gray-200"
                  disabled={product.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{product.quantity}</span>
                <button
                  onClick={() => handleQuantityUpdate(product.id, Math.min(product.stock, product.quantity + 1))}
                  className="p-1 rounded hover:bg-gray-200"
                  disabled={product.quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <PriceDisplay 
                price={product.price * product.quantity} 
                className="w-24 text-right font-medium"
              />

              <button
                onClick={() => handleRemoveFromCart(product.id)}
                className="p-2 text-gray-400 hover:text-red-500"
                aria-label="Remove from cart"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t flex justify-between items-center">
          <div className="text-lg">
            <span className="font-medium">Užsakymo suma:</span>
            <PriceDisplay price={total} className="ml-2 text-xl font-bold" />
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={20} />
              <span>{t('continue_shopping')}</span>
            </Link>
            <button 
              className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Tęsti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}