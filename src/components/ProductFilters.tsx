'use client';

import { useState, useEffect, useRef } from 'react';
import Slider from '@/components/ui/Slider';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import SpecificationsFilterPanel from './SpecificationsFilterPanel';
import { Product } from '@/types';

interface ProductFiltersProps {
  onPriceChange: (range: { min: number; max: number }) => void;
  onAvailabilityChange: (inStock: boolean) => void;
  onSpecificationsFilterChange?: (filteredProducts: Product[]) => void;
  onFiltersChange?: (filters: any[]) => void;
  products?: Product[];
  maxPrice: number;
  activeCategory?: string;
}

export function ProductFilters({ 
  onPriceChange, 
  onAvailabilityChange, 
  onSpecificationsFilterChange, 
  onFiltersChange,
  products = [],
  maxPrice, 
  activeCategory
}: ProductFiltersProps) {
  const { t } = useLanguage();
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [inStock, setInStock] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [displayRange, setDisplayRange] = useState([0, maxPrice]);

  // Use this function for price range changes to prevent infinite loops
  const handlePriceRangeChange = (value: number[]) => {
    // Update the displayed value immediately
    setDisplayRange(value);
    
    // Cancel any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer to update the actual state and call the parent
    debounceTimerRef.current = setTimeout(() => {
      setPriceRange(value);
      onPriceChange({ min: value[0], max: value[1] });
    }, 300); // Short delay to prevent loops
  };

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">{t('filter_title')}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('filter_price_range')}</label>
            <div className="mt-2">
              <Slider
                min={0}
                max={maxPrice}
                value={displayRange}
                onChange={handlePriceRangeChange}
                formatLabel={(value) => `€${value}`}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  setInStock(e.target.checked);
                  onAvailabilityChange(e.target.checked);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('filter_in_stock_only')}</span>
            </label>
          </div>
          
          {/* Specifications Filter */}
          {products.length > 0 && onSpecificationsFilterChange && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <SpecificationsFilterPanel
                products={products}
                onFilter={onSpecificationsFilterChange}
                onFiltersChange={onFiltersChange}
                activeCategory={activeCategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 