import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  lt: () => import('@/dictionaries/lt.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof dictionaries[Locale]>>;

export const getDictionary = async (locale: Locale) => {
  try {
    return dictionaries[locale]();
  } catch {
    // Fallback to English if the requested locale is not available
    return dictionaries.en();
  }
}; 