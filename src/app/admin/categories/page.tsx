'use client';

import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import { Category } from '@/types';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import DataTable from '@/components/admin/DataTable';

export default function CategoriesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name_en: '',
    name_lt: '',
    description_en: '',
    description_lt: '',
    slug: ''
  });

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
      setError(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchCategories();
    }
  }, [isAuthenticated, user]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection('categories').create({
        ...newCategory,
        slug: newCategory.name_en.toLowerCase().replace(/\s+/g, '-')
      }, {
        requestKey: null
      });
      setNewCategory({
        name_en: '',
        name_lt: '',
        description_en: '',
        description_lt: '',
        slug: ''
      });
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  };

  const handleEditCategory = async (category: Category) => {
    router.push(`/admin/categories/${category.id}`);
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      // Show confirmation dialog
      if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
        return;
      }

      await pb.collection('categories').delete(category.id, {
        requestKey: null
      });
      
      // Refresh the categories list
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    }
  };

  const columns = [
    {
      key: 'name_en' as keyof Category,
      label: 'Name (EN)',
      sortable: true,
    },
    {
      key: 'name_lt' as keyof Category,
      label: 'Name (LT)',
      sortable: true,
    },
    {
      key: 'description_en' as keyof Category,
      label: 'Description (EN)',
      sortable: true,
    },
    {
      key: 'description_lt' as keyof Category,
      label: 'Description (LT)',
      sortable: true,
    },
    {
      key: 'slug' as keyof Category,
      label: 'Slug',
      sortable: true,
    },
    {
      key: 'created' as keyof Category,
      label: 'Created',
      sortable: true,
      render: (value: Category[keyof Category]) =>
        new Date(value as string).toLocaleDateString(),
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {showAddForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                value={newCategory.name_en}
                onChange={(e) => setNewCategory({ ...newCategory, name_en: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name (Lithuanian)</label>
              <input
                type="text"
                value={newCategory.name_lt}
                onChange={(e) => setNewCategory({ ...newCategory, name_lt: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (English)</label>
              <textarea
                value={newCategory.description_en}
                onChange={(e) => setNewCategory({ ...newCategory, description_en: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (Lithuanian)</label>
              <textarea
                value={newCategory.description_lt}
                onChange={(e) => setNewCategory({ ...newCategory, description_lt: e.target.value })}
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
            Add Category
          </button>
        </form>
      )}

      <DataTable
        data={categories}
        columns={columns}
        searchable={true}
        searchKeys={['name_en', 'name_lt', 'description_en', 'description_lt', 'slug']}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
} 