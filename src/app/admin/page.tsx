'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { Users, Package, Folder, Star, Upload } from 'lucide-react';
import Link from 'next/link';

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
        router.push('/');
        return;
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, user, router]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Users',
      description: 'Manage user accounts, roles, and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Products',
      description: 'Add, edit, and manage product listings',
      href: '/admin/products',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Categories',
      description: 'Organize products with categories',
      href: '/admin/categories',
      icon: Folder,
      color: 'bg-yellow-500'
    },
    {
      title: 'Reviews',
      description: 'Monitor and moderate product reviews',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: 'Bulk Operations',
      description: 'Import/export products and perform bulk updates',
      href: '/admin/bulk',
      icon: Upload,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                  <p className="text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 