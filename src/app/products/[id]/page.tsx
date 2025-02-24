import { Suspense } from 'react';
import ProductDetails from '../../product/[id]/ProductDetails';
import { Reviews } from '@/components/Reviews';
import { SimilarProducts } from '@/components/SimilarProducts';

export default function ProductsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductDetails productId={params.id} />
      <SimilarProducts currentProductId={params.id} categoryId={''} />
      <Reviews productId={params.id} />
    </Suspense>
  );
} 