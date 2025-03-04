import { translations } from './translations';

// Get the type of the English translations object
type EnTranslations = typeof translations.en;

// Create a type that ensures all translations have the same structure
export interface Translations extends EnTranslations {
  // This ensures all translations must have the same keys as the English translations
}

// Export the translation key type
export type TranslationKey = keyof EnTranslations;

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

export type Language = 'en' | 'lt'; 