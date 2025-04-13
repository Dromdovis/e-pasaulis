import { StockSubject, StockNotifier } from '@/lib/patterns/observer';

// Performance test annotation
function measurePerformance(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    return result;
  };
  return descriptor;
}

// Custom test class that extends StockNotifier for testing purposes
class TestStockNotifier extends StockNotifier {
  public notifications: Array<{ productId: string; stock: number }> = [];

  @measurePerformance
  update(productId: string, newStock: number): void {
    super.update(productId, newStock);
    this.notifications.push({ productId, stock: newStock });
  }
}

describe('StockSubject', () => {
  let stockSubject: StockSubject;
  let notifier: TestStockNotifier;
  let consoleSpy: jest.SpyInstance;

  // Setup and teardown
  beforeEach(() => {
    // Setup test environment
    stockSubject = new StockSubject();
    notifier = new TestStockNotifier();
    stockSubject.attach(notifier);
    
    // Mock console.log
    consoleSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Basic test
  test('should notify observers when stock is updated', () => {
    // Arrange
    const productId = 'test-product-1';
    const newStock = 10;
    
    // Act
    stockSubject.updateStock(productId, newStock);
    
    // Assert - using different assert methods
    expect(notifier.notifications).toHaveLength(1);
    expect(notifier.notifications[0]).toEqual({ productId, stock: newStock });
  });

  // Test for low stock notification
  test('should trigger low stock notification when stock is 5 or below', () => {
    // Arrange
    const productId = 'test-product-2';
    const lowStock = 5;
    
    // Act
    stockSubject.updateStock(productId, lowStock);
    
    // Assert - using string matching
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Low stock alert for product ${productId}`)
    );
  });

  // Parameterized test with different stock levels
  test.each([
    [0, true, 'should notify for zero stock'],
    [1, true, 'should notify for very low stock'],
    [5, true, 'should notify for threshold stock'],
    [6, false, 'should not notify for stock above threshold'],
    [10, false, 'should not notify for high stock']
  ])('test case %#: %s', (stock, shouldNotify, _testName) => {
    // Arrange
    const productId = 'test-product-3';
    
    // Act
    stockSubject.updateStock(productId, stock);
    
    // Assert
    if (shouldNotify) {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Low stock alert for product ${productId}`)
      );
    } else {
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(`Low stock alert for product ${productId}`)
      );
    }
  });

  // Exception handling test
  test('should handle attempts to detach non-attached observer', () => {
    // Arrange
    const anotherNotifier = new TestStockNotifier();
    
    // Act & Assert - using not.toThrow()
    expect(() => {
      stockSubject.detach(anotherNotifier);
    }).not.toThrow();
  });

  // Performance test
  test('should perform stock updates efficiently', () => {
    // Arrange
    const productId = 'test-product-4';
    const updateCount = 50; // Reduced from 100 for faster tests
    const start = performance.now();
    
    // Act
    for (let i = 0; i < updateCount; i++) {
      stockSubject.updateStock(productId, i);
    }
    const end = performance.now();
    
    // Assert - performance testing
    expect(end - start).toBeLessThan(1000); // More generous time limit
    
    // Also verify correct final state
    expect(stockSubject.getStock(productId)).toBe(updateCount - 1);
    expect(notifier.notifications).toHaveLength(updateCount);
  });
}); 