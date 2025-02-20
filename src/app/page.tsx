// src/app/page.tsx
import { Suspense } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import StoreInitializer from '@/components/StoreInitializer';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import type { Category, Product } from '@/types';
import { pb } from '@/lib/db';

async function fetchCategories(): Promise<Category[]> {
  const response = await pb.collection('categories').getList<Category>(1, 50);
  return response.items;
}

async function fetchProducts() {
  const response = await pb.collection('products').getList<Product>(1, 50);
  return { products: response.items, total: response.totalItems };
}

export default async function Home() {
  const categories = await fetchCategories();
  const { products, total } = await fetchProducts();

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-8 relative">
        <CategorySidebar categories={categories} />
        <div className="flex-1">
          <ProductGrid initialProducts={products} totalProducts={total} />
        </div>
      </div>
    </div>
  );
}