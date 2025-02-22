export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <p className="text-gray-600 mb-4">Manage your product inventory</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            View Products →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-gray-600 mb-4">View and manage orders</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            View Orders →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <p className="text-gray-600 mb-4">Manage product categories</p>
          <Link href="/admin/categories" className="text-blue-600 hover:underline">
            View Categories →
          </Link>
        </div>
      </div>
    </div>
  );
} 