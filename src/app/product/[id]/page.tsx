/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/product/[id]/page.tsx
import { pb } from '@/lib/db';
import PriceDisplay from '@/components/PriceDisplay';
import { notFound } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

async function getProduct(id: string) {
  try {
    return await pb.collection('products').getOne<Product>(id);
  } catch (error) {
    notFound();
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[rgb(var(--card-bg))] aspect-square rounded-lg flex items-center justify-center">
          <span className="text-secondary-500">Product Image</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <PriceDisplay price={product.price} className="text-3xl" />
          <p className="text-secondary-600 dark:text-secondary-300">{product.description}</p>
          <div className="flex items-center gap-4">
            <button 
              disabled={product.stock === 0}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
            <span className={product.stock > 0 ? 'text-success' : 'text-error'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}