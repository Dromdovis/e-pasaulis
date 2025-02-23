'use client';

import { Suspense, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Loading from './loading';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Footer from '@/components/Footer';
import { CartProvider } from '../contexts/CartContext';
import { AdminProvider } from '../contexts/AdminContext';
import { pb } from '@/lib/db';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { QueryProvider } from '@/lib/providers/QueryProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Validate auth state on mount
    if (typeof window !== 'undefined') {
      const isValid = pb.authStore.isValid;
      if (!isValid && isAuthenticated) {
        useAuth.getState().logout();
        router.refresh();
      }
    }
  }, []);

  return (
    <QueryProvider>
      <LanguageProvider>
        <CartProvider>
          <AdminProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Breadcrumbs />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </AdminProvider>
        </CartProvider>
      </LanguageProvider>
    </QueryProvider>
  );
} 