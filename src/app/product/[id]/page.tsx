// src/app/product/[id]/page.tsx
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { pb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';
import type { Product } from '@/types';

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const product = await pb.collection('products').getOne<Product>(params.id);
    
    const previousImages = (await parent).openGraph?.images || [];
    
    const ogImages = [
      ...(product.image ? [{ url: product.image }] : []),
      ...previousImages
    ].filter(Boolean);
    
    return {
      title: `${product.name} | E-Pasaulis`,
      description: product.description || 'Product details',
      openGraph: {
        images: ogImages,
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found | E-Pasaulis',
      description: 'The requested product could not be found'
    };
  }
}

// Main page component
export default async function ProductPage({ params }: Props) {
  if (!params.id) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto p-8">
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
      </div>
    }>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetails productId={params.id} />
      </div>
    </Suspense>
  );
}