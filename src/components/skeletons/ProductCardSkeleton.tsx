'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      
      <div className="p-4 space-y-3">
        {/* Title placeholder - multiple lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        
        {/* Price placeholder */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        
        {/* Action buttons placeholder */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
} 