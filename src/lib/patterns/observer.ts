// Observer Pattern for Product Stock Updates
interface StockObserver {
  update(productId: string, newStock: number): void;
}

export class StockSubject {
  private observers: StockObserver[] = [];
  private stockLevels: Map<string, number> = new Map();

  attach(observer: StockObserver): void {
    this.observers.push(observer);
  }

  detach(observer: StockObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  updateStock(productId: string, newStock: number): void {
    this.stockLevels.set(productId, newStock);
    this.notifyObservers(productId, newStock);
  }

  private notifyObservers(productId: string, newStock: number): void {
    for (const observer of this.observers) {
      observer.update(productId, newStock);
    }
  }
}

export class StockNotifier implements StockObserver {
  update(productId: string, newStock: number): void {
    if (newStock === 0) {
      console.log(`Product ${productId} is out of stock!`);
      // Here you could trigger notifications to users
    } else if (newStock < 5) {
      console.log(`Product ${productId} is running low! Only ${newStock} left.`);
    }
  }
} 