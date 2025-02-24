'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/lib/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Breadcrumbs />
        <main className="flex-grow bg-gray-100 pt-4">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
} 