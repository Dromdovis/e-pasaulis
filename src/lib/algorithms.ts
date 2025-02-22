import { Product } from '../types';

export class ProductAlgorithms {
  // Search implementation
  static searchProducts(products: Product[], searchTerm: string): Product[] {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filtering implementation
  static filterProducts(products: Product[], filters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    inStock?: boolean;
  }): Product[] {
    return products.filter(product => {
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.category && product.category !== filters.category) return false;
      if (filters.inStock !== undefined && 
          (filters.inStock ? product.stock <= 0 : product.stock > 0)) return false;
      return true;
    });
  }

  // Sorting implementation
  static sortProducts(products: Product[], sortBy: 'price' | 'name' | 'date', ascending: boolean = true): Product[] {
    return [...products].sort((a, b) => {
      let comparison: number;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        default:
          return 0;
      }

      return ascending ? comparison : -comparison;
    });
  }
} 