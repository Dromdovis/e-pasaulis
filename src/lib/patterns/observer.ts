import { Product } from '@/types/product';

/**
 * Observer interface for product updates
 */
export interface ProductObserver {
  update(product: Product): void;
}

/**
 * Subject interface for the observer pattern
 */
export interface ProductSubject {
  attach(observer: ProductObserver): void;
  detach(observer: ProductObserver): void;
  notify(product: Product): void;
}

/**
 * Concrete implementation of the Product Subject
 */
export class ProductManager implements ProductSubject {
  private observers: Set<ProductObserver> = new Set();

  attach(observer: ProductObserver): void {
    this.observers.add(observer);
  }

  detach(observer: ProductObserver): void {
    this.observers.delete(observer);
  }

  notify(product: Product): void {
    for (const observer of this.observers) {
      observer.update(product);
    }
  }

  // Additional product management methods can be added here
  updateProduct(product: Product): void {
    // Perform product update logic
    console.log('Product updated:', product);
    // Notify all observers
    this.notify(product);
  }
}

// Export a singleton instance
export const productManager = new ProductManager();

/**
 * Stock Observer Interface
 */
export interface StockObserver {
  update(productId: string, newStock: number): void;
}

/**
 * Stock Subject for managing stock updates
 */
export class StockSubject {
  private observers: Set<StockObserver> = new Set();
  private stockLevels: Map<string, number> = new Map();

  attach(observer: StockObserver): void {
    this.observers.add(observer);
  }

  detach(observer: StockObserver): void {
    this.observers.delete(observer);
  }

  updateStock(productId: string, newStock: number): void {
    this.stockLevels.set(productId, newStock);
    this.notifyObservers(productId, newStock);
  }

  private notifyObservers(productId: string, newStock: number): void {
    this.observers.forEach(observer => {
      observer.update(productId, newStock);
    });
  }

  getStock(productId: string): number {
    return this.stockLevels.get(productId) || 0;
  }
}

/**
 * Stock Notifier Implementation
 */
export class StockNotifier implements StockObserver {
  update(productId: string, newStock: number): void {
    if (newStock <= 5) {
      console.log(`Low stock alert for product ${productId}: ${newStock} items remaining`);
      // Here you could add more notification logic (e.g., email, push notification)
    }
  }
} 