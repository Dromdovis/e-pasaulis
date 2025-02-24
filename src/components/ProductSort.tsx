'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

interface ProductSortProps {
  onSort: (option: SortOption) => void;
}

export function ProductSort({ onSort }: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SortOption>('newest');
  const { t } = useLanguage();

  const options: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('sort_newest') },
    { value: 'price_asc', label: t('sort_price_low_high') },
    { value: 'price_desc', label: t('sort_price_high_low') },
    { value: 'name_asc', label: t('sort_name_a_z') },
    { value: 'name_desc', label: t('sort_name_z_a') },
  ];

  const handleSelect = (option: SortOption) => {
    setSelected(option);
    onSort(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        <span className="text-sm font-medium text-gray-700">
          {options.find(opt => opt.value === selected)?.label}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                selected === option.value ? 'text-primary-600 font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 