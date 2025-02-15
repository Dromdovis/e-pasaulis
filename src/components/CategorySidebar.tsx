// src/components/CategorySidebar.tsx
"use client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {
  return (
    // src/components/CategorySidebar.tsx (partial update)
    <aside className="w-64 min-h-screen bg-[rgb(var(--sidebar-bg))] border-r border-black/5 p-6 hidden md:block sticky top-0">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100">
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
