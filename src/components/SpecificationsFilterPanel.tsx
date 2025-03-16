'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import SpecificationFilter from './SpecificationFilter';
import { Product } from '@/types';
import { extractUniqueSpecifications, filterProductsBySpecifications } from '@/lib/filters/SpecificationFilter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectedFilter } from './SelectedFilters';

interface SpecificationsFilterPanelProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
  onFiltersChange?: (filters: SelectedFilter[]) => void;
  activeCategory?: string;
}

export default function SpecificationsFilterPanel({
  products,
  onFilter,
  onFiltersChange,
  activeCategory
}: SpecificationsFilterPanelProps) {
  const { t } = useLanguage();
  const [uniqueSpecs, setUniqueSpecs] = useState<Record<string, string[]>>({});
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});
  const [pendingFilter, setPendingFilter] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [activeFilters, setActiveFilters] = useState<SelectedFilter[]>([]);

  // Extract unique specifications when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const specs = extractUniqueSpecifications(products);
      
      // Initialize collapsedSections for all specs (default to expanded)
      const initialCollapsedState: Record<string, boolean> = {};
      Object.keys(specs).forEach(specName => {
        initialCollapsedState[specName] = false;
      });
      
      setUniqueSpecs(specs);
      setCollapsedSections(initialCollapsedState);
    }
  }, [products]);

  // Update active filters when selectedSpecs or activeCategory changes
  useEffect(() => {
    const filters: SelectedFilter[] = [];
    
    // Add category filter if present
    if (activeCategory) {
      filters.push({
        id: `category-${activeCategory}`,
        type: 'category',
        name: 'categories',
        value: activeCategory
      });
    }
    
    // Add specification filters
    Object.entries(selectedSpecs).forEach(([specName, values]) => {
      values.forEach(value => {
        const specTranslationKey = `spec_${specName.toLowerCase().replace(/ /g, '_')}`;
        const specDisplayName = t(specTranslationKey) !== specTranslationKey ? 
          t(specTranslationKey) : 
          formatSpecName(specName);
          
        filters.push({
          id: `spec-${specName}-${value}`,
          type: 'specification',
          name: specDisplayName,
          value
        });
      });
    });
    
    setActiveFilters(filters);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [selectedSpecs, activeCategory, t]);

  // Apply filters when manually triggered or after debounce
  const applyFilters = () => {
    // Clear any pending timer to prevent subsequent automatic filter application
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    setPendingFilter(false);
    
    if (Object.keys(selectedSpecs).length === 0) {
      // No filters applied, return all products
      onFilter(products);
      return;
    }

    // Filter products based on selected specifications
    const filteredProducts = filterProductsBySpecifications(products, selectedSpecs);
    onFilter(filteredProducts);
  };

  // Handle specification change with debounce
  const handleSpecChange = (specName: string, values: string[]) => {
    // Cancel any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Update selected specs
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

    // Set pending filter state
    setPendingFilter(true);

    // Set debounce timer (7 seconds)
    debounceTimerRef.current = setTimeout(() => {
      applyFilters();
    }, 7000);
  };

  // Remove a specific filter
  const removeSpecificationFilter = (specName: string, value: string) => {
    setSelectedSpecs(prev => {
      const newSpecs = { ...prev };
      
      if (newSpecs[specName]) {
        newSpecs[specName] = newSpecs[specName].filter(v => v !== value);
        
        if (newSpecs[specName].length === 0) {
          delete newSpecs[specName];
        }
      }
      
      return newSpecs;
    });
    
    // Apply filters immediately when removing
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    setPendingFilter(false);
    setTimeout(() => applyFilters(), 0);
  };

  // Clear all filters
  const clearAllFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSelectedSpecs({});
    setPendingFilter(false);
    onFilter(products);
  };

  // Toggle section collapse state
  const toggleSection = (specName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [specName]: !prev[specName]
    }));
  };

  // Format the specification name for display
  const formatSpecName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Count total selected filters
  const totalSelectedFilters = Object.values(selectedSpecs).reduce(
    (count, values) => count + values.length, 
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          <span className="flex items-center">
            {t('filter')}
            {totalSelectedFilters > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 text-xs rounded-full">
                {totalSelectedFilters}
              </span>
            )}
          </span>
        </h3>
        
        <div className="flex items-center space-x-2">
          {pendingFilter && (
            <button
              onClick={applyFilters}
              className="text-sm px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {t('apply_filters')}
            </button>
          )}
          
          {totalSelectedFilters > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {t('filter_clear_all')}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 max-h-[70vh] overflow-y-auto filter-scrollbar pr-2" style={{ scrollbarWidth: 'thin' }}>
        {Object.keys(uniqueSpecs).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('filter_no_specifications')}</p>
        ) : (
          Object.entries(uniqueSpecs).map(([specName, values]) => {
            // Try to get the translation key for this specification
            const specTranslationKey = `spec_${specName.toLowerCase().replace(/ /g, '_')}`;
            const specDisplayName = t(specTranslationKey) !== specTranslationKey ? 
              t(specTranslationKey) : 
              formatSpecName(specName);
              
            return (
              <div key={specName} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleSection(specName)}
                  className="w-full flex justify-between items-center p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                    {specDisplayName}
                    {selectedSpecs[specName]?.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 text-xs rounded-full">
                        {selectedSpecs[specName].length}
                      </span>
                    )}
                  </span>
                  <motion.div
                    animate={{ rotate: collapsedSections[specName] ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {!collapsedSections[specName] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        {values.length > 8 && (
                          <div className="mb-2">
                            <input
                              type="text"
                              placeholder={t('search')}
                              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        )}
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                          {values.map(value => (
                            <label key={value} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedSpecs[specName]?.includes(value) || false}
                                onChange={() => {
                                  const currentSelected = selectedSpecs[specName] || [];
                                  const newValues = currentSelected.includes(value)
                                    ? currentSelected.filter(v => v !== value)
                                    : [...currentSelected, value];
                                  handleSpecChange(specName, newValues);
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
      
      <style jsx>{`
        .filter-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .filter-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .filter-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
} 