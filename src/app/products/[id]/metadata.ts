import { Metadata } from 'next';
import { pb } from '@/lib/db';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
  } catch (error) {
    return {
      title: 'Product | E-Pasaulis',
      description: 'Product details',
    };
  }
} 