'use client';

import { useState } from 'react';
import { Product, ProductType } from '@/types';
import { pb } from '@/lib/db';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';

interface BulkProductEditProps {
  products: Product[];
  onUpdate: () => void;
}

export default function BulkProductEdit({ products, onUpdate }: BulkProductEditProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedType, setSelectedType] = useState<ProductType>('physical');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.size === 0) {
      setError('Please select at least one product');
      return;
    }

    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
      setError('You do not have permission to modify products');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updates = Array.from(selectedProducts).map(productId =>
        pb.collection('products').update(productId, {
          productType: selectedType
        }, {
          requestKey: null // Prevent auto-cancellation
        })
      );

      await Promise.all(updates);
      setSuccess(`Successfully updated ${selectedProducts.size} products`);
      setSelectedProducts(new Set());
      onUpdate();
    } catch (err) {
      console.error('Bulk update failed:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update products. Please try again.');
      } else {
        setError('Failed to update products. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user doesn't have admin permissions
  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Bulk Edit Products</h2>
      
      {/* Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ProductType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isLoading}
        >
          <option value="physical">Physical Product</option>
          <option value="digital">Digital Product</option>
        </select>
      </div>

      {/* Product Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Select Products</h3>
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700"
            disabled={isLoading}
          >
            {selectedProducts.size === products.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto border rounded-md">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center p-2 hover:bg-gray-50 border-b last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedProducts.has(product.id)}
                onChange={() => handleSelectProduct(product.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-sm text-gray-900">
                {product.name} ({product.productType || 'unset'})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      {/* Update Button */}
      <button
        onClick={handleBulkUpdate}
        disabled={isLoading || selectedProducts.size === 0}
        className={`w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors ${
          (isLoading || selectedProducts.size === 0) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Updating...' : `Update ${selectedProducts.size} Products`}
      </button>
    </div>
  );
} 