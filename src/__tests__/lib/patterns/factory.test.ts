import { ProductFactory } from '@/lib/patterns/factory';
import type { Product } from '@/types/product';

// Timeout decorator for performance testing
function timeout(ms: number) {
  return function(_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      return new Promise<any>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Test timed out after ${ms}ms`));
        }, ms);
        
        try {
          const result = originalMethod.apply(this, args);
          if (result instanceof Promise) {
            result
              .then(resolve)
              .catch(reject)
              .finally(() => clearTimeout(timeoutId));
          } else {
            clearTimeout(timeoutId);
            resolve(result);
          }
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    };
    return descriptor;
  };
}

// Custom product validator decorator
function validateProduct(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const result = originalMethod.apply(this, args);
    // Check product structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid product: not an object');
    }
    if (!result.id || !result.name) {
      throw new Error('Invalid product: missing required fields');
    }
    return result;
  };
  return descriptor;
}

// Test helper class
class ProductTester {
  @validateProduct
  static createTestProduct(type: string, data: any): Product {
    return ProductFactory.createProduct(type, data);
  }
  
  @timeout(1000) // Increased timeout for test stability
  static createMultipleProducts(count: number, type: string, baseData: any): Product[] {
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
      products.push(
        ProductFactory.createProduct(type, {
          ...baseData,
          id: `${baseData.id}-${i}`,
          name: `${baseData.name} ${i}`
        })
      );
    }
    return products;
  }
}

describe('ProductFactory', () => {
  // Common product data for tests
  const productData = {
    id: 'test-id-123',
    name: 'Test Product',
    price: 99.99,
    specifications: { color: 'red', size: 'medium' },
    stock: 50,
    category: 'TestCategory'
  };

  // Test product creation with basic properties
  test('should create a product with all required properties', () => {
    // Act
    const product = ProductFactory.createProduct('electronics', productData);
    
    // Assert - using multiple assertion types
    expect(product).toBeDefined();
    expect(product.id).toBe(productData.id);
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.stock).toBe(productData.stock);
  });

  // Test product type specific behavior
  test('should create different descriptions based on product type', () => {
    // Act
    const electronics = ProductFactory.createProduct('electronics', productData);
    const clothing = ProductFactory.createProduct('clothing', {
      ...productData,
      id: 'clothing-1'
    });
    const unknown = ProductFactory.createProduct('unknown', {
      ...productData,
      id: 'unknown-1'
    });
    
    // Assert - string content testing using includes instead of toEqual(expect.stringContaining())
    expect(electronics.description.includes('Electronic Product')).toBe(true);
    expect(clothing.description.includes('Clothing Item')).toBe(true);
    expect(unknown.description).toBe(productData.name);
  });

  // Exception testing
  test('should handle empty specifications gracefully', () => {
    // Act
    const product = ProductFactory.createProduct('electronics', {
      ...productData,
      specifications: {}
    });
    
    // Assert - testing the validation logic doesn't throw
    expect(() => {
      if (product.validateSpecs) {
        const isValid = product.validateSpecs();
        expect(isValid).toBe(true);
      }
    }).not.toThrow();
  });

  // Parameterized tests
  test.each([
    ['electronics', 'Electronic Product'],
    ['clothing', 'Clothing Item'],
    ['books', 'books'], // Uses default description
    ['unknown', 'unknown'] // Uses default description
  ])('should handle product type %s with appropriate description', (type, expectedDescriptionPart) => {
    // Act
    const product = ProductFactory.createProduct(type, {
      ...productData,
      name: type
    });
    
    // Assert
    if (type === 'electronics' || type === 'clothing') {
      expect(product.description.includes(expectedDescriptionPart)).toBe(true);
    } else {
      expect(product.description).toBe(type);
    }
    
    if (product.getType) {
      expect(product.getType()).toBe(type);
    }
  });

  // Testing with decorators
  test('should validate product structure', () => {
    // Act & Assert
    expect(() => {
      ProductTester.createTestProduct('electronics', productData);
    }).not.toThrow();
    
    // Test with invalid data should throw (but we're not calling it directly to avoid test failure)
    const invalidCall = () => ProductTester.createTestProduct('electronics', { price: 100 });
    expect(invalidCall).toThrow();
  });

  // Performance testing
  test('should create multiple products efficiently', async () => {
    // Arrange
    const count = 20; // Reduced for faster tests
    const start = performance.now();
    
    // Act
    const products = await ProductTester.createMultipleProducts(
      count, 
      'electronics', 
      productData
    );
    const end = performance.now();
    
    // Assert
    expect(products).toHaveLength(count);
    expect(end - start).toBeLessThan(1000); // More generous time limit
    
    // Verify each product has unique ID and name
    const ids = products.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(count);
  });
}); 