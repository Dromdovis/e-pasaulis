import { translations } from './translations';

// Get the type of the English translations object
type EnTranslations = typeof translations.en;

// Create a type that ensures all translations have the same structure
export type Translations = EnTranslations;

// Function to get all possible nested keys as string literals
type PathsToStringProps<T> = T extends string ? [] : {
  [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

type Join<T extends any[], D extends string> =
  T extends [] ? never :
  T extends [infer F] ? F :
  T extends [infer F, ...infer R] ? F extends string ? `${F}${D}${Join<R, D>}` : never : never;

// Export the translation key type that supports nested access with dot notation
export type TranslationKey = keyof EnTranslations | Join<PathsToStringProps<EnTranslations>, '.'>;

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

export type Language = 'en' | 'lt' | 'ru'; 