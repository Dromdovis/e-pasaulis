import { Suspense } from 'react';
import ProductDetails from '../../product/[id]/ProductDetails';

export default function ProductsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProductDetails productId={params.id} />
    </Suspense>
  );
} 