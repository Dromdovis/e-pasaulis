'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { Package, Users, Folder, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import toast from 'react-hot-toast';
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
  const { user, isAuthenticated, isLoading, isInitialized, isAdmin } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        // Not authenticated
        router.push('/login');
      } else if (!isAdmin) {
        // Authenticated but not an admin
        router.push('/');
      } else {
        // Is authenticated and is admin
        setLoading(false);
      }
    }
  }, [isInitialized, isAuthenticated, isAdmin, router]);

  if (!isInitialized || isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 mx-auto text-primary" />
          <p className="mt-2 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: t('admin_users_management'),
      description: t('admin_users_description'),
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('admin_products_management'),
      description: t('admin_products_description'),
      href: '/admin/products',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: t('admin_categories_management'),
      description: t('admin_categories_description'),
      href: '/admin/categories',
      icon: Folder,
      color: 'bg-yellow-500'
    },
    {
      title: t('admin_reviews_management'),
      description: t('admin_reviews_description'),
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: t('admin_bulk_management'),
      description: t('admin_bulk_description'),
      href: '/admin/bulk',
      icon: Upload,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">{t('admin_dashboard')}</h1>
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