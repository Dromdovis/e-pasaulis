import { ProductFactory } from '../lib/patterns/factory';
import { StockSubject, StockNotifier } from '../lib/patterns/observer';
import { Product } from '../types';
import { pb } from '../lib/db';

export class ProductService {
  private stockSubject: StockSubject;
  private stockNotifier: StockNotifier;

  constructor() {
    this.stockSubject = new StockSubject();
    this.stockNotifier = new StockNotifier();
    this.stockSubject.attach(this.stockNotifier);
  }

  async createProduct(type: string, productData: any): Promise<Product> {
    // Create product using factory pattern
    const product = ProductFactory.createProduct(type, {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      specifications: productData.specifications,
      stock: productData.stock || 0,
      category: productData.category
    });
    
    if (!product.validateSpecs()) {
      throw new Error(`Invalid specifications for ${type}`);
    }

    // Save to PocketBase
    const savedProduct = await pb.collection('products').create<Product>({
      name: product.name,
      price: product.price,
      specifications: product.specifications,
      type: product.getType(),
      stock: product.stock,
      category: product.category
    });

    // Initialize stock monitoring
    this.stockSubject.updateStock(savedProduct.id, product.stock);

    return savedProduct;
  }

  async updateStock(productId: string, newStock: number): Promise<void> {
    await pb.collection('products').update(productId, {
      stock: newStock
    });
    
    this.stockSubject.updateStock(productId, newStock);
  }
} 