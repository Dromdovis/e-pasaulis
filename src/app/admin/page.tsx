'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import { Users, Package, Folder, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/translations';

interface DashboardCard {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
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
      titleKey: 'users',
      descriptionKey: 'manage_users',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      titleKey: 'products',
      descriptionKey: 'manage_products',
      href: '/admin/products',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      titleKey: 'categories',
      descriptionKey: 'manage_categories',
      href: '/admin/categories',
      icon: Folder,
      color: 'bg-yellow-500'
    },
    {
      titleKey: 'reviews',
      descriptionKey: 'monitor_reviews',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      titleKey: 'bulk_operations',
      descriptionKey: 'import_export',
      href: '/admin/bulk',
      icon: Upload,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin_dashboard')}</h1>
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
                  <h2 className="text-xl font-semibold">{t(card.titleKey)}</h2>
                  <p className="text-gray-600 mt-1">{t(card.descriptionKey)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 