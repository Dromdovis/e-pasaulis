'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { X } from 'lucide-react';
import { useRef, useEffect } from 'react';

export type SelectedFilter = {
  id: string;
  type: 'category' | 'specification' | 'price' | 'stock';
  name: string;
  value: string;
};

interface SelectedFiltersProps {
  filters: SelectedFilter[];
  onRemoveFilter: (filter: SelectedFilter) => void;
  onClearAll: () => void;
}

export default function SelectedFilters({
  filters,
  onRemoveFilter,
  onClearAll
}: SelectedFiltersProps) {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (filters.length === 0) return null;

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('active_filters')}
        </h3>
        {filters.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            {t('filter_clear_all')}
          </button>
        )}
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap"
          >
            <span className="font-medium">
              {filter.type === 'category' ? t(filter.name.toLowerCase() as any) : filter.name}:
            </span>
            <span>{filter.value}</span>
            <button
              onClick={() => onRemoveFilter(filter)}
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={`${t('remove')} ${filter.name} ${filter.value}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        /* Custom scrollbar styles */
        div::-webkit-scrollbar {
          height: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
} 