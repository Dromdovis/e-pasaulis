'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Slider from '@/components/ui/Slider';

interface ProductFiltersProps {
  onPriceChange: (range: { min: number; max: number }) => void;
  onAvailabilityChange: (inStock: boolean) => void;
  maxPrice: number;
}

export function ProductFilters({ onPriceChange, onAvailabilityChange, maxPrice }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [inStock, setInStock] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <div className="mt-2">
              <Slider
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={(value) => {
                  setPriceRange(value);
                  onPriceChange({ min: value[0], max: value[1] });
                }}
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
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 