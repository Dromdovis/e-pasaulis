import { Metadata } from 'next';
import EditProductForm from './EditProductForm';

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit product details in the admin panel',
};

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <EditProductForm productId={resolvedParams.id} />
    </div>
  );
}