'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import SpecificationFilter from './SpecificationFilter';
import { Product } from '@/types';
import { extractUniqueSpecifications, filterProductsBySpecifications } from '@/lib/filters/SpecificationFilter';

interface SpecificationsFilterPanelProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

export default function SpecificationsFilterPanel({
  products,
  onFilter,
}: SpecificationsFilterPanelProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueSpecs, setUniqueSpecs] = useState<Record<string, string[]>>({});
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});

  // Extract unique specifications when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const specs = extractUniqueSpecifications(products);
      setUniqueSpecs(specs);
    }
  }, [products]);

  // Apply filters when selected specifications change
  useEffect(() => {
    if (Object.keys(selectedSpecs).length === 0) {
      // No filters applied, return all products
      onFilter(products);
      return;
    }

    // Filter products based on selected specifications
    const filteredProducts = filterProductsBySpecifications(products, selectedSpecs);
    onFilter(filteredProducts);
  }, [selectedSpecs, products, onFilter]);

  // Handle specification change
  const handleSpecChange = (specName: string, values: string[]) => {
    setSelectedSpecs(prev => {
      const newSpecs = { ...prev };
      
      if (values.length === 0) {
        // Remove spec if no values are selected
        delete newSpecs[specName];
      } else {
        // Update selected values
        newSpecs[specName] = values;
      }
      
      return newSpecs;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedSpecs({});
  };

  // Count total selected filters
  const totalSelectedFilters = Object.values(selectedSpecs).reduce(
    (count, values) => count + values.length, 
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-lg font-medium text-gray-900 dark:text-gray-100"
        >
          <Filter className="mr-2 h-5 w-5" />
          {t('filter')}
          {totalSelectedFilters > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
              {totalSelectedFilters}
            </span>
          )}
        </button>
        
        {totalSelectedFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t('filterSection.clearAll')}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4">
          {Object.keys(uniqueSpecs).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">{t('filterSection.noSpecifications')}</p>
          ) : (
            Object.entries(uniqueSpecs).map(([specName, values]) => (
              <SpecificationFilter
                key={specName}
                specName={specName}
                specValues={values}
                selectedValues={selectedSpecs[specName] || []}
                onChange={(values) => handleSpecChange(specName, values)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
} 