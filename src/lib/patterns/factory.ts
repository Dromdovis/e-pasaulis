import { Product } from '@/types/product';

/**
 * Product Factory for creating different types of products
 */
export class ProductFactory {
  static createProduct(type: string, data: {
    id: string;
    name: string;
    price: number;
    specifications: Record<string, string | number | boolean>;
    stock: number;
    category: string;
  }): Product {
    // Create base product with common properties
    const baseProduct: Product = {
      id: data.id,
      name: data.name,
      description: '', // This will be set based on specifications
      price: data.price,
      category: data.category,
      inStock: data.stock > 0,
      images: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    // Add type-specific logic here if needed
    switch (type.toLowerCase()) {
      case 'electronics':
        baseProduct.description = `${data.name} - Electronic Product`;
        break;
      case 'clothing':
        baseProduct.description = `${data.name} - Clothing Item`;
        break;
      default:
        baseProduct.description = data.name;
    }

    return {
      ...baseProduct,
      validateSpecs: () => {
        // Add validation logic based on product type
        return true;
      },
      getType: () => type,
      stock: data.stock,
      specifications: data.specifications,
    };
  }
} 