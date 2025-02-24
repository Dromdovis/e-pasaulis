'use client';

import ProductCardSkeleton from './skeletons/ProductCardSkeleton';

export function ProductGridSkeleton() {
  // Calculate number of skeleton cards based on viewport width
  const getSkeletonCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1536) return 16; // 2xl
      if (width >= 1280) return 12; // xl
      if (width >= 1024) return 9; // lg
      if (width >= 768) return 6; // md
      if (width >= 640) return 4; // sm
      return 2; // xs
    }
    return 8; // Default for SSR
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {Array.from({ length: getSkeletonCount() }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
} 