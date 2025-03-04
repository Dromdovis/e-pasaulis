import { Metadata } from 'next';
import { pb } from '@/lib/db';
import { getDynamicParam } from '@/lib/utils/params';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  if (!params.id) {
    return {
      title: 'Product Not Found | E-Pasaulis',
      description: 'The requested product could not be found',
    };
  }

  try {
    const id = await getDynamicParam(params.id);
    const product = await pb.collection('products').getOne(id);
    
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
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Not Found | E-Pasaulis',
      description: 'The requested product could not be found'
    };
  }
} 