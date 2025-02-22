import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Package, Categories, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
    subItems: [
      { href: '/admin/products/create', label: 'Create Product' },
      { href: '/admin/products/list', label: 'Product List' }
    ]
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingBag
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Categories
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings
  }
];

function NavItem({ 
  href, 
  label, 
  icon: Icon, 
  subItems,
  isActive 
}: { 
  href: string; 
  label: string; 
  icon: any;
  subItems?: { href: string; label: string; }[];
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <li>
      <Link 
        href={href}
        className={`flex items-center p-2 rounded ${
          isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        <span>{label}</span>
        {subItems && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </Link>
      {subItems && isOpen && (
        <ul className="ml-6 mt-1 space-y-1">
          {subItems.map(item => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="block p-2 text-sm hover:bg-gray-200 rounded"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <ul className="space-y-1 p-4">
          {navItems.map(item => (
            <NavItem 
              key={item.href}
              {...item}
              isActive={pathname === item.href || 
                (item.subItems?.some(sub => pathname === sub.href) ?? false)}
            />
          ))}
        </ul>
      </nav>
      <div className="flex-1 bg-gray-50">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => pathname === item.href)?.label || 'Admin'}
            </h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 