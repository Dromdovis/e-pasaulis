/**
 * Product Filtering and Sorting Decorator Pattern Implementation
 * 
 * This module implements the Decorator pattern to add filtering and sorting
 * capabilities to product collections. Each decorator can be chained to create
 * complex filtering and sorting combinations.
 */

import { Product } from '@/types';

// Base interface for product operations
export interface ProductOperation {
  execute(products: Product[]): Product[];
}

// Product interface with wrapping capabilities
export interface IProduct {
  getPrice(): number;
  getDescription(): string;
  isDigital(): boolean;
}

// Concrete Product implementation
export class ConcreteProduct implements IProduct {
  constructor(private product: Product) {}

  getPrice(): number {
    return this.product.price;
  }

  getDescription(): string {
    return this.product.description;
  }

  isDigital(): boolean {
    return this.product.specifications?.isDigital === true;
  }
}

// Base Product Decorator
export abstract class ProductEnhancementDecorator implements IProduct {
  constructor(protected product: IProduct) {}

  getPrice(): number {
    return this.product.getPrice();
  }

  getDescription(): string {
    return this.product.getDescription();
  }

  isDigital(): boolean {
    return this.product.isDigital();
  }
}

// Gift Wrapping Decorator
export class GiftWrappingDecorator extends ProductEnhancementDecorator {
  private readonly wrappingPrice = 5.99;

  getPrice(): number {
    if (this.isDigital()) {
      return this.product.getPrice(); // Digital products can't be gift wrapped
    }
    return this.product.getPrice() + this.wrappingPrice;
  }

  getDescription(): string {
    if (this.isDigital()) {
      return this.product.getDescription(); // Digital products can't be gift wrapped
    }
    return `${this.product.getDescription()} (Gift Wrapped)`;
  }
}

// Digital Gift Card Decorator
export class DigitalGiftCardDecorator extends ProductEnhancementDecorator {
  private readonly cardPrice = 1.99;

  getPrice(): number {
    if (!this.isDigital()) {
      return this.product.getPrice(); // Physical products don't get digital gift cards
    }
    return this.product.getPrice() + this.cardPrice;
  }

  getDescription(): string {
    if (!this.isDigital()) {
      return this.product.getDescription(); // Physical products don't get digital gift cards
    }
    return `${this.product.getDescription()} (with Digital Gift Card)`;
  }
}

// Base concrete implementation for filtering/sorting
export class BaseProductOperation implements ProductOperation {
  execute(products: Product[]): Product[] {
    return products;
  }
}

// Base decorator class for filtering/sorting
export abstract class ProductDecorator implements ProductOperation {
  protected operation: ProductOperation;

  constructor(operation: ProductOperation) {
    this.operation = operation;
  }

  execute(products: Product[]): Product[] {
    return this.operation.execute(products);
  }
}

// Price filter decorator
export class PriceFilterDecorator extends ProductDecorator {
  private minPrice: number;
  private maxPrice: number;

  constructor(operation: ProductOperation, minPrice: number, maxPrice: number) {
    super(operation);
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
  }

  execute(products: Product[]): Product[] {
    const filteredProducts = this.operation.execute(products);
    return filteredProducts.filter(
      product => product.price >= this.minPrice && product.price <= this.maxPrice
    );
  }
}

// Category filter decorator
export class CategoryFilterDecorator extends ProductDecorator {
  private categoryId: string;

  constructor(operation: ProductOperation, categoryId: string) {
    super(operation);
    this.categoryId = categoryId;
  }

  execute(products: Product[]): Product[] {
    const filteredProducts = this.operation.execute(products);
    return filteredProducts.filter(
      product => product.categoryId === this.categoryId
    );
  }
}

// Search filter decorator
export class SearchFilterDecorator extends ProductDecorator {
  private searchTerm: string;

  constructor(operation: ProductOperation, searchTerm: string) {
    super(operation);
    this.searchTerm = searchTerm.toLowerCase();
  }

  execute(products: Product[]): Product[] {
    const filteredProducts = this.operation.execute(products);
    return filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.description.toLowerCase().includes(this.searchTerm)
    );
  }
}

// Sort decorator
export class SortDecorator extends ProductDecorator {
  private sortField: keyof Product;
  private ascending: boolean;

  constructor(operation: ProductOperation, sortField: keyof Product, ascending = true) {
    super(operation);
    this.sortField = sortField;
    this.ascending = ascending;
  }

  execute(products: Product[]): Product[] {
    const sortedProducts = this.operation.execute(products);
    return [...sortedProducts].sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.ascending 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.ascending 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }
}

// Example usage:
/*
// Filtering and sorting
const baseOperation = new BaseProductOperation();
const filteredAndSorted = new SortDecorator(
  new PriceFilterDecorator(
    new CategoryFilterDecorator(
      baseOperation,
      'laptops'
    ),
    500,
    2000
  ),
  'price',
  true
);

const results = filteredAndSorted.execute(products);

// Gift wrapping
const product = new ConcreteProduct(someProduct);
const wrappedProduct = new GiftWrappingDecorator(product);
console.log(wrappedProduct.getPrice()); // Original price + wrapping fee
console.log(wrappedProduct.getDescription()); // Description with gift wrap note

// Digital gift card
const digitalProduct = new ConcreteProduct(someDigitalProduct);
const withGiftCard = new DigitalGiftCardDecorator(digitalProduct);
console.log(withGiftCard.getPrice()); // Original price + gift card fee
console.log(withGiftCard.getDescription()); // Description with gift card note
*/ 