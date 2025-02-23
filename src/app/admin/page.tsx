'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { TranslationKey } from '@/lib/i18n/types';
import { 
  Users, 
  Package, 
  FolderTree, 
  Heart, 
  ShoppingCart, 
  Star,
  Settings,
  Database,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { CategoryIcon } from '@/components/icons/CategoryIcon';

interface DashboardCard {
  title: TranslationKey;
  description: TranslationKey;
  href: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboard() {
  const { t } = useLanguage();

  const dashboardCards: DashboardCard[] = [
    {
      title: 'users',
      description: 'admin.users_description',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'products',
      description: 'admin.products_description',
      href: '/admin/products',
      icon: ShoppingBag,
      color: 'bg-green-500'
    },
    {
      title: 'reviews',
      description: 'admin.reviews_description',
      href: '/admin/reviews',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'bulk_operations',
      description: 'admin.bulk_operations_description',
      href: '/admin/bulk',
      icon: Database,
      color: 'bg-indigo-500'
    },
    {
      title: 'categories',
      description: 'admin.categories_description',
      href: '/admin/categories',
      icon: CategoryIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin_panel')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className={`p-4 ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {t(card.title)}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t(card.description)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 