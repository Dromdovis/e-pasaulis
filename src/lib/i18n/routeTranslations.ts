// Define supported languages
export const locales = ['en', 'lt', 'ru'] as const;
export type Locale = typeof locales[number];

// Route mapping for different languages
export const routeTranslations: Record<string, Record<Locale, string>> = {
  '/': {
    en: '/',
    lt: '/',
    ru: '/'
  },
  '/products': {
    en: '/products',
    lt: '/produktai',
    ru: '/tovary'
  },
  '/cart': {
    en: '/cart',
    lt: '/krepselis',
    ru: '/korzina'
  },
  '/profile': {
    en: '/profile',
    lt: '/profilis',
    ru: '/profil'
  },
  '/login': {
    en: '/login',
    lt: '/prisijungimas',
    ru: '/vhod'
  },
  '/register': {
    en: '/register',
    lt: '/registracija',
    ru: '/registraciya'
  },
  '/about': {
    en: '/about',
    lt: '/apie',
    ru: '/o-nas'
  },
  '/contact': {
    en: '/contact',
    lt: '/kontaktai',
    ru: '/kontakty'
  },
  '/favorites': {
    en: '/favorites',
    lt: '/megstami',
    ru: '/izbrannoe'
  },
  '/checkout': {
    en: '/checkout',
    lt: '/apmokejimas',
    ru: '/oformit-zakaz'
  },
  '/admin': {
    en: '/admin',
    lt: '/admin',
    ru: '/admin'
  },
  '/product': {
    en: '/product',
    lt: '/produktas',
    ru: '/tovar'
  },
  '/category': {
    en: '/category',
    lt: '/kategorija',
    ru: '/kategoriya'
  },
  '/search': {
    en: '/search',
    lt: '/paieska',
    ru: '/poisk'
  },
  '/settings': {
    en: '/settings',
    lt: '/nustatymai',
    ru: '/nastroyki'
  },
  '/orders': {
    en: '/orders',
    lt: '/uzsakymai',
    ru: '/zakazy'
  },
  '/faq': {
    en: '/faq',
    lt: '/duk',
    ru: '/faq'
  },
  '/returns': {
    en: '/returns',
    lt: '/grazinimai',
    ru: '/vozvrat'
  }
};

// Reverse mapping to find English route from localized route
export const reverseRouteMap: Record<Locale, Record<string, string>> = 
  Object.entries(routeTranslations).reduce((acc, [engRoute, translations]) => {
    Object.entries(translations).forEach(([locale, translatedRoute]) => {
      if (!acc[locale as Locale]) {
        acc[locale as Locale] = {};
      }
      acc[locale as Locale][translatedRoute] = engRoute;
    });
    return acc;
  }, {} as Record<Locale, Record<string, string>>);

/**
 * Translates a path to the target language
 * @param path Current path
 * @param targetLocale Target locale
 * @param currentLocale Current locale
 * @returns Translated path
 */
export function translatePath(path: string, targetLocale: Locale, currentLocale: Locale = 'en'): string {
  // Handle paths with query parameters
  const [pathWithoutQuery, query] = path.split('?');
  const queryString = query ? `?${query}` : '';
  
  // If path starts with locale, remove it
  let cleanPath = pathWithoutQuery;
  for (const locale of locales) {
    if (cleanPath.startsWith(`/${locale}/`)) {
      cleanPath = cleanPath.substring(3); // Remove the locale prefix
      break;
    } else if (cleanPath === `/${locale}`) {
      cleanPath = '/';
      break;
    }
  }
  
  // First, try to find the English equivalent of the current path
  let englishPath = cleanPath;
  
  // If we're not already in English, look up the English equivalent
  if (currentLocale !== 'en') {
    // Check if we have a direct mapping for this path
    const reverseMappings = reverseRouteMap[currentLocale];
    if (reverseMappings && reverseMappings[cleanPath]) {
      englishPath = reverseMappings[cleanPath];
    } else {
      // Handle dynamic routes by checking path segments
      const segments = cleanPath.split('/').filter(Boolean);
      const mappedSegments = segments.map(segment => {
        // Check if this segment has a mapping
        if (reverseMappings && reverseMappings[`/${segment}`]) {
          return reverseMappings[`/${segment}`].substring(1); // Remove leading slash
        }
        return segment;
      });
      englishPath = `/${mappedSegments.join('/')}`;
    }
  }
  
  // Now translate the English path to the target locale
  if (targetLocale === 'en') {
    return `/${targetLocale}${englishPath}${queryString}`;
  }
  
  // Check if we have a direct mapping for this path
  if (routeTranslations[englishPath] && routeTranslations[englishPath][targetLocale]) {
    return `/${targetLocale}${routeTranslations[englishPath][targetLocale]}${queryString}`;
  }
  
  // Handle dynamic routes by checking path segments
  const segments = englishPath.split('/').filter(Boolean);
  const translatedSegments = segments.map(segment => {
    // Check if this segment has a mapping
    if (routeTranslations[`/${segment}`] && routeTranslations[`/${segment}`][targetLocale]) {
      return routeTranslations[`/${segment}`][targetLocale].substring(1); // Remove leading slash
    }
    return segment;
  });
  
  return `/${targetLocale}/${translatedSegments.join('/')}${queryString}`;
}

/**
 * Gets the canonical path for SEO purposes
 * @param path Current path including locale
 * @returns Path with 'en' locale for canonical URL
 */
export function getCanonicalPath(path: string): string {
  // Extract the locale and the rest of the path
  const match = path.match(/^\/([a-z]{2})(.*)$/);
  if (!match) return path;
  
  const [, locale, restOfPath] = match;
  
  // If already English, return as is
  if (locale === 'en') return path;
  
  // Otherwise, translate to English
  return translatePath(restOfPath, 'en', locale as Locale);
} 