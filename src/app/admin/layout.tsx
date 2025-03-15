'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Toaster } from 'react-hot-toast';
import { pb } from '@/lib/db';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, initialize, isInitialized, isAdmin } = useAuth();
  // Add a state to track our own initialization
  const [isLocalInitialized, setIsLocalInitialized] = useState(false);

  // Debug auth state in admin layout
  useEffect(() => {
    console.log('Admin Layout - Auth State:', { 
      isInitialized, 
      isAuthenticated, 
      isAdmin, 
      userRole: user?.role,
      pbAuthValid: pb.authStore.isValid,
      pbModelExists: !!pb.authStore.model
    });
  }, [isInitialized, isAuthenticated, isAdmin, user]);

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

  // Initialize auth if needed and handle only once
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isInitialized) {
        console.log('Admin Layout - Initializing auth');
        await initialize();
      }
      setIsLocalInitialized(true);
    };
    
    initializeAuth();
  }, [initialize, isInitialized]);

  // Handle authentication redirects only after our local init is complete
  useEffect(() => {
    if (!isLocalInitialized) return;
    
    console.log('Admin Layout - Checking access rights:', {
      isAuthenticated,
      userRole: user?.role,
      isAdmin
    });

    if (!isAuthenticated) {
      console.log('Admin Layout - Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      console.log('Admin Layout - Not admin, redirecting to home');
      router.push('/');
      return;
    }
  }, [isLocalInitialized, isAuthenticated, user, isAdmin, router]);

  // Show loading state during initialization
  if (!isLocalInitialized || isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Since we're still in the component at this point, the user is authenticated and is an admin
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
                {t('Admin Panel')}
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name} ({t(getRoleTranslationKey(user?.role))})
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