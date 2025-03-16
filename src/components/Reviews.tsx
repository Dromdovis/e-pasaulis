'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { pb } from '@/lib/db';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Star, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/lib/providers/ToastProvider';
import type { Review } from '@/types/review';
import { ConfirmDialog } from './ConfirmDialog';
import { ClientResponseError } from 'pocketbase';

type ReviewSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

interface ReviewsProps {
  productId: string;
}

export function Reviews({ productId }: ReviewsProps) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [sortOption, setSortOption] = useState<ReviewSortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [isLoading, setIsLoading] = useState(true);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const sortOptions: { value: ReviewSortOption; label: string }[] = [
    { value: 'newest', label: t('review_sort_newest') },
    { value: 'oldest', label: t('review_sort_oldest') },
    { value: 'highest', label: t('review_sort_highest') },
    { value: 'lowest', label: t('review_sort_lowest') },
  ];

  const getSortQuery = useCallback((option: ReviewSortOption) => {
    switch (option) {
      case 'newest': return '-created';
      case 'oldest': return '+created';
      case 'highest': return '-rating';
      case 'lowest': return '+rating';
    }
  }, []);

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await pb.collection('reviews').getList<Review>(1, 50, {
        filter: `product_id = "${productId}"`,
        sort: getSortQuery(sortOption),
        expand: 'user_id',
        requestKey: null
      });
      
      if (response?.items) {
        setReviews(response.items);

        if (user?.id) {
          const userReview = response.items.find(review => review.user_id === user.id);
          if (userReview) {
            setUserReview(userReview);
            setComment(userReview.comment);
            setRating(userReview.rating);
          } else {
            setUserReview(null);
            setComment('');
            setRating(5);
          }
        }
      } else {
        setReviews([]);
      }
    } catch (err) {
      if (err instanceof ClientResponseError) {
        console.error('Error loading reviews:', err);
        setErrorMessage(t('error_loading_reviews'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId, sortOption, user?.id, t, getSortQuery]);

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId, sortOption, user?.id, loadReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      showToast(t('login_to_review'), 'warning');
      return;
    }

    try {
      if (editingReview) {
        await pb.collection('reviews').update(editingReview, {
          rating,
          comment,
          user_id: user.id,
          product_id: productId
        });
        showToast(t('review_updated'), 'success');
      } else {
        await pb.collection('reviews').create({
          rating,
          comment,
          user_id: user.id,
          product_id: productId
        });
        showToast(t('review_submitted'), 'success');
      }
      
      setRating(5);
      setComment('');
      setEditingReview(null);
      loadReviews();
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error('Error submitting review:', error);
        showToast(t('error_submitting_review'), 'error');
      }
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await pb.collection('reviews').delete(reviewId);
      showToast(t('review_deleted'), 'success');
      loadReviews();
      setIsConfirmOpen(false);
      setReviewToDelete(null);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error('Error deleting review:', error);
        showToast(t('error_deleting_review'), 'error');
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews</h2>
        
        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <span>Sort Reviews</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    sortOption === option.value ? 'text-primary-600 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (isEditing || !userReview) && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="h-6 w-6" fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
            rows={4}
            placeholder={t('write_review')}
            required
          />
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="mr-2 text-gray-600 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            {editingReview ? t('update_review') : t('submit_review')}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t('no_reviews')}</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                {review.user_id === user?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review.id);
                        setRating(review.rating);
                        setComment(review.comment);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-500"
                      title={t('edit')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setReviewToDelete(review.id);
                        setIsConfirmOpen(true);
                      }}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={() => {
          if (reviewToDelete) {
            handleDelete(reviewToDelete);
          }
        }}
        message={t('delete_confirm')}
      />
    </div>
  );
} 