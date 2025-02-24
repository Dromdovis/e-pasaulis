'use client';

import { useQuery } from '@tanstack/react-query';
import { pb } from '@/lib/db';

export function useProductCount() {
  return useQuery({
    queryKey: ['productCount'],
    queryFn: async () => {
      try {
        const result = await pb.collection('products').getList(1, 1);
        return result.totalItems;
      } catch (error) {
        console.error('Error fetching product count:', error);
        return 0;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
} 