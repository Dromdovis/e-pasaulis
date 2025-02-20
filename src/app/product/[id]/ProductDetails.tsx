'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, favorites, cart } = useStore();
  const { t } = useLanguage();
  
  const isFavorite = favorites.includes(productId);
  const cartQuantity = cart.find(item => item.productId === productId)?.quantity || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!productId) return;

        const productData = await pb.collection('products').getOne<Product>(productId, {
          $cancelKey: productId,
        });

        if (!productData || typeof productData.price !== 'number') {
          console.error('Invalid product data:', productData);
          return;
        }

        setProduct(productData);
        setSelectedImage(productData.image || '');
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          console.error('Failed to fetch product data:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      pb.cancelRequest(productId);
    };
  }, [productId]);

  const getImageUrl = (filename?: string) => {
    if (!product || !filename) return '/no-image.jpg';
    return `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${filename}`;
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const getAllImages = () => {
    if (!product) return [];
    const allImages = [product.image, ...(product.images || [])].filter(Boolean);
    return allImages;
  };

  const scrollToSpecs = (e: React.MouseEvent) => {
    e.preventDefault();
    const specsSection = document.getElementById('specifications');
    if (specsSection) {
      specsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !product) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            {/* Add rating stars here if needed */}
            <span className="text-gray-500 text-sm">(0)</span>
          </div>
          <a href="#" onClick={scrollToSpecs} className="text-blue-500 hover:text-blue-600 text-sm">
            Daugiau informacijos ↓
          </a>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={getImageUrl(selectedImage || product.image || '')}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {getAllImages().map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img || '')}
                className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all
                  ${selectedImage === img ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-bold">
                    <PriceDisplay price={product.price} />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {product.stock > 0 ? `${product.stock} ${t('in_stock')}` : t('out_of_stock')}
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg ${
                    isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'fill-red-500' : ''}
                  />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  product.stock > 0 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                      {cartQuantity}
                    </span>
                  )}
                </div>
                {product.stock > 0 ? t('add_to_cart') : t('out_of_stock')}
              </button>

              <div className="text-sm text-gray-600">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      {product && product.specifications && Object.keys(product.specifications).length > 0 && (
        <div id="specifications" className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-6">{t('specifications')}:</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y">
              {Object.entries(product.specifications || {}).map(([key, value], index) => (
                <div 
                  key={key}
                  className={`grid grid-cols-2 p-4 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <dt className="text-gray-600 font-medium">{key}</dt>
                  <dd className="text-gray-900">{String(value)}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 