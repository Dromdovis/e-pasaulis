import { useInfiniteQuery } from '@tanstack/react-query';
import { pb } from '@/lib/db';
import type { Product } from '@/types';

interface ProductsResponse {
  items: Product[];
  totalItems: number;
  page: number;
  perPage: number;
}

interface UseProductsOptions {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  perPage?: number;
  inStockOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, priceMin, priceMax, sortBy = 'newest', perPage = 12, inStockOnly } = options;

  return useInfiniteQuery({
    queryKey: ['products', categoryId, priceMin, priceMax, sortBy, inStockOnly],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let filter = '';
        if (categoryId) {
          filter += `category = "${categoryId}"`;
        }
        if (priceMin !== undefined) {
          filter += filter ? ' && ' : '';
          filter += `price >= ${priceMin}`;
        }
        if (priceMax !== undefined) {
          filter += filter ? ' && ' : '';
          filter += `price <= ${priceMax}`;
        }
        if (inStockOnly) {
          filter += filter ? ' && ' : '';
          filter += 'stock > 0';
        }

        let sort = '-created';
        switch (sortBy) {
          case 'price_asc':
            sort = '+price';
            break;
          case 'price_desc':
            sort = '-price';
            break;
          case 'name_asc':
            sort = '+name';
            break;
          case 'name_desc':
            sort = '-name';
            break;
          // newest uses default -created
        }

        const response = await pb.collection('products').getList<Product>(pageParam, perPage, {
          sort,
          filter,
          expand: 'category',
          $autoCancel: false,
        });
        
        return {
          items: response.items,
          totalItems: response.totalItems,
          page: pageParam,
          perPage
        };
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextPage = lastPage.page + 1;
      const totalPages = Math.ceil(lastPage.totalItems / lastPage.perPage);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : undefined;
    },
    // Add staleTime and refetch settings
    staleTime: 30 * 1000, // Data becomes stale after 30 seconds
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: false, // Refetch when window regains focus
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 3, // Add retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
} 