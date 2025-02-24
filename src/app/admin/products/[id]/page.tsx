import { Metadata } from 'next';
import EditProductForm from './EditProductForm';

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit product details in the admin panel',
};

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page(props: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <EditProductForm productId={props.params.id} />
    </div>
  );
}