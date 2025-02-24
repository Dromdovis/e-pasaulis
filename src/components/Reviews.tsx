'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { pb } from '@/lib/db';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Star, ChevronDown } from 'lucide-react';
import { useToast } from '@/lib/providers/ToastProvider';
import type { Review } from '@/types/review';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortOptions: { value: ReviewSortOption; label: string }[] = [
    { value: 'newest', label: t('reviewSortNewest') },
    { value: 'oldest', label: t('reviewSortOldest') },
    { value: 'highest', label: t('reviewSortHighest') },
    { value: 'lowest', label: t('reviewSortLowest') },
  ];

  const getSortQuery = (option: ReviewSortOption) => {
    switch (option) {
      case 'newest': return '-created';
      case 'oldest': return '+created';
      case 'highest': return '-rating';
      case 'lowest': return '+rating';
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId, sortOption, user?.id]);

  const loadReviews = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await pb.collection('reviews').getList<Review>(1, 50, {
        filter: `product_id = "${productId}"`,
        sort: getSortQuery(sortOption),
        expand: 'user_id',
        requestKey: `reviews_${productId}_${sortOption}`,
        $autoCancel: false
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
    } catch (err: any) {
      if (!err?.isAbort) {
        console.error('Error loading reviews:', err);
        setError(t('errorLoadingReviews'));
        setReviews([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      showToast(t('loginToReview'), 'warning');
      return;
    }

    try {
      const data = {
        rating,
        comment,
        user_id: user.id,
        product_id: productId
      };

      if (userReview) {
        // Update existing review
        await pb.collection('reviews').update(userReview.id, data);
        showToast(t('reviewUpdated'), 'success');
      } else {
        // Create new review
        await pb.collection('reviews').create(data);
        showToast(t('reviewSubmitted'), 'success');
      }
      
      // Wait a bit before reloading reviews to ensure the server has processed the change
      setTimeout(() => {
        loadReviews();
      }, 500);
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showToast(t('errorSubmittingReview'), 'error');
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('reviews')}</h2>
        
        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <span>{t('sortReviews')}</span>
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
            placeholder={t('writeReview')}
            required
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            {userReview ? t('updateReview') : t('submitReview')}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('noReviews')}</p>
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
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {t('updateReview')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 