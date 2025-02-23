/**
 * Product Enhancement Service
 * 
 * This service handles product enhancements like gift wrapping and digital gift cards
 * using the Decorator pattern.
 */

import { Product } from '@/types';
import { 
  ConcreteProduct, 
  GiftWrappingDecorator, 
  DigitalGiftCardDecorator,
  IProduct 
} from '@/lib/patterns/decorator';

export interface EnhancementOptions {
  giftWrap?: boolean;
  digitalGiftCard?: boolean;
}

export class ProductEnhancementService {
  static enhanceProduct(product: Product, options: EnhancementOptions): IProduct {
    let enhancedProduct: IProduct = new ConcreteProduct(product);

    if (options.giftWrap && !enhancedProduct.isDigital()) {
      enhancedProduct = new GiftWrappingDecorator(enhancedProduct);
    }

    if (options.digitalGiftCard && enhancedProduct.isDigital()) {
      enhancedProduct = new DigitalGiftCardDecorator(enhancedProduct);
    }

    return enhancedProduct;
  }

  static calculateTotalPrice(product: Product, options: EnhancementOptions): number {
    const enhancedProduct = this.enhanceProduct(product, options);
    return enhancedProduct.getPrice();
  }

  static getEnhancedDescription(product: Product, options: EnhancementOptions): string {
    const enhancedProduct = this.enhanceProduct(product, options);
    return enhancedProduct.getDescription();
  }

  static getAvailableEnhancements(product: Product): EnhancementOptions {
    const isDigital = new ConcreteProduct(product).isDigital();
    return {
      giftWrap: !isDigital,
      digitalGiftCard: isDigital
    };
  }
} 