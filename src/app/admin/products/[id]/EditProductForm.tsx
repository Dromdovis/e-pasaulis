'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { pb } from '@/lib/db';
import type { Product, ProductType, Category } from '@/types';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface EditProductFormProps {
  productId: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    specifications: {},
    productType: 'physical' as ProductType,
    url: '',
    image_url: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    // Check authentication and role
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
        router.push('/');
        return;
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, user, router]);

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categories').getFullList<Category>({
        requestKey: null
      });
      setCategories(records);
    } catch (err) {
      console.error('Error fetching categories:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch categories');
      } else {
        setError('Failed to fetch categories');
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError(null);
        const record = await pb.collection('products').getOne<Product>(productId, {
          requestKey: null
        });
        setProduct(record);
        setFormData({
          name: record.name,
          description: record.description,
          price: record.price.toString(),
          stock: (record.stock || 0).toString(),
          categoryId: record.categoryId,
          specifications: record.specifications || {},
          productType: record.productType || 'physical',
          url: record.url || '',
          image_url: record.image_url || ''
        });

        // Set image previews
        if (record.image) {
          setThumbnailPreview(pb.files.getUrl(record, record.image));
        }
        if (record.images?.length) {
          setAdditionalImagePreviews(
            record.images.map(image => pb.files.getUrl(record, image))
          );
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch product');
        } else {
          setError('Failed to fetch product');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchProduct();
      fetchCategories();
    }
  }, [isAuthenticated, user, productId]);

  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>, isMultiple: boolean) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (isMultiple) {
      setAdditionalImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
    } else {
      setThumbnail(files[0]);
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }
  }, []);

  const handleFilesSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean) => {
    const files = Array.from(e.target.files || []);
    
    if (isMultiple) {
      setAdditionalImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
    } else {
      setThumbnail(files[0]);
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }
  }, []);

  const removeImage = (index: number, isMultiple: boolean) => {
    if (isMultiple) {
      setAdditionalImages(prev => prev.filter((_, i) => i !== index));
      setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));
      formDataToSend.append('productType', formData.productType);
      formDataToSend.append('url', formData.url);
      formDataToSend.append('image_url', formData.image_url);

      if (thumbnail) {
        formDataToSend.append('image', thumbnail);
      }

      additionalImages.forEach(file => {
        formDataToSend.append('images', file);
      });

      await pb.collection('products').update(productId, formDataToSend, {
        requestKey: null
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update product');
      } else {
        setError('Failed to update product');
      }
    }
  };

  if (loading || isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Product not found</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Back to Products
        </button>
      </div>

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Product updated successfully</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="0"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value as ProductType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="physical">Physical Product</option>
              <option value="digital">Digital Product</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL (optional)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specifications</label>
            <textarea
              value={JSON.stringify(formData.specifications, null, 2)}
              onChange={(e) => {
                try {
                  const specs = JSON.parse(e.target.value);
                  setFormData({ ...formData, specifications: specs });
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
              placeholder="{\n  'key': 'value'\n}"
            />
          </div>

          {/* Thumbnail Upload */}
          <div
            className="col-span-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleFilesDrop(e, false)}
          >
            <input
              type="file"
              id="thumbnail"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFilesSelect(e, false)}
            />
            <label htmlFor="thumbnail" className="cursor-pointer">
              {thumbnailPreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeImage(0, false);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to upload thumbnail
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Additional Images Upload */}
          <div
            className="col-span-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleFilesDrop(e, true)}
          >
            <input
              type="file"
              id="additional-images"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelect(e, true)}
            />
            <label htmlFor="additional-images" className="cursor-pointer">
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drag and drop or click to upload additional images
                </p>
              </div>
            </label>
            {additionalImagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {additionalImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(index, true);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
} 