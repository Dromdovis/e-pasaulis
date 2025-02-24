'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import type { Product } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

export default function Breadcrumbs() {
  const { t, isInitialized } = useLanguage();
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const [productName, setProductName] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getPageName = (path: string): string => {
    const pageNames: Record<string, TranslationKey> = {
      'profile': 'profile',
      'admin': 'admin_panel',
      'users': 'users',
      'products': 'products',
      // Add more pages as needed
    };
    
    const translationKey = pageNames[path];
    return translationKey ? t(translationKey) : path;
  };

  // Don't render until mounted and language is initialized
  if (!mounted || !isInitialized) {
    return null;
  }

  return (
    <nav className="breadcrumbs">
      <div className="container mx-auto flex items-center h-8">
        <Link href="/" className="breadcrumb-item flex items-center">
          <Home className="h-4 w-4" />
          <span className="ml-2">{t('home')}</span>
        </Link>
        
        {paths.length > 0 ? (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            {paths[0] === 'admin' ? (
              <>
                <Link 
                  href="/admin" 
                  className="text-sm text-gray-900 font-medium hover:text-primary-600"
                >
                  {t('admin_panel')}
                </Link>
                {paths[1] && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-sm text-gray-900 font-medium">
                      {getPageName(paths[1])}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-900 font-medium">
                {paths[0] === 'product' && productName 
                  ? productName 
                  : getPageName(paths[0])}
              </span>
            )}
          </>
        ) : (
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        )}
      </div>
    </nav>
  );
} 