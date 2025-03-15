'use client';

import { ReactNode, useState } from 'react';
import { Inter } from 'next/font/google';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { RegisterBanner } from '@/components/RegisterBanner';
import AuthInitializer from '@/components/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutClientProps {
  children: ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  return (
    <>
      <AuthInitializer />
      <Navbar 
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={handleMobileMenuClose}
        onMobileMenuOpen={handleMobileMenuOpen}
      />
      <div className="container mx-auto px-4 py-2">
        <Breadcrumbs />
      </div>
      <PageLayout>
        <main className={inter.className}>{children}</main>
      </PageLayout>
      <RegisterBanner />
      <Footer />
    </>
  );
} 