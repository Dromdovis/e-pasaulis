// src/lib/formatters.ts
export function formatPrice(price: number): { whole: string; decimal: string } {
    const [whole, decimal = '00'] = price.toFixed(2).split('.');
    return {
      whole,
      decimal: decimal.padEnd(2, '0')
    };
  }