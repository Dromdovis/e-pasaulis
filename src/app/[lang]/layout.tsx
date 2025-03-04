import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';
import RootLayoutClient from '../RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  return {
    title: {
      template: '%s | E-Pasaulis',
      default: 'E-Pasaulis - Your Electronics Store',
    },
    description: 'E-Pasaulis - Your one-stop shop for electronics',
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default function RootLayout({ children, params: { lang } }: RootLayoutProps) {
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
} 