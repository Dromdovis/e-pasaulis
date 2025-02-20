// src/app/layout.tsx
import type { Metadata } from "next";
import './globals.css';
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from 'react';
import Loading from './loading';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "E-Pasaulis",
  description: "Your one-stop e-commerce solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Breadcrumbs />
            <Suspense fallback={<Loading />}>
              <main className="flex-1 container mx-auto px-4 py-6">
                {children}
              </main>
            </Suspense>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
