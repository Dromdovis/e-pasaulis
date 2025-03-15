import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers';
import RootLayoutClient from '../RootLayoutClient';
import { getPageMetadata, getAlternateLanguageLinks } from '@/lib/i18n/metadata';
import { locales, type Locale } from '@/lib/i18n/routeTranslations';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const { lang } = params;
  
  // Get default metadata for the homepage
  const metadata = getPageMetadata('/', lang);
  
  // Get alternate language links for SEO
  const alternateLanguages = getAlternateLanguageLinks('/', lang)
    .reduce((acc, { locale, url }) => {
      acc[locale] = url;
      return acc;
    }, {} as Record<string, string>);
  
  return {
    title: {
      template: '%s | E-Pasaulis',
      default: metadata.title,
    },
    description: metadata.description,
    alternates: {
      canonical: `/${lang}`,
      languages: alternateLanguages,
    },
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