'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Breadcrumbs() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const [productName, setProductName] = useState<string>('');

  useEffect(() => {
    const fetchProductName = async () => {
      if (paths[0] === 'product' && paths[1]) {
        try {
          const product = await pb.collection('products').getOne<Product>(paths[1], {
            requestKey: null
          });
          setProductName(product.name);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setProductName('');
        }
      }
    };

    fetchProductName();
  }, [paths]);

  const getPageName = (path: string) => {
    // Add translations for different pages
    const pageNames: { [key: string]: string } = {
      'login': 'login',
      'register': 'register',
      'cart': 'cart',
      'profile': 'profile',
      // Add more pages as needed
    };
    return pageNames[path] ? t(pageNames[path]) : path;
  };

  return (
    <nav className="breadcrumbs">
      <div className="container mx-auto flex items-center h-8">
        <Link href="/" className="breadcrumb-item flex items-center">
          <Home className="h-4 w-4" />
          <span className="ml-2">{t('home')}</span>
        </Link>
        
        {paths.length > 0 && (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-sm text-gray-900 font-medium">
              {paths[0] === 'product' && productName 
                ? productName 
                : getPageName(paths[0])}
            </span>
          </>
        )}
      </div>
    </nav>
  );
} 