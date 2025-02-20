// src/components/CategorySidebar.tsx
"use client";
import type { Category } from '@/types';

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <aside className="category-sidebar">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
