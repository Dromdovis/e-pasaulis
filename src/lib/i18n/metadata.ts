import { Locale } from './routeTranslations';

// Define metadata translations for each page by locale
interface PageMetadata {
  title: string;
  description: string;
}

type MetadataTranslations = Record<string, Record<Locale, PageMetadata>>;

export const metadataTranslations: MetadataTranslations = {
  // Home page
  '/': {
    en: {
      title: 'E-Pasaulis - Your Electronics Store',
      description: 'Shop for the latest electronics, computers, phones, and tech accessories with free shipping and great customer service.',
    },
    lt: {
      title: 'E-Pasaulis - Jūsų elektronikos parduotuvė',
      description: 'Įsigykite naujausią elektroniką, kompiuterius, telefonus ir technikos priedus su nemokamu pristatymu ir puikiu klientų aptarnavimu.',
    },
    ru: {
      title: 'E-Pasaulis - Ваш магазин электроники',
      description: 'Покупайте новейшую электронику, компьютеры, телефоны и технические аксессуары с бесплатной доставкой и отличным обслуживанием клиентов.',
    }
  },
  // Products page
  '/products': {
    en: {
      title: 'All Products | E-Pasaulis',
      description: 'Browse our complete catalog of electronics, computers, phones, and tech accessories.',
    },
    lt: {
      title: 'Visi produktai | E-Pasaulis',
      description: 'Naršykite mūsų pilną elektronikos, kompiuterių, telefonų ir technikos priedų katalogą.',
    },
    ru: {
      title: 'Все товары | E-Pasaulis',
      description: 'Просмотрите наш полный каталог электроники, компьютеров, телефонов и технических аксессуаров.',
    }
  },
  // Cart page
  '/cart': {
    en: {
      title: 'Your Cart | E-Pasaulis',
      description: 'Review the items in your shopping cart and proceed to checkout.',
    },
    lt: {
      title: 'Jūsų krepšelis | E-Pasaulis',
      description: 'Peržiūrėkite prekes savo pirkinių krepšelyje ir pereikite prie apmokėjimo.',
    },
    ru: {
      title: 'Ваша корзина | E-Pasaulis',
      description: 'Просмотрите товары в вашей корзине и перейдите к оформлению заказа.',
    }
  },
  // Login page
  '/login': {
    en: {
      title: 'Login to Your Account | E-Pasaulis',
      description: 'Sign in to your E-Pasaulis account to access your orders, wishlist, and more.',
    },
    lt: {
      title: 'Prisijungti prie paskyros | E-Pasaulis',
      description: 'Prisijunkite prie savo E-Pasaulis paskyros, kad galėtumėte pasiekti užsakymus, norų sąrašą ir daugiau.',
    },
    ru: {
      title: 'Вход в учетную запись | E-Pasaulis',
      description: 'Войдите в свою учетную запись E-Pasaulis, чтобы получить доступ к заказам, списку желаний и многому другому.',
    }
  },
  // Register page
  '/register': {
    en: {
      title: 'Create an Account | E-Pasaulis',
      description: 'Sign up for an E-Pasaulis account to enjoy faster checkout, order tracking, and exclusive offers.',
    },
    lt: {
      title: 'Sukurti paskyrą | E-Pasaulis',
      description: 'Užsiregistruokite E-Pasaulis paskyrą, kad galėtumėte greičiau atsiskaityti, sekti užsakymus ir gauti išskirtinių pasiūlymų.',
    },
    ru: {
      title: 'Создать учетную запись | E-Pasaulis',
      description: 'Зарегистрируйтесь в E-Pasaulis, чтобы ускорить оформление заказа, отслеживать заказы и получать эксклюзивные предложения.',
    }
  },
  // About page
  '/about': {
    en: {
      title: 'About Us | E-Pasaulis',
      description: 'Learn about E-Pasaulis, our mission, and commitment to providing quality electronics.',
    },
    lt: {
      title: 'Apie mus | E-Pasaulis',
      description: 'Sužinokite apie E-Pasaulis, mūsų misiją ir įsipareigojimą teikti kokybišką elektroniką.',
    },
    ru: {
      title: 'О нас | E-Pasaulis',
      description: 'Узнайте о E-Pasaulis, нашей миссии и приверженности предоставлению качественной электроники.',
    }
  },
  // Contact page
  '/contact': {
    en: {
      title: 'Contact Us | E-Pasaulis',
      description: 'Get in touch with our customer service team for questions, support, or feedback.',
    },
    lt: {
      title: 'Kontaktai | E-Pasaulis',
      description: 'Susisiekite su mūsų klientų aptarnavimo komanda dėl klausimų, pagalbos ar atsiliepimų.',
    },
    ru: {
      title: 'Свяжитесь с нами | E-Pasaulis',
      description: 'Свяжитесь с нашей службой поддержки клиентов для получения ответов на вопросы, помощи или отзывов.',
    }
  }
};

/**
 * Get translated metadata for a specific page and locale
 * @param path Current path without locale prefix
 * @param locale Current locale
 * @returns Translated metadata for the page
 */
export function getPageMetadata(path: string, locale: Locale): PageMetadata {
  // Handle dynamic routes by checking for patterns
  let metadataKey = path;
  
  // For product detail pages: /product/[id] -> /product
  if (path.match(/^\/product\/[^/]+$/)) {
    metadataKey = '/product';
  }
  
  // For category pages: /category/[id] -> /category
  if (path.match(/^\/category\/[^/]+$/)) {
    metadataKey = '/category';
  }
  
  // Get the metadata for the current path and locale
  const metadata = metadataTranslations[metadataKey]?.[locale];
  
  // If no metadata is found, return default metadata
  if (!metadata) {
    return {
      title: 'E-Pasaulis',
      description: 'Your electronics store with the best prices and service.',
    };
  }
  
  return metadata;
}

/**
 * Generate alternate language links for SEO
 * @param path Current path without locale prefix
 * @param currentLocale Current locale
 * @returns Array of alternate language links
 */
export function getAlternateLanguageLinks(path: string, currentLocale: Locale): Array<{ locale: string; url: string }> {
  return Object.keys(metadataTranslations[path] || {})
    .filter(locale => locale !== currentLocale)
    .map(locale => ({
      locale,
      url: `/${locale}${path}`,
    }));
} 