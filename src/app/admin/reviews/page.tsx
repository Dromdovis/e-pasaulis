'use client';

import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import { Review } from '@/types';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';

export default function ReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    rating?: number;
    productId?: string;
  }>({});

  // Filter reviews based on active filters
  const filteredReviews = reviews.filter(review => {
    if (activeFilters.rating && review.rating !== activeFilters.rating) {
      return false;
    }
    if (activeFilters.productId && review.product !== activeFilters.productId) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (key: keyof typeof activeFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

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

  const fetchReviews = async () => {
    try {
      setError(null);
      const records = await pb.collection('reviews').getFullList<Review>({
        expand: 'user',
        requestKey: null
      });
      setReviews(records);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch reviews');
      } else {
        setError('Failed to fetch reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
      fetchReviews();
    }
  }, [isAuthenticated, user]);

  const handleDeleteReview = async (review: Review) => {
    try {
      // Show confirmation dialog
      if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
        return;
      }

      await pb.collection('reviews').delete(review.id, {
        requestKey: null
      });
      
      // Refresh the reviews list
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const columns = [
    {
      key: 'rating' as keyof Review,
      label: 'Rating',
      sortable: true,
      render: (value: Review[keyof Review]) => (
        <div className="flex items-center">
          {Array.from({ length: value as number }).map((_, i) => (
            <svg
              key={i}
              className="h-5 w-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 15.934l-6.18 3.246 1.18-6.872L.5 7.934l6.9-1.002L10 .684l2.6 6.248 6.9 1.002-4.5 4.374 1.18 6.872z"
              />
            </svg>
          ))}
        </div>
      ),
    },
    {
      key: 'comment' as keyof Review,
      label: 'Comment',
      sortable: true,
    },
    {
      key: 'user' as keyof Review,
      label: 'User',
      sortable: true,
      render: (value: Review[keyof Review], review: Review) => (
        <span>{review.expand?.user?.name || 'Unknown User'}</span>
      ),
    },
    {
      key: 'created' as keyof Review,
      label: 'Created',
      sortable: true,
      render: (value: Review[keyof Review]) =>
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
        <h1 className="text-2xl font-bold">Reviews</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={activeFilters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Ratings</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Stars</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.rating && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Rating: {activeFilters.rating} Stars
                <button
                  onClick={() => removeFilter('rating')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <DataTable
        data={filteredReviews}
        columns={columns}
        searchable={true}
        searchKeys={['comment']}
        onDelete={handleDeleteReview}
      />
    </div>
  );
} 