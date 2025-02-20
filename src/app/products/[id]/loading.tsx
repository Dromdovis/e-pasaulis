export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 