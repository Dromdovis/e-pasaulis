'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { pb } from '@/lib/db';
import { Product } from '@/types';
import BulkProductEdit from '@/components/admin/BulkProductEdit';

export default function BulkOperationsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products when needed
  const fetchProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList<Product>({
        requestKey: null
      });
      setProducts(records);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  const handleUpdateEmailVisibility = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await AuthService.updateAllUsersEmailVisibility();
      setSuccess('Successfully updated email visibility for all users');
    } catch (err) {
      console.error('Error updating email visibility:', err);
      setError('Failed to update email visibility');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductPrices = async (percentage: number) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const products = await pb.collection('products').getFullList<Product>();
      const updates = products.map(product => 
        pb.collection('products').update(product.id, {
          price: product.price * (1 + percentage / 100)
        }, {
          requestKey: null
        })
      );

      await Promise.all(updates);
      setSuccess(`Successfully updated prices for ${products.length} products`);
    } catch (err) {
      console.error('Error updating product prices:', err);
      setError('Failed to update product prices');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductStock = async (amount: number) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const products = await pb.collection('products').getFullList<Product>();
      const updates = products.map(product => 
        pb.collection('products').update(product.id, {
          stock: Math.max(0, (product.stock || 0) + amount)
        }, {
          requestKey: null
        })
      );

      await Promise.all(updates);
      setSuccess(`Successfully updated stock for ${products.length} products`);
    } catch (err) {
      console.error('Error updating product stock:', err);
      setError('Failed to update product stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('bulk_operations')}</h1>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Email Visibility Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('email')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('admin.users_description')}
            </p>
            <button
              onClick={handleUpdateEmailVisibility}
              disabled={loading}
              className={`w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('loading') : t('save')}
            </button>
          </div>
        </div>

        {/* Product Price Update Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('products')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('admin.products_description')}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateProductPrices(-10)}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                -10%
              </button>
              <button
                onClick={() => handleUpdateProductPrices(10)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        {/* Stock Update Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('products')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('admin.products_description')}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateProductStock(-1)}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                -1
              </button>
              <button
                onClick={() => handleUpdateProductStock(1)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                +1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Type Bulk Edit */}
      <BulkProductEdit 
        products={products} 
        onUpdate={fetchProducts} 
      />
    </div>
  );
} 