import { Metadata, ResolvingMetadata } from 'next';
import { pb } from '@/lib/db';

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const product = await pb.collection('products').getOne(params.id);
    
    return {
      title: `${product.name} | E-Pasaulis`,
      description: product.description || 'Product details',
      openGraph: {
        title: product.name,
        description: product.description || 'Product details',
        images: product.image ? [`${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`] : [],
      },
    };
  } catch {
    return {
      title: 'Product | E-Pasaulis',
      description: 'Product details',
    };
  }
} 