'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { Package, Users, Folder, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Loader } from 'lucide-react';

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const { data: session } = useSession();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      // Not authenticated
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      // Authenticated but not an admin
      router.push('/');
    } else {
      // Is admin, stop loading
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 mx-auto text-primary" />
          <p className="mt-2 text-gray-600">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: t('manage_users') || 'Manage Users',
      description: t('admin_users_description') || 'Manage user accounts, roles, and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('manage_products') || 'Manage Products',
      description: t('admin_products_description') || 'Add, edit, and manage product listings',
      href: '/admin/products',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: t('manage_categories') || 'Manage Categories',
      description: t('admin_categories_description') || 'Organize and structure product categories',
      href: '/admin/categories',
      icon: Folder,
      color: 'bg-yellow-500'
    },
    {
      title: t('monitor_reviews') || 'Monitor Reviews',
      description: t('admin_reviews_description') || 'Monitor and moderate product reviews',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: t('bulk_operations') || 'Bulk Operations',
      description: t('admin_bulk_description') || 'Import/export data and perform bulk operations',
      href: '/admin/bulk',
      icon: Upload,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">{t('admin_dashboard') || 'Admin Dashboard'}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">{card.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{card.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 