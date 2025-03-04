import { useInfiniteQuery } from '@tanstack/react-query';
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import { ClientResponseError } from 'pocketbase';

export interface UseProductsOptions {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  inStockOnly?: boolean;
  query?: string;
}

interface ProductsResponse {
  items: Product[];
  totalItems: number;
  page: number;
  perPage: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, priceMin, priceMax, sortBy = 'newest', inStockOnly, query } = options;

  return useInfiniteQuery<ProductsResponse, ClientResponseError, ProductsResponse, [string, UseProductsOptions], number>({
    queryKey: ['products', options],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let filter = '';
        const conditions: string[] = [];

        if (categoryId) {
          conditions.push(`category = "${categoryId}"`);
        }

        if (priceMin !== undefined) {
          conditions.push(`price >= ${priceMin}`);
        }

        if (priceMax !== undefined) {
          conditions.push(`price <= ${priceMax}`);
        }

        if (inStockOnly) {
          conditions.push('stock > 0');
        }

        if (query) {
          conditions.push(`name ~ "${query}" || description ~ "${query}"`);
        }

        filter = conditions.join(' && ');

        let sort = '';
        switch (sortBy) {
          case 'price_asc':
            sort = 'price';
            break;
          case 'price_desc':
            sort = '-price';
            break;
          case 'name_asc':
            sort = 'name';
            break;
          case 'name_desc':
            sort = '-name';
            break;
          default:
            sort = '-created';
        }

        const response = await pb.collection('products').getList<Product>(pageParam, 12, {
          sort,
          filter,
          expand: 'category'
        });

        return {
          items: response.items,
          totalItems: response.totalItems,
          page: pageParam,
          perPage: 12
        };
      } catch (error) {
        if (error instanceof ClientResponseError) {
          throw error;
        }
        throw new Error('Failed to fetch products');
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.page * lastPage.perPage < lastPage.totalItems;
      return hasNextPage ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : undefined;
    }
  });
} 