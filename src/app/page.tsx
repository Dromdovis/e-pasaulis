// src/app/page.tsx
'use client';

import { Suspense, useState } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProductGrid from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import { SearchBar } from '@/components/SearchBar';
import FilterTags from '@/components/FilterTags';
import type { Category } from '@/types';
import { pb } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import { ProductSort } from '@/components/ProductSort';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'>('newest');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await pb.collection('categories').getList<Category>(1, 50);
      return response.items;
    }
  });

  const handleCategorySelect = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(undefined);
  };

  const handleRemovePriceRange = () => {
    setSelectedPriceRange(undefined);
  };

  const handleSort = (sortOption: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest') => {
    setSortBy(sortOption);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex gap-8">
          <CategorySidebar 
            categories={categories} 
            selectedCategory={selectedCategory?.id}
            onCategorySelect={handleCategorySelect}
          />
          
          <div className="flex-1">
            <FilterTags 
              selectedCategory={selectedCategory}
              selectedPriceRange={selectedPriceRange}
              onRemoveCategory={handleRemoveCategory}
              onRemovePriceRange={handleRemovePriceRange}
            />
            
            <div className="flex justify-end mb-4">
              <ProductSort onSort={handleSort} />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <Suspense fallback={<div>Loading products...</div>}>
                  <ProductGrid 
                    selectedCategory={selectedCategory?.id}
                    priceRange={selectedPriceRange}
                    inStockOnly={inStockOnly}
                    sortBy={sortBy}
                  />
                </Suspense>
              </div>
              
              <div className="w-64">
                <ProductFilters
                  maxPrice={1000}
                  onPriceChange={setSelectedPriceRange}
                  onAvailabilityChange={setInStockOnly}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}