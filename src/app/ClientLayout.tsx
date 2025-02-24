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

// Create a separate component for auth validation
function AuthValidator({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Validate auth state on mount
    if (typeof window !== 'undefined') {
      const isValid = pb.authStore.isValid;
      if (!isValid && isAuthenticated) {
        logout();
        router.refresh();
      }
    }
  }, [isAuthenticated, router, logout]);

  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <CartProvider>
          <AdminProvider>
            <AuthValidator>
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
            </AuthValidator>
          </AdminProvider>
        </CartProvider>
      </LanguageProvider>
    </QueryProvider>
  );
} 