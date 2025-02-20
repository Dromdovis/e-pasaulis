// src/app/product/[id]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { pb } from '@/lib/db';
import ProductDetails from './ProductDetails';
import type { Product } from '@/types';

interface Props {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const product = await pb.collection('products').getOne<Product>(props.params.id);
    return {
      title: `${product.name} | E-Pasaulis`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product | E-Pasaulis',
      description: 'Product details',
    };
  }
}

export default async function ProductPage(props: Props) {
  // Fetch the product data here to make the component truly async
  await pb.collection('products').getOne(props.params.id);
  
  return (
    <div>
      <ProductDetails productId={props.params.id} />
    </div>
  );
}