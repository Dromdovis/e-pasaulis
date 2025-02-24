'use client';

import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          mobileMenuOpen={mobileMenuOpen} 
          onMobileMenuClose={() => setMobileMenuOpen(false)} 
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />
        
        <div className="flex-grow bg-[rgb(var(--background))]">
          <Breadcrumbs />
          <main className="min-h-screen">
            {children}
          </main>
        </div>
        
        <Footer />
      </div>
    </Providers>
  );
} 