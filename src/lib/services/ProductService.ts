/**
 * Product Service
 * 
 * This service handles product operations using various design patterns:
 * - Decorator for filtering and sorting
 * - Adapter for data transformation
 * - Factory for creating product instances
 */

import { pb } from '@/lib/db';
import { Product, Category } from '@/types';
import { 
  BaseProductOperation,
  PriceFilterDecorator,
  CategoryFilterDecorator,
  SearchFilterDecorator,
  SortDecorator
} from '@/lib/patterns/decorator';
import { 
  ProductAdapter, 
  CategoryAdapter,
  type ExternalProduct,
  type ExternalCategory
} from '@/lib/patterns/adapter';

export interface ProductFilter {
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  searchTerm?: string;
  sortBy?: keyof Product;
  sortAscending?: boolean;
}

export class ProductService {
  private static productAdapter = new ProductAdapter();
  private static categoryAdapter = new CategoryAdapter();

  static async getProducts(filter?: ProductFilter): Promise<Product[]> {
    try {
      // Fetch all products
      const products = await pb.collection('products').getFullList<Product>();

      // If no filter, return all products
      if (!filter) return products;

      // Create base operation
      let operation = new BaseProductOperation();

      // Apply filters using decorators
      if (filter.minPrice !== undefined && filter.maxPrice !== undefined) {
        operation = new PriceFilterDecorator(operation, filter.minPrice, filter.maxPrice);
      }

      if (filter.categoryId) {
        operation = new CategoryFilterDecorator(operation, filter.categoryId);
      }

      if (filter.searchTerm) {
        operation = new SearchFilterDecorator(operation, filter.searchTerm);
      }

      // Apply sorting if specified
      if (filter.sortBy) {
        operation = new SortDecorator(operation, filter.sortBy, filter.sortAscending);
      }

      // Execute all operations
      return operation.execute(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      return await pb.collection('categories').getFullList<Category>();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.getProducts({ categoryId });
  }

  static async searchProducts(searchTerm: string): Promise<Product[]> {
    return this.getProducts({ searchTerm });
  }

  static async getProductsInPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.getProducts({ minPrice, maxPrice });
  }

  static async getSortedProducts(sortBy: keyof Product, ascending = true): Promise<Product[]> {
    return this.getProducts({ sortBy, sortAscending: ascending });
  }

  // Example of using the adapter pattern for external data
  static adaptExternalProduct(externalProduct: ExternalProduct): Product {
    return this.productAdapter.adaptToInternalProduct(externalProduct);
  }

  static adaptExternalCategory(externalCategory: ExternalCategory): Category {
    return this.categoryAdapter.adaptToInternalCategory(externalCategory);
  }
} 