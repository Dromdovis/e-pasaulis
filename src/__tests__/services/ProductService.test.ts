import { ProductService } from '@/services/ProductService';
import type { Product } from '@/types/product';
import { pb } from '@/lib/db';

// Mock PocketBase
jest.mock('@/lib/db', () => ({
  pb: {
    collection: jest.fn(() => ({
      create: jest.fn(data => ({ ...data, id: 'mock-product-id' })),
      update: jest.fn().mockResolvedValue(true)
    }))
  }
}));

// Mock ProductFactory
jest.mock('@/lib/patterns/factory', () => ({
  ProductFactory: {
    createProduct: jest.fn((type, data) => ({
      ...data,
      getType: () => type,
      validateSpecs: () => true
    }))
  }
}));

// Retry test annotation
function RetryTest(maxRetries: number = 3) {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.warn(`Test attempt ${attempt} failed: ${lastError.message}`);
        }
      }
      throw lastError;
    };
    return descriptor;
  };
}

// Performance test logger
function LogPerformance(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`Test completed in ${end - start}ms`);
    return result;
  };
  return descriptor;
}

// Test helper class with annotated methods
class ProductServiceTester {
  @RetryTest(2)
  @LogPerformance
  static async testCreateProduct(productService: ProductService, type: string, data: any) {
    return await productService.createProduct(type, data);
  }
  
  @RetryTest(2)
  static async testUpdateStockWithRetry(productService: ProductService, productId: string, stock: number) {
    return await productService.updateStock(productId, stock);
  }
}

describe('ProductService', () => {
  let productService: ProductService;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    productService = new ProductService();
  });
  
  // Basic test
  test('should create a product successfully', async () => {
    // Arrange
    const productData = {
      name: 'Test Product',
      price: 99.99,
      specifications: { color: 'red' },
      category: 'Electronics'
    };
    
    // Act
    const result = await productService.createProduct('electronics', productData);
    
    // Assert
    expect(result).toBeDefined();
    expect(pb.collection).toHaveBeenCalled();
    expect(result.name).toBe(productData.name);
  });
  
  // Exception testing
  test('should throw error when product validation fails', async () => {
    // Arrange - Override mock for this test
    const mockProductFactory = require('@/lib/patterns/factory').ProductFactory;
    mockProductFactory.createProduct.mockImplementationOnce((type: string, data: any) => ({
      ...data,
      getType: () => type,
      validateSpecs: () => false // This will cause validation to fail
    }));
    
    const productData = {
      name: 'Invalid Product',
      price: 0,
      specifications: {}, 
      category: 'Unknown'
    };
    
    // Act & Assert - Using exception testing
    await expect(productService.createProduct('unknown', productData))
      .rejects.toThrow('Invalid specifications');
  });
  
  // Parameterized test
  test.each([
    ['electronics', { brand: 'Sony', model: 'X1' }],
    ['clothing', { size: 'M', color: 'blue' }],
    ['books', { author: 'Author Name', pages: 350 }]
  ])('should create different types of products: %s', async (type, specs) => {
    // Arrange
    const productData = {
      name: `Test ${type}`,
      price: 49.99,
      specifications: specs,
      category: type
    };
    
    // Act
    const result = await productService.createProduct(type, productData);
    
    // Assert - using different assertion methods
    expect(result).toHaveProperty('name', productData.name);
    expect(result).toHaveProperty('price', productData.price);
    expect(result.specifications).toEqual(specs);
  });
  
  // Performance testing
  test('should handle stock updates efficiently', async () => {
    // Arrange
    const productId = 'test-product';
    const updateCount = 50;
    const start = performance.now();
    
    // Act
    for (let i = 0; i < updateCount; i++) {
      await productService.updateStock(productId, i);
    }
    const end = performance.now();
    
    // Assert
    const mockCollection = pb.collection as jest.Mock;
    expect(mockCollection).toHaveBeenCalled();
    expect(end - start).toBeLessThan(1000); // Should complete in under 1 second
  });
  
  // Exception testing with mock failures
  test('should handle DB errors when updating stock', async () => {
    // Arrange
    const productId = 'error-product';
    const mockUpdate = jest.fn().mockRejectedValue(new Error('DB connection error'));
    const mockCollection = pb.collection as jest.Mock;
    
    // Override mock for this test only
    mockCollection.mockImplementationOnce(() => ({
      update: mockUpdate
    }));
    
    // Act & Assert
    await expect(productService.updateStock(productId, 10))
      .rejects.toThrow('DB connection error');
  });
  
  // Testing with decorators
  test('should retry failed operations', async () => {
    // Arrange - Create mock with intermittent failure
    let callCount = 0;
    const mockUpdate = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Temporary error'));
      }
      return Promise.resolve(true);
    });
    
    const mockCollection = pb.collection as jest.Mock;
    mockCollection.mockImplementationOnce(() => ({
      update: mockUpdate
    }));
    
    // Act
    await ProductServiceTester.testUpdateStockWithRetry(
      productService, 'retry-test-product', 25
    );
    
    // Assert
    expect(callCount).toBe(2); // Should have retried and succeeded on second try
  });
}); 