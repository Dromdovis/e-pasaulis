// src/app/page.tsx
import { Suspense } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import StoreInitializer from '@/components/StoreInitializer';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import type { Category } from '@/types';
import { pb } from '@/lib/db';

async function fetchCategories(): Promise<Category[]> {
  const response = await pb.collection('categories').getList<Category>(1, 50);
  return response.items;
}

export default async function HomePage() {
  const categories = await fetchCategories();

  return (
    <div className="flex gap-8">
      <CategorySidebar categories={categories} />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}