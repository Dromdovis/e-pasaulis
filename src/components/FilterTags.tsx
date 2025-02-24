'use client';

import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Category } from '@/types';

interface FilterTagsProps {
  selectedCategory?: Category;
  selectedPriceRange?: { min: number; max: number };
  onRemoveCategory: () => void;
  onRemovePriceRange: () => void;
}

export default function FilterTags({
  selectedCategory,
  selectedPriceRange,
  onRemoveCategory,
  onRemovePriceRange
}: FilterTagsProps) {
  const { language } = useLanguage();
  const currentLang = language as 'en' | 'lt';

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedCategory && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
          {currentLang === 'en' ? selectedCategory.name_en : selectedCategory.name_lt}
          <button
            onClick={onRemoveCategory}
            className="ml-2 text-primary-600 hover:text-primary-800"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      {selectedPriceRange && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
          ${selectedPriceRange.min} - ${selectedPriceRange.max}
          <button
            onClick={onRemovePriceRange}
            className="ml-2 text-secondary-600 hover:text-secondary-800"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
} 