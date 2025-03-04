'use client';

import { useQuery } from '@tanstack/react-query';
import { pb } from '@/lib/db';
import { ClientResponseError } from 'pocketbase';

export function useProductCount() {
  return useQuery({
    queryKey: ['productCount'],
    queryFn: async () => {
      try {
        // Directly fetch the products count
        const result = await pb.collection('products').getList(1, 1, {
          $autoCancel: false,
          fields: 'id', // Only fetch ID field to minimize data transfer
        });

        if (!result) {
          console.warn('No result from products query');
          return 0;
        }

        console.log('Product count result:', {
          page: result.page,
          perPage: result.perPage,
          totalItems: result.totalItems,
          totalPages: result.totalPages
        });

        return result.totalItems;
      } catch (error) {
        if (error instanceof ClientResponseError) {
          console.error('PocketBase error:', {
            status: error.status,
            message: error.message,
            url: error.url,
            data: error.data
          });
        } else {
          console.error('Error fetching product count:', error);
        }
        throw error; // Let React Query handle the error
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000), // Exponential backoff
    // Add fallback value when error occurs
    placeholderData: 0
  });
} 