// src/app/page.tsx
import PocketBase from 'pocketbase';
import ProductCard from '@/components/ProductCard';
import CategorySidebar from '@/components/CategorySidebar';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string; // PocketBase file field
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

async function getInitialData() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  const [products, categories] = await Promise.all([
    pb.collection('products').getList<Product>(1, 50, {
      sort: '-created',
      expand: 'category'
    }),
    pb.collection('categories').getList<Category>()
  ]);
  
  return {
    products: products.items,
    categories: categories.items
  };
}

export default async function Home() {
  const { products, categories } = await getInitialData();

  return (
    <div className="flex min-h-screen">
      <CategorySidebar categories={categories} />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}