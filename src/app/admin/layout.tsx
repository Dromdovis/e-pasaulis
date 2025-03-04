'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user, isAuthenticated, isLoading, initialize, isInitialized } = useAuth();

  const getRoleTranslationKey = (role?: string): string => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'roles.admin';
      case 'super_admin':
        return 'roles.super_admin';
      case 'user':
        return 'roles.user';
      default:
        return 'roles.user';
    }
  };

  // Initialize auth if needed
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Handle authentication redirects
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

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Return null while redirecting to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Handle not admin state
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {t('admin.access_denied')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('admin.access_denied_message')}
          </p>
          <Link 
            href="/"
            className="block w-full bg-primary-600 text-white text-center py-2 px-4 rounded hover:bg-primary-700 transition-colors"
          >
            {t('admin.return_to_home')}
          </Link>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                e-pasaulis
              </Link>
              <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
              <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                {t('navigation.admin_panel')}
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.logged_in_as')}: {user?.name} ({t(getRoleTranslationKey(user?.role))})
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 