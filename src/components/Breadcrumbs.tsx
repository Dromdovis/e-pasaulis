'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import type { Product } from '@/types';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const [productName, setProductName] = useState<string>('');

  useEffect(() => {
    const fetchProductName = async () => {
      if (paths[0] === 'product' && paths[1]) {
        try {
          const product = await pb.collection('products').getOne<Product>(paths[1]);
          setProductName(product.name);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setProductName('');
        }
      }
    };

    fetchProductName();
  }, [paths]);

  return (
    <nav className="breadcrumbs">
      <div className="container mx-auto flex items-center h-8">
        <Link href="/" className="breadcrumb-item flex items-center">
          <Home className="h-4 w-4" />
          <span className="ml-2">Home</span>
        </Link>
        
        {/* Always show chevron after Home */}
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        
        {paths.length > 0 && paths[0] === 'product' && productName && (
          <span className="text-sm text-gray-900 font-medium">
            {productName}
          </span>
        )}
      </div>
    </nav>
  );
} 