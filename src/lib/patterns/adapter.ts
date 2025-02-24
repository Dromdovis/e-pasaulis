/**
 * Data Transformation Adapter Pattern Implementation
 * 
 * This module implements the Adapter pattern to transform data between different formats.
 * It's particularly useful for handling data from external sources and converting it
 * to our internal data models.
 */

import { Product, Category } from '@/types';

// External API interfaces (example of what we might receive from external sources)
export interface ExternalProduct {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  quantity_available: number;
  category_id: string;
  main_image: string;
  additional_images: string[];
  specs: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
  product_type: 'physical' | 'digital';
}

export interface ExternalCategory {
  id: string;
  title_lt: string;
  title_en: string;
  description_lt: string;
  description_en: string;
  url_segment: string;
  created_at: string;
  updated_at: string;
}

// Target interfaces (our internal models)
export interface IProductAdapter {
  adaptToInternalProduct(externalProduct: ExternalProduct): Product;
  adaptToExternalProduct(internalProduct: Product): ExternalProduct;
}

export interface ICategoryAdapter {
  adaptToInternalCategory(externalCategory: ExternalCategory): Category;
  adaptToExternalCategory(internalCategory: Category): ExternalCategory;
}

// Product adapter implementation
export class ProductAdapter implements IProductAdapter {
  adaptToInternalProduct(externalProduct: ExternalProduct): Product {
    return {
      id: externalProduct.id,
      name: externalProduct.title,
      description: externalProduct.description,
      price: externalProduct.price_cents / 100, // Convert cents to main currency unit
      stock: externalProduct.quantity_available,
      categoryId: externalProduct.category_id,
      image: externalProduct.main_image,
      images: externalProduct.additional_images,
      specifications: externalProduct.specs,
      created: externalProduct.created_at,
      updated: externalProduct.updated_at,
      category: '', // This will be populated separately
      collectionId: '', // This will be populated separately
      collectionName: 'products',
      productType: externalProduct.product_type
    };
  }

  adaptToExternalProduct(internalProduct: Product): ExternalProduct {
    return {
      id: internalProduct.id,
      title: internalProduct.name,
      description: internalProduct.description,
      price_cents: internalProduct.price * 100, // Convert to cents
      quantity_available: internalProduct.stock,
      category_id: internalProduct.categoryId,
      main_image: internalProduct.image || '',
      additional_images: internalProduct.images || [],
      specs: internalProduct.specifications || {},
      created_at: internalProduct.created,
      updated_at: internalProduct.updated,
      product_type: internalProduct.productType
    };
  }
}

// Category adapter implementation
export class CategoryAdapter implements ICategoryAdapter {
  adaptToInternalCategory(externalCategory: ExternalCategory): Category {
    return {
      id: externalCategory.id,
      name_lt: externalCategory.title_lt,
      name_en: externalCategory.title_en,
      description_lt: externalCategory.description_lt,
      description_en: externalCategory.description_en,
      slug: externalCategory.url_segment,
      created: externalCategory.created_at,
      updated: externalCategory.updated_at
    };
  }

  adaptToExternalCategory(internalCategory: Category): ExternalCategory {
    return {
      id: internalCategory.id,
      title_lt: internalCategory.name_lt,
      title_en: internalCategory.name_en,
      description_lt: internalCategory.description_lt,
      description_en: internalCategory.description_en,
      url_segment: internalCategory.slug,
      created_at: internalCategory.created,
      updated_at: internalCategory.updated
    };
  }
}

// Example usage:
/*
const productAdapter = new ProductAdapter();
const categoryAdapter = new CategoryAdapter();

// Converting external data to internal format
const internalProduct = productAdapter.adaptToInternalProduct(externalProductData);
const internalCategory = categoryAdapter.adaptToInternalCategory(externalCategoryData);

// Converting internal data to external format
const externalProduct = productAdapter.adaptToExternalProduct(internalProduct);
const externalCategory = categoryAdapter.adaptToExternalCategory(internalCategory);
*/ 