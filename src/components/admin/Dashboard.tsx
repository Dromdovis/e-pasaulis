'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { Users, Package, FolderTree, MessageSquare, Database } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();

  const adminCards = [
    {
      title: t('admin:users.title'),
      description: t('admin:users.list'),
      href: '/admin/users',
      icon: Users,
    },
    {
      title: t('admin:products.title'),
      description: t('admin:products.list'),
      href: '/admin/products',
      icon: Package,
    },
    {
      title: t('admin:categories.title'),
      description: t('admin:categories.list'),
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      title: t('admin:reviews.title'),
      description: t('admin:reviews.list'),
      href: '/admin/reviews',
      icon: MessageSquare,
    },
    {
      title: t('admin:bulk.title'),
      description: t('admin:bulk.import.title'),
      href: '/admin/bulk',
      icon: Database,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adminCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
} 