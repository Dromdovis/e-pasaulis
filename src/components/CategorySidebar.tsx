// src/components/CategorySidebar.tsx
"use client";
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useEffect } from 'react';
import type { Category } from '@/types';

interface CategorySidebarProps {
  categories: Category[];
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-64 bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 p-4 rounded-lg sticky top-[4.5rem] h-[800px] overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">
        {isClient ? t('categories') : 'Categories'}
      </h2>
      <nav className="overflow-y-auto h-[calc(100%-3rem)]">
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li key={category.id}>
              <Link 
                href={`/category/${category.slug}`} 
                className="block py-1.5 px-2 hover:bg-secondary-100 rounded transition-colors"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        nav {
          scrollbar-width: thin;
          scrollbar-color: rgb(209 213 219) transparent;
        }
        nav::-webkit-scrollbar {
          width: 4px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
