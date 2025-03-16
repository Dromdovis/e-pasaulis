// src/app/page.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProductGrid from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';
import SpecificationsFilterPanel from '@/components/SpecificationsFilterPanel';
import SelectedFilters, { SelectedFilter } from '@/components/SelectedFilters';
import type { Category, Product } from '@/types';
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);

  // 2. Other hooks after useState
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await pb.collection('categories').getList<Category>(1, 50);
      return response.items;
    }
  });

  // Fetch all products for specification filtering
  const { data: productsData } = useQuery({
    queryKey: ['products', selectedCategory?.id],
    queryFn: async () => {
      let filter = '';
      if (selectedCategory?.id) {
        filter = `category = "${selectedCategory.id}"`;
      }
      const response = await pb.collection('products').getList<Product>(1, 100, {
        filter
      });
      return response.items;
    }
  });

  // Update allProducts when the query data changes
  useEffect(() => {
    if (productsData) {
      setAllProducts(productsData);
      setFilteredProducts(productsData);
    }
  }, [productsData]);

  // Add price filter to selected filters when it changes
  useEffect(() => {
    if (!selectedPriceRange) {
      // Remove price filter if price range is cleared
      setSelectedFilters(prev => prev.filter(f => f.type !== 'price'));
      return;
    }
    
    // Update price filter
    setSelectedFilters(prev => {
      const withoutPrice = prev.filter(f => f.type !== 'price');
      return [...withoutPrice, {
        id: 'price-range',
        type: 'price',
        name: 'price_range',
        value: `${selectedPriceRange.min} - ${selectedPriceRange.max}`
      }];
    });
  }, [selectedPriceRange]);

  // Add in-stock filter to selected filters when it changes
  useEffect(() => {
    // Update in-stock filter
    setSelectedFilters(prev => {
      const withoutStock = prev.filter(f => f.type !== 'stock');
      
      if (!inStockOnly) {
        return withoutStock;
      }
      
      return [...withoutStock, {
        id: 'in-stock',
        type: 'stock',
        name: 'filter_in_stock_only',
        value: ''
      }];
    });
  }, [inStockOnly]);

  // 3. useScrollRestoration after other hooks
  const { isRestoring } = useScrollRestoration('home_page');

  // Event handlers
  const handleCategorySelect = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
    
    // Add category to filters
    if (category) {
      setSelectedFilters(prev => [
        ...prev.filter(f => f.type !== 'category'),
        {
          id: `category-${categoryId}`,
          type: 'category',
          name: 'categories',
          value: category.name_en
        }
      ]);
    }
  };

  const handleRemoveCategory = () => {
    setSelectedCategory(undefined);
    setSelectedFilters(prev => prev.filter(f => f.type !== 'category'));
  };

  const handleRemovePriceRange = () => {
    setSelectedPriceRange(undefined);
    setSelectedFilters(prev => prev.filter(f => f.type !== 'price'));
  };

  const handleSort = (sortOption: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest') => {
    setSortBy(sortOption);
  };

  const handleSpecificationFilter = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };
  
  const handleSpecFiltersChange = (filters: SelectedFilter[]) => {
    // Merge spec filters with other filters
    const nonSpecFilters = selectedFilters.filter(f => 
      f.type !== 'specification' && 
      f.type !== 'category'
    );
    
    setSelectedFilters([...nonSpecFilters, ...filters]);
  };
  
  const handleRemoveFilter = (filter: SelectedFilter) => {
    // Remove the filter from the selectedFilters state
    setSelectedFilters(prev => prev.filter(f => f.id !== filter.id));
    
    // Handle removing different types of filters
    switch (filter.type) {
      case 'category':
        handleRemoveCategory();
        break;
      case 'price':
        handleRemovePriceRange();
        break;
      case 'stock':
        setInStockOnly(false);
        break;
      case 'specification':
        // Extract spec name and value from the filter
        const specId = filter.id.split('-');
        if (specId.length >= 3) {
          const specName = specId[1];
          const specValue = filter.value;
          
          // Find the SpecificationsFilterPanel and call its removeSpecificationFilter method
          // This would be better handled via a context or ref, but for now we'll simulate
          // rerendering the component with updated selections
          const updatedFilters = selectedFilters.filter(f => f.id !== filter.id);
          setSelectedFilters(updatedFilters);
          
          // Force a rerender of the product grid with the filtered products
          const specFilteredProducts = allProducts.filter(product => {
            // Skip products that don't have the spec or don't match the removed value
            if (!product.specifications || !product.specifications[specName]) {
              return true;
            }
            return product.specifications[specName] !== specValue;
          });
          
          setFilteredProducts(specFilteredProducts);
        }
        break;
    }
  };
  
  const handleClearAllFilters = () => {
    setSelectedCategory(undefined);
    setSelectedPriceRange(undefined);
    setInStockOnly(false);
    setSelectedFilters([]);
    setFilteredProducts(allProducts);
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
                    useLinks={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Categories */}
          <div className="hidden lg:block sticky top-4">
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory?.id}
              onCategorySelect={handleCategorySelect}
              useLinks={true}
            />
            
            {selectedCategory && (
              <div className="mt-8">
                <SpecificationsFilterPanel
                  products={allProducts}
                  onFilter={handleSpecificationFilter}
                  onFiltersChange={handleSpecFiltersChange}
                  activeCategory={selectedCategory.name_en}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Selected Filters Display */}
          <SelectedFilters 
            filters={selectedFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          {/* Product Grid and Right Sidebar Container */}
          <div className="mt-4 flex flex-col lg:flex-row gap-6">
            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={<ProductGridSkeleton />}>
                {selectedCategory && filteredProducts !== allProducts ? (
                  <ProductGrid
                    products={filteredProducts}
                    selectedCategory={selectedCategory?.id}
                    priceRange={selectedPriceRange}
                    inStockOnly={inStockOnly}
                    sortBy={sortBy}
                    useSpecificationFilter={true}
                  />
                ) : (
                  <ProductGrid
                    selectedCategory={selectedCategory?.id}
                    priceRange={selectedPriceRange}
                    inStockOnly={inStockOnly}
                    sortBy={sortBy}
                  />
                )}
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