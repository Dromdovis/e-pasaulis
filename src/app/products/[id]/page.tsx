'use client';

import { Suspense } from 'react';
import ProductDetails from '../../product/[id]/ProductDetails';
import { Reviews } from '@/components/Reviews';
import { SimilarProducts } from '@/components/SimilarProducts';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductsPage({ params }: ProductPageProps) {
  // Add scroll restoration
  const { isRestoring } = useScrollRestoration(`products_page_${params.id}`);

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      {isRestoring ? (
        <div className="p-8">Restoring view...</div>
      ) : (
        <>
          <ProductDetails productId={params.id} />
          <SimilarProducts currentProductId={params.id} categoryId={''} />
          <Reviews productId={params.id} />
        </>
      )}
    </Suspense>
  );
} 