import type { Product } from '@/types';

export function isProductRecord(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value &&
    typeof value.price === 'number'
  );
} 