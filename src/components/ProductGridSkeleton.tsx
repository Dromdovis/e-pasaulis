'use client';

import ProductCardSkeleton from './skeletons/ProductCardSkeleton';

export function ProductGridSkeleton() {
  // Calculate number of skeleton cards based on viewport width
  const getSkeletonCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return 12; // xl (4 per row × 3 rows)
      if (width >= 1024) return 12; // lg (4 per row × 3 rows)
      if (width >= 768) return 9; // md (3 per row × 3 rows)
      if (width >= 640) return 6; // sm (2 per row × 3 rows)
      return 3; // xs (1 per row × 3 rows)
    }
    return 8; // Default for SSR
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: getSkeletonCount() }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
} 