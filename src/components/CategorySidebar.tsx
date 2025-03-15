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
  useLinks?: boolean; // Add option to use links instead of buttons
}

export default function CategorySidebar({ 
  categories, 
  selectedCategory,
  onCategorySelect,
  useLinks = false
}: CategorySidebarProps) {
  const { language } = useLanguage();
  const currentLang = language as 'en' | 'lt' | 'ru';

  const handleCategoryClick = useCallback((e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    onCategorySelect(categoryId);
  }, [onCategorySelect]);

  // Get translated category name based on current language
  const getCategoryName = (category: Category) => {
    if (currentLang === 'ru' && category.name_ru) return category.name_ru;
    if (currentLang === 'lt' && category.name_lt) return category.name_lt;
    return category.name_en; // Fallback to English
  };

  // Get translated heading
  const getCategoryHeading = () => {
    if (currentLang === 'ru') return 'Категории';
    if (currentLang === 'lt') return 'Kategorijos';
    return 'Categories';
  };

  return (
    <div className="w-64 bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 p-4 rounded-lg sticky top-[4.5rem] h-[800px] overflow-hidden dark:bg-gray-800 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">
        {getCategoryHeading()}
      </h2>
      <nav className="overflow-y-auto h-[calc(100%-3rem)]">
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li key={category.id}>
              {useLinks ? (
                <Link 
                  href={`/category/${category.slug}`}
                  className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-primary-100' 
                      : 'hover:bg-secondary-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {getCategoryName(category)}
                </Link>
              ) : (
                <button 
                  onClick={(e) => handleCategoryClick(e, category.id)}
                  className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-primary-100' 
                      : 'hover:bg-secondary-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              )}
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
