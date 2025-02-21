'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200 animate-pulse" />
      
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        
        {/* Price placeholder */}
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        
        {/* Button placeholder */}
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
} 