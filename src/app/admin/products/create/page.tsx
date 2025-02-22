'use client';

import { useState } from 'react';
import { ProductService } from '@/services/ProductService';

type ProductType = 'processor' | 'smartphone' | 'laptop' | 'graphics-card';

interface SpecField {
  name: string;
  label: string;
  type: 'text' | 'number';
}

const PRODUCT_SPECS: Record<ProductType, SpecField[]> = {
  'processor': [
    { name: 'Branduoliai', label: 'Cores', type: 'text' },
    { name: 'Gijos', label: 'Threads', type: 'text' },
    { name: 'Bazinis dažnis', label: 'Base Clock', type: 'text' },
    { name: 'Turbo dažnis', label: 'Turbo Clock', type: 'text' },
    { name: 'Cache', label: 'Cache', type: 'text' },
    { name: 'TDP', label: 'TDP', type: 'text' },
    { name: 'Lizdas', label: 'Socket', type: 'text' },
  ],
  'smartphone': [
    { name: 'Ekranas', label: 'Display', type: 'text' },
    { name: 'Procesorius', label: 'Processor', type: 'text' },
    { name: 'Atmintis', label: 'Memory', type: 'text' },
    { name: 'Kamera', label: 'Camera', type: 'text' },
    { name: 'Baterija', label: 'Battery', type: 'text' },
    { name: 'Operacinė sistema', label: 'Operating System', type: 'text' },
  ],
  'laptop': [
    { name: 'Procesorius', label: 'Processor', type: 'text' },
    { name: 'Operatyvioji atmintis', label: 'RAM', type: 'text' },
    { name: 'Kietasis diskas', label: 'Storage', type: 'text' },
    { name: 'Ekranas', label: 'Display', type: 'text' },
    { name: 'Operacinė sistema', label: 'Operating System', type: 'text' },
  ],
  'graphics-card': [
    { name: 'Chip', label: 'GPU Chip', type: 'text' },
    { name: 'Memory', label: 'Memory Size', type: 'text' },
    { name: 'Memory Type', label: 'Memory Type', type: 'text' },
    { name: 'Core Clock', label: 'Core Clock', type: 'text' },
    { name: 'Power Consumption', label: 'Power Consumption', type: 'number' },
  ],
};

export default function CreateProductPage() {
  const [productType, setProductType] = useState<ProductType>('laptop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productService = new ProductService();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    specifications: {} as Record<string, string>
  });

  const handleSpecChange = (specName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specName]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await productService.createProduct(productType, productData);
      // Reset form or redirect
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        specifications: {}
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Product Type</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
            className="w-full p-2 border rounded"
          >
            <option value="laptop">Laptop</option>
            <option value="processor">Processor</option>
            <option value="smartphone">Smartphone</option>
            <option value="graphics-card">Graphics Card</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block mb-2">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Specifications</h3>
          <div className="space-y-4">
            {PRODUCT_SPECS[productType].map((spec) => (
              <div key={spec.name}>
                <label className="block mb-2">{spec.label}</label>
                <input
                  type={spec.type}
                  value={formData.specifications[spec.name] || ''}
                  onChange={(e) => handleSpecChange(spec.name, e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
} 