// src/components/CategorySidebar.tsx
"use client";
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Category } from '@/types';
import { useCallback } from 'react';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

export default function CategorySidebar({ 
  categories, 
  selectedCategory,
  onCategorySelect 
}: CategorySidebarProps) {
  const { language } = useLanguage();
  const currentLang = language as 'en' | 'lt';

  const handleCategoryClick = useCallback((e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    onCategorySelect(categoryId);
  }, [onCategorySelect]);

  return (
    <div className="w-64 bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 p-4 rounded-lg sticky top-[4.5rem] h-[800px] overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">
        {currentLang === 'en' ? 'Categories' : 'Kategorijos'}
      </h2>
      <nav className="overflow-y-auto h-[calc(100%-3rem)]">
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li key={category.id}>
              <button 
                onClick={(e) => handleCategoryClick(e, category.id)}
                className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                  selectedCategory === category.id 
                    ? 'bg-primary-100 text-primary-900' 
                    : 'hover:bg-secondary-100'
                }`}
              >
                {currentLang === 'en' ? category.name_en : category.name_lt}
              </button>
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
