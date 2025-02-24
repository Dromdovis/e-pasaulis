'use client';

import { useEffect, useState, useCallback } from 'react';
import { pb } from '@/lib/db';
import { Product, ProductType, Category } from '@/types';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import DataTable from '@/components/admin/DataTable';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const router = useRouter();
  const { } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
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

  const fetchProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList<Product>({
        expand: 'category',
        sort: '-created',
        requestKey: null
      });
      setProducts(records);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categories').getFullList<Category>({
        requestKey: null
      });
      setCategories(records);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated, user]);

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('categoryId', newProduct.categoryId);
      formData.append('specifications', JSON.stringify(newProduct.specifications));
      formData.append('productType', newProduct.productType);
      formData.append('url', newProduct.url);
      formData.append('image_url', newProduct.image_url);

      if (thumbnail) {
        formData.append('image', thumbnail);
      }

      additionalImages.forEach(file => {
        formData.append('images', file);
      });

      await pb.collection('products').create(formData, {
        requestKey: null
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        specifications: {},
        productType: 'physical',
        url: '',
        image_url: ''
      });
      setThumbnail(null);
      setAdditionalImages([]);
      setThumbnailPreview(null);
      setAdditionalImagePreviews([]);
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    }
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      setError('Only super admins can delete products');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await pb.collection('products').delete(product.id, {
        requestKey: null
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const columns = [
    {
      key: 'name' as keyof Product,
      label: 'Name',
      sortable: true,
    },
    {
      key: 'price' as keyof Product,
      label: 'Price',
      sortable: true,
      render: (value: Product[keyof Product]) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'stock' as keyof Product,
      label: 'Stock',
      sortable: true,
    },
    {
      key: 'productType' as keyof Product,
      label: 'Type',
      sortable: true,
    },
    {
      key: 'created' as keyof Product,
      label: 'Created',
      sortable: true,
      render: (value: Product[keyof Product]) => new Date(value as string).toLocaleDateString(),
    },
  ];

  if (loading || isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
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
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
                min="0"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Type</label>
              <select
                value={newProduct.productType}
                onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value as ProductType })}
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
                value={newProduct.url}
                onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
              <input
                type="url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specifications</label>
              <textarea
                value={JSON.stringify(newProduct.specifications, null, 2)}
                onChange={(e) => {
                  try {
                    const specs = JSON.parse(e.target.value);
                    setNewProduct({ ...newProduct, specifications: specs });
                  } catch (err) {
                    console.error('Invalid JSON:', err);
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

          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Add Product
          </button>
        </form>
      )}

      <DataTable
        data={products}
        columns={columns}
        searchable={true}
        searchKeys={['name', 'description']}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
} 