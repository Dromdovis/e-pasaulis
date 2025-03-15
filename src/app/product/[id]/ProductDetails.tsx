'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SimilarProducts } from '@/components/SimilarProducts';
import { Reviews } from '@/components/Reviews';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleFavorite, favorites, cart } = useStore();
  const { t } = useLanguage();
  
  const isFavorite = favorites.includes(productId);
  const cartQuantity = cart.find(item => item.productId === productId)?.quantity || 0;

  const { isRestoring } = useScrollRestoration(`product_details_${productId}`);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        const product = await pb.collection('products').getOne(productId);
        if (mounted) {
          setProduct(product);
          setSelectedImage(product.image || '');
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const getImageUrl = (filename?: string, isMainImage = false) => {
    if (!product || !filename) {
      // Use different sizes based on context
      return isMainImage 
        ? '/no-image800.jpg'    // Main product image
        : '/no-image200.jpg';   // Thumbnail gallery
    }
    return `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${filename}`;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
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

  if (loading || isRestoring) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-24 w-full bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return null;
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
              src={getImageUrl(selectedImage || product.image || '', true)}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-auto rounded-lg"
              priority={true}
              quality={85}
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
                  src={getImageUrl(img, false)}
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
                    {product.stock > 0 ? `${product.stock} ${t('stockStatus.inStock')}` : t('stockStatus.outOfStock')}
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
                {product.stock > 0 ? t('products.actions.addToCart') : t('stockStatus.outOfStock')}
              </button>

              <div className="text-sm text-gray-600">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{t('productSpecifications')}</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <table className="w-full">
            <tbody>
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <tr key={key} className="border-b last:border-0">
                  <td className="py-3 text-gray-600 w-1/3">{key}</td>
                  <td className="py-3 text-gray-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Similar Products section */}
      <SimilarProducts 
        currentProductId={product?.id || ''} 
        categoryId={product?.category || ''} 
      />

      {/* Reviews section */}
      <Reviews productId={productId} />
    </div>
  );
} 