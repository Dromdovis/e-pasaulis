'use client';

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="container mx-auto p-4">
      {children}
    </div>
  );
} 