'use client';

import { useState, useRef, useEffect } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {options.find(opt => opt.value === selected)?.label}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 transform opacity-100 scale-100 transition-all duration-200"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selected === option.value 
                  ? 'text-primary-600 dark:text-primary-400 font-medium bg-gray-50 dark:bg-gray-700' 
                  : 'text-gray-700 dark:text-gray-200'
              }`}
              role="option"
              aria-selected={selected === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 