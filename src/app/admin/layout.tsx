'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, initialize, isInitialized } = useAuth();

  // Initialize auth if needed
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Debug log auth state
  useEffect(() => {
    console.log('Admin Layout - Auth State:', {
      isInitialized,
      isLoading,
      isAuthenticated,
      userRole: user?.role,
      userName: user?.name,
      isAdmin: user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN
    });
  }, [isInitialized, isLoading, isAuthenticated, user]);

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Handle not authenticated state
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    router.push('/login');
    return null;
  }

  // Handle not admin state
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You do not have permission to access the admin panel.
          </p>
          <Link 
            href="/"
            className="block w-full bg-primary-600 text-white text-center py-2 px-4 rounded hover:bg-primary-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                e-pasaulis
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xl font-bold text-gray-900">{t('admin_panel')}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {t('logged_in_as')}: {user?.name} ({user?.role})
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