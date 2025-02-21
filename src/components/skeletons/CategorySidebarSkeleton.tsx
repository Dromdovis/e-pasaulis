'use client';

export default function CategorySidebarSkeleton() {
  return (
    <div className="w-64 bg-[rgb(var(--card-bg))] backdrop-blur-sm shadow-lg shadow-black/5 p-4 rounded-lg sticky top-[4.5rem] h-[800px] overflow-hidden">
      <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="space-y-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
} 