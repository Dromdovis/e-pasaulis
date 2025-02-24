import { translations } from './translations';

// Helper type to get all nested keys
type PathsToStringProps<T> = T extends string 
  ? [] 
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
    }[Extract<keyof T, string>];

// Get all possible paths
type Join<T extends string[], D extends string> = T extends [] 
  ? never 
  : T extends [infer F] 
  ? F 
  : T extends [infer F, ...infer R] 
  ? F extends string 
    ? `${F}${D}${Join<Extract<R, string[]>, D>}` 
    : never 
  : string;

// Final type that includes both direct keys and nested keys
export type TranslationKey = keyof typeof translations.en | 
  Join<PathsToStringProps<typeof translations.en>, '.'>;

// Define the translations type as a Record instead of a mapped type
export type Translations = Record<TranslationKey, string>; 