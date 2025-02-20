// src/app/product/[id]/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { pb } from '@/lib/db';
import ProductDetails from './ProductDetails';
import type { Product } from '@/types';

interface Props {
  params: { id: string };
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  try {
    const product = await pb.collection('products').getOne<Product>(id, {
      requestKey: null
    });
    
    return {
      title: `${product.name} | E-Pasaulis`,
      description: product.description
    };
  } catch (error) {
    return {
      title: 'Product | E-Pasaulis',
      description: 'Product details'
    };
  }
}

// Main page component
export default async function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>}>
      <ProductDetails productId={params.id} />
    </Suspense>
  );
}