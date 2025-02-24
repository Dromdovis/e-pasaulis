'use client';

import { useEffect, useState, use } from 'react';
import { pb } from '@/lib/db';
import { Category } from '@/types';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type PageParams = {
  params: Promise<{ id: string }>;
};

export default function EditCategoryPage({ params }: PageParams) {
  const router = useRouter();
  const { } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_lt: '',
    description_en: '',
    description_lt: '',
    slug: ''
  });

  // Unwrap the params Promise
  const categoryId = use(params).id;

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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setError(null);
        const record = await pb.collection('categories').getOne<Category>(categoryId, {
          requestKey: null
        });
        setCategory(record);
        setFormData({
          name_en: record.name_en,
          name_lt: record.name_lt,
          description_en: record.description_en,
          description_lt: record.description_lt,
          slug: record.slug
        });
      } catch (err) {
        console.error('Error fetching category:', err);
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch category');
        } else {
          setError('Failed to fetch category');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchCategory();
    }
  }, [isAuthenticated, user, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);

      await pb.collection('categories').update(categoryId, {
        ...formData,
        slug: formData.name_en.toLowerCase().replace(/\s+/g, '-')
      }, {
        requestKey: null
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/categories');
      }, 2000);
    } catch (err) {
      console.error('Error updating category:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update category');
      } else {
        setError('Failed to update category');
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

  if (!category) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Category not found</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <button
          onClick={() => router.push('/admin/categories')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Back to Categories
        </button>
      </div>

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Category updated successfully</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (Lithuanian)</label>
            <input
              type="text"
              value={formData.name_lt}
              onChange={(e) => setFormData({ ...formData, name_lt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (English)</label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Lithuanian)</label>
            <textarea
              value={formData.description_lt}
              onChange={(e) => setFormData({ ...formData, description_lt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={3}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Update Category
        </button>
      </form>
    </div>
  );
} 