'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { Users, Package, Folder, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';
import { toast } from 'react-hot-toast';

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        toast.error(t('access_denied'));
        router.push('/login');
        return;
      }
      
      if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
        toast.error(t('access_denied_message'));
        router.push('/');
        return;
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, user, router, t]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: t('manage_users'),
      description: t('admin_users_description'),
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('manage_products'),
      description: t('admin_products_description'),
      href: '/admin/products',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: t('manage_categories'),
      description: t('admin_categories_description'),
      href: '/admin/categories',
      icon: Folder,
      color: 'bg-yellow-500'
    },
    {
      title: t('monitor_reviews'),
      description: t('admin_reviews_description'),
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: t('bulk_operations'),
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