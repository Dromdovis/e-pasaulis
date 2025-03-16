'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import CategorySidebar from '@/components/CategorySidebar';
import ProductGrid from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import FilterTags from '@/components/FilterTags';
import SpecificationsFilterPanel from '@/components/SpecificationsFilterPanel';
import type { Category, Product } from '@/types';
import { pb } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import { ProductSort } from '@/components/ProductSort';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';
import { ChevronDown, X } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // 1. All useState hooks first
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'>('newest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // 2. Other hooks after useState
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await pb.collection('categories').getList<Category>(1, 50);
      return response.items;
    }
  });

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const response = await pb.collection('categories').getFirstListItem<Category>(`slug = "${slug}"`);
        return response;
      } catch (error) {
        console.error('Error fetching category:', error);
        return null;
      }
    },
    enabled: !!slug
  });

  // Fetch all products for specification filtering
  const { data: productsData } = useQuery({
    queryKey: ['products', category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      const filter = `category = "${category.id}"`;
      const response = await pb.collection('products').getList<Product>(1, 100, {
        filter
      });
      return response.items;
    },
    enabled: !!category?.id
  });

  // Update allProducts when the query data changes
  useEffect(() => {
    if (productsData) {
      setAllProducts(productsData);
      setFilteredProducts(productsData);
    }
  }, [productsData]);

  // 3. useScrollRestoration after other hooks
  const { isRestoring } = useScrollRestoration(`category_page_${slug}`);

  // Event handlers
  const handleRemovePriceRange = () => {
    setSelectedPriceRange(undefined);
  };

  // Handle specification filter
  const handleSpecificationFilter = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  // Memoize filter handlers to avoid recreating functions on every render
  const handlePriceChangeCallback = useCallback((range: { min: number; max: number }) => {
    setSelectedPriceRange(range);
  }, []);

  const handleAvailabilityChangeCallback = useCallback((inStock: boolean) => {
    setInStockOnly(inStock);
  }, []);

  const handleSortCallback = useCallback((sortOption: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest') => {
    setSortBy(sortOption);
  }, []);

  const handleSpecificationFilterCallback = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

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
                    selectedCategory={category?.id}
                    onCategorySelect={(id) => {
                      // Find the category with the matching id
                      const selectedCategory = categories.find(c => c.id === id);
                      if (selectedCategory) {
                        window.location.href = `/category/${selectedCategory.slug}`;
                      }
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Filters Button */}
          <button
            className="lg:hidden w-full mt-4 mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <span className="font-medium">Filtrai</span>
            <ChevronDown className="h-5 w-5" />
          </button>

          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <div className="mobile-menu lg:hidden mb-4" onClick={() => setMobileFiltersOpen(false)}>
              <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <h2 className="text-lg font-semibold">Filtrai</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mobile-menu-body">
                  <ProductSort onSort={handleSortCallback} />
                  <ProductFilters
                    maxPrice={1000}
                    onPriceChange={handlePriceChangeCallback}
                    onAvailabilityChange={handleAvailabilityChangeCallback}
                  />
                  {category && (
                    <div className="mt-4">
                      <SpecificationsFilterPanel
                        products={allProducts}
                        onFilter={handleSpecificationFilterCallback}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Categories */}
          <div className="hidden lg:block sticky top-4">
            <CategorySidebar
              categories={categories}
              selectedCategory={category?.id}
              onCategorySelect={(id) => {
                // Find the category with the matching id
                const selectedCategory = categories.find(c => c.id === id);
                if (selectedCategory) {
                  window.location.href = `/category/${selectedCategory.slug}`;
                }
              }}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <FilterTags
            selectedCategory={category || undefined}
            selectedPriceRange={selectedPriceRange}
            onRemoveCategory={() => window.location.href = '/'}
            onRemovePriceRange={handleRemovePriceRange}
          />

          {/* Product Grid and Right Sidebar Container */}
          <div className="mt-4 flex flex-col lg:flex-row gap-6">
            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={<ProductGridSkeleton />}>
                {category && filteredProducts !== allProducts ? (
                  <ProductGrid
                    products={filteredProducts}
                    selectedCategory={category?.id}
                    priceRange={selectedPriceRange}
                    inStockOnly={inStockOnly}
                    sortBy={sortBy}
                    useSpecificationFilter={true}
                  />
                ) : (
                  <ProductGrid
                    selectedCategory={category?.id}
                    priceRange={selectedPriceRange}
                    inStockOnly={inStockOnly}
                    sortBy={sortBy}
                  />
                )}
              </Suspense>
            </div>

            {/* Right Sidebar - Filters & Sort */}
            <aside className="w-full lg:w-64 flex-shrink-0 order-first lg:order-last">
              <div className="sticky top-4 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
                  <ProductSort onSort={handleSortCallback} />
                  <ProductFilters
                    maxPrice={1000}
                    onPriceChange={handlePriceChangeCallback}
                    onAvailabilityChange={handleAvailabilityChangeCallback}
                  />
                </div>
                
                {/* Specifications Filter Panel - Moved here from left sidebar */}
                {category && (
                  <div className="mt-4">
                    <SpecificationsFilterPanel
                      products={allProducts}
                      onFilter={handleSpecificationFilterCallback}
                    />
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
} 