// src/app/page.tsx
'use client';

import { Suspense, useState } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProductGrid from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import FilterTags from '@/components/FilterTags';
import type { Category } from '@/types';
import { pb } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import { ProductSort } from '@/components/ProductSort';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';
import { ChevronDown, X } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';

export default function HomePage() {
  // 1. All useState hooks first
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'>('newest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. Other hooks after useState
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await pb.collection('categories').getList<Category>(1, 50);
      return response.items;
    }
  });

  // 3. useScrollRestoration after other hooks
  const { isRestoring } = useScrollRestoration('home_page');

  // Event handlers
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

  // Render
  if (isRestoring) {
    return <div className="p-8">Restoring view...</div>;
  }

  return (
    <div className="container-responsive py-6">
      {/* Mobile Category Button */}
      <button
        className="lg:hidden w-full mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between"
        onClick={() => setMobileMenuOpen(true)}
      >
        <span className="font-medium">Categories</span>
        <ChevronDown className="h-5 w-5" />
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Categories */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <h2 className="text-lg font-semibold">Categories</h2>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mobile-menu-body">
                  <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory?.id}
                    onCategorySelect={(id) => {
                      handleCategorySelect(id);
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Categories */}
          <div className="hidden lg:block sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory?.id}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <FilterTags
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            onRemoveCategory={handleRemoveCategory}
            onRemovePriceRange={handleRemovePriceRange}
          />

          {/* Product Grid and Right Sidebar Container */}
          <div className="mt-4 flex flex-col lg:flex-row gap-6">
            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid
                  selectedCategory={selectedCategory?.id}
                  priceRange={selectedPriceRange}
                  inStockOnly={inStockOnly}
                  sortBy={sortBy}
                />
              </Suspense>
            </div>

            {/* Right Sidebar - Filters & Sort */}
            <aside className="w-full lg:w-64 flex-shrink-0 order-first lg:order-last">
              <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
                <ProductSort onSort={handleSort} />
                <ProductFilters
                  maxPrice={1000}
                  onPriceChange={setSelectedPriceRange}
                  onAvailabilityChange={setInStockOnly}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}