import { getPageMetadata, getAlternateLanguageLinks } from '@/lib/i18n/metadata';
import { type Locale } from '@/lib/i18n/routeTranslations';
import { Metadata } from 'next';

/**
 * Generate metadata for a specific page with proper internationalization
 * @param path Current path without locale prefix
 * @param locale Current locale
 * @param additionalMetadata Additional metadata to merge with the default
 * @returns Metadata object for Next.js
 */
export function generateInternationalizedMetadata(
  path: string,
  locale: Locale,
  additionalMetadata?: Partial<Metadata>
): Metadata {
  // Get the base metadata for this page and locale
  const baseMetadata = getPageMetadata(path, locale);
  
  // Get alternate language links for SEO
  const alternateLanguages = getAlternateLanguageLinks(path, locale)
    .reduce((acc, { locale, url }) => {
      acc[locale] = url;
      return acc;
    }, {} as Record<string, string>);
  
  // Merge with the base metadata
  const metadata: Metadata = {
    title: baseMetadata.title,
    description: baseMetadata.description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: baseMetadata.title,
      description: baseMetadata.description,
      url: `/${locale}${path}`,
      locale,
      alternateLocale: Object.keys(alternateLanguages) as Locale[],
      siteName: 'E-Pasaulis',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseMetadata.title,
      description: baseMetadata.description,
    },
    ...additionalMetadata,
  };
  
  return metadata;
}

/**
 * Generate structured data for products (JSON-LD)
 * @param product Product data
 * @param locale Current locale
 * @returns JSON-LD script element as string
 */
export function generateProductStructuredData(product: any, locale: Locale): string {
  if (!product) return '';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images[0] : undefined,
    sku: product.sku || product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `/${locale}/product/${product.id}`,
    },
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
  };
  
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 * @param breadcrumbs Breadcrumb items with name and url
 * @param locale Current locale
 * @returns JSON-LD script element as string
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>,
  locale: Locale
): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `/${locale}${breadcrumb.url}`,
    })),
  };
  
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
} 