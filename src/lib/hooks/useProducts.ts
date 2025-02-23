import { useInfiniteQuery } from '@tanstack/react-query';
import { pb } from '@/lib/db';
import type { Product } from '@/types';

interface ProductsResponse {
  items: Product[];
  totalItems: number;
  page: number;
  perPage: number;
}

export function useProducts(perPage = 12) {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await pb.collection('products').getList<Product>(pageParam, perPage, {
        sort: '-created',
        expand: 'category',
        requestKey: null // Prevent auto-cancellation
      });
      
      return {
        items: response.items,
        totalItems: response.totalItems,
        page: pageParam,
        perPage
      } as ProductsResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      const totalPages = Math.ceil(lastPage.totalItems / lastPage.perPage);
      return nextPage <= totalPages ? nextPage : null;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : null;
    },
    // Add staleTime and refetch settings
    staleTime: 30 * 1000, // Data becomes stale after 30 seconds
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 60 * 1000 // Refetch every minute
  });
} 