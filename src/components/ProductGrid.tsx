'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';
import { useInView } from 'react-intersection-observer';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';
import { ClientResponseError } from 'pocketbase';
import type { Product } from '@/types';

interface ProductGridProps {
  selectedCategory?: string;
  priceRange?: { min: number; max: number };
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  products?: Product[]; // Add support for direct products array
  useSpecificationFilter?: boolean; // Flag to indicate if specification filter is used
}

export default function ProductGrid({ 
  selectedCategory, 
  priceRange, 
  inStockOnly, 
  searchQuery,
  sortBy = 'newest',
  products: providedProducts,
  useSpecificationFilter = false
}: ProductGridProps) {
  const { t } = useLanguage();
  
  // State for specifications filter
  const [specFilters, setSpecFilters] = useState<Record<string, string[]>>({});
  const [showSpecFilters, setShowSpecFilters] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    refetch
  } = useProducts({
    categoryId: selectedCategory,
    priceMin: priceRange?.min,
    priceMax: priceRange?.max,
    sortBy,
    inStockOnly,
    query: searchQuery,
    enabled: !providedProducts, // Only fetch if products are not provided directly
    specifications: useSpecificationFilter ? specFilters : undefined
  });

  // If we're using the query data (not provided products), extract products from the data
  const queryProducts: Product[] = [];
  if (!providedProducts && data) {
    // Access the data safely using type assertion and optional chaining
    const pagesData = data as { pages?: Array<{ items?: Product[], total?: number }> };
    if (pagesData.pages) {
      for (const page of pagesData.pages) {
        if (page.items) {
          queryProducts.push(...page.items);
        }
      }
    }
  }

  const { isRestoring } = useScrollRestoration(
    `product_grid_${selectedCategory ?? 'all'}_${sortBy}${useSpecificationFilter ? '_specs' : ''}`
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !providedProducts) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage, providedProducts]);
  
  // Helper function to sort storage values (1GB, 16GB, 128GB, 1TB, etc.)
  // Must be defined before it's used in useMemo
  const sortStorageValues = (values: string[]) => {
    // Convert all values to gigabytes for comparison
    const normalizedValues = values.map(value => {
      const trimmedValue = value.trim().replace(/\s+/g, '').toLowerCase();
      const numericPart = parseFloat(trimmedValue.replace(/[^0-9.]/g, ''));
      
      if (trimmedValue.includes('tb')) {
        return { original: value, normalized: numericPart * 1024 }; // Convert TB to GB
      } else if (trimmedValue.includes('gb')) {
        return { original: value, normalized: numericPart };
      } else if (trimmedValue.includes('mb')) {
        return { original: value, normalized: numericPart / 1024 }; // Convert MB to GB
      } else {
        return { original: value, normalized: numericPart };
      }
    });
    
    // Sort by normalized values
    normalizedValues.sort((a, b) => a.normalized - b.normalized);
    
    // Return original strings in sorted order
    return normalizedValues.map(item => item.original);
  };

  // Extract available specifications from products
  const availableSpecs = useMemo(() => {
    const specs: Record<string, Set<string>> = {};
    
    const productsToAnalyze = providedProducts || queryProducts;
    
    productsToAnalyze.forEach(product => {
      if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
          if (!specs[key]) {
            specs[key] = new Set();
          }
          specs[key].add(String(value));
        });
      }
    });
    
    // Process and sort values appropriately
    return Object.fromEntries(
      Object.entries(specs).map(([key, valuesSet]) => {
        const values = Array.from(valuesSet);
        
        // Sort values appropriately based on the key type
        if (key.toLowerCase().includes('storage') || 
            key.toLowerCase().includes('memory') || 
            key.toLowerCase().includes('ram') || 
            key.toLowerCase().includes('capacity')) {
          // Sort storage/memory values numerically by GB/TB
          return [key, sortStorageValues(values)];
        } else if (key.toLowerCase().includes('size') || 
                 key.toLowerCase().includes('screen') || 
                 key.toLowerCase().includes('display') ||
                 key.toLowerCase().includes('inches')) {
          // Sort screen sizes numerically
          return [key, values.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^0-9.]/g, ''));
            const numB = parseFloat(b.replace(/[^0-9.]/g, ''));
            return numA - numB;
          })];
        } else if (!isNaN(Number(values[0]))) {
          // Sort numeric values
          return [key, values.sort((a, b) => Number(a) - Number(b))];
        } else {
          // Sort strings alphabetically
          return [key, values.sort()];
        }
      })
    );
  }, [providedProducts, queryProducts]);

  // Group specifications for better organization
  const groupedSpecs = useMemo(() => {
    // Define priority specifications that should appear first
    const prioritySpecs = [
      'storage', 'capacity', 'memory', 'ram', 'processor', 'cpu', 
      'screen', 'display', 'size', 'resolution'
    ];
    
    // Sort keys by priority
    const sortedKeys = Object.keys(availableSpecs).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Check if either key contains a priority term
      const aPriority = prioritySpecs.findIndex(term => aLower.includes(term));
      const bPriority = prioritySpecs.findIndex(term => bLower.includes(term));
      
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority; // Both are priority specs, sort by priority order
      } else if (aPriority !== -1) {
        return -1; // Only a is priority, a comes first
      } else if (bPriority !== -1) {
        return 1; // Only b is priority, b comes first
      } else {
        return aLower.localeCompare(bLower); // Neither is priority, sort alphabetically
      }
    });
    
    return sortedKeys;
  }, [availableSpecs]);

  const handleSpecFilterChange = (specKey: string, value: string, checked: boolean) => {
    setSpecFilters(prev => {
      const current = prev[specKey] || [];
      if (checked) {
        return { ...prev, [specKey]: [...current, value] };
      } else {
        return { 
          ...prev, 
          [specKey]: current.filter(v => v !== value) 
        };
      }
    });
  };

  const resetSpecFilters = () => {
    setSpecFilters({});
  };

  const handleRetry = () => {
    refetch();
  };

  const getLoadingCardCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1536) return 6; // 2xl
      if (width >= 1280) return 5; // xl
      if (width >= 1024) return 4; // lg
      if (width >= 768) return 3; // md
      if (width >= 640) return 2; // sm
      return 1;
    }
    return 4;
  };

  if ((isLoading && !providedProducts) || isRestoring) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(10)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Get total count for search
  const totalCount = !providedProducts && data 
    ? (data as any).pages?.[0]?.total || 0
    : providedProducts?.length || 0;

  // Final products to display
  const productsToDisplay = providedProducts || queryProducts;

  // Apply spec filters to provided products if needed
  const filteredProducts = useSpecificationFilter && Object.keys(specFilters).length > 0
    ? productsToDisplay.filter(product => {
        if (!product.specifications) return false;
        
        // Check if product matches all selected specification filters
        return Object.entries(specFilters).every(([specKey, values]) => {
          if (values.length === 0) return true; // Skip empty filters
          const productValue = String(product.specifications?.[specKey] || '');
          return values.includes(productValue);
        });
      })
    : productsToDisplay;

  return (
    <div>
      {searchQuery && (
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          {t('search_count', { count: totalCount })}
        </div>
      )}

      {useSpecificationFilter && Object.keys(availableSpecs).length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('product_filter_specs')}</h3>
            <button 
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={() => setShowSpecFilters(!showSpecFilters)}
            >
              {showSpecFilters ? t('hide') : t('show')}
            </button>
          </div>
          
          {showSpecFilters && (
            <div className="space-y-4">
              {groupedSpecs.map((specKey) => (
                <div key={specKey} className="border-t pt-3">
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">{specKey}</h4>
                  <div className="space-y-1">
                    {availableSpecs[specKey].map(value => (
                      <div key={`${specKey}-${value}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`spec-${specKey}-${value}`}
                          checked={specFilters[specKey]?.includes(value) || false}
                          onChange={(e) => handleSpecFilterChange(specKey, value, e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`spec-${specKey}-${value}`} 
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between">
                <button
                  onClick={resetSpecFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t('product_reset_filter')}
                </button>
                <button
                  onClick={() => setShowSpecFilters(false)}
                  className="text-sm bg-primary-600 hover:bg-primary-700 text-white py-1 px-3 rounded"
                >
                  {t('product_apply_filter')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isError && error instanceof ClientResponseError && !providedProducts ? (
        <div className="text-center text-red-500 p-4">
          <p>Error loading products: {error.message}</p>
          <button 
            onClick={handleRetry} 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('try_again')}
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          <p>{t('search_no_results')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProducts.map((product: Product, index: number) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isPriority={index < 4}
            />
          ))}
          {isFetchingNextPage && !providedProducts && (
            <>
              {Array.from({ length: getLoadingCardCount() }).map((_, i) => (
                <ProductCardSkeleton key={`loading-${i}`} />
              ))}
            </>
          )}
          {!providedProducts && <div ref={ref} className="col-span-full h-1" />}
        </div>
      )}
    </div>
  );
} 