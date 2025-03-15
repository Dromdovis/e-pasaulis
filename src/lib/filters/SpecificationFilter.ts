import { Product } from '@/types';

/**
 * Extract unique specifications from products
 * @param products List of products to extract specifications from
 * @returns Object with specification names as keys and arrays of unique values as values
 */
export function extractUniqueSpecifications(products: Product[]): Record<string, string[]> {
  const specs: Record<string, Set<string>> = {};
  
  // Process each product
  products.forEach(product => {
    if (!product.specifications) return;
    
    // Process each specification in the product
    Object.entries(product.specifications).forEach(([key, value]) => {
      // Skip if value is null, undefined, or empty string
      if (value === null || value === undefined || value === '') return;
      
      // Convert value to string
      const stringValue = String(value).trim();
      if (!stringValue) return;
      
      // Initialize set if it doesn't exist
      if (!specs[key]) {
        specs[key] = new Set<string>();
      }
      
      // Add value to set (automatically handles uniqueness)
      specs[key].add(stringValue);
    });
  });
  
  // Convert sets to sorted arrays
  const result: Record<string, string[]> = {};
  Object.entries(specs).forEach(([key, valueSet]) => {
    result[key] = Array.from(valueSet).sort((a, b) => {
      // Try to sort numerically if possible
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      // Fall back to alphabetical sort
      return a.localeCompare(b);
    });
  });
  
  return result;
}

/**
 * Filter products by specifications
 * @param products List of products to filter
 * @param specFilters Object with specification names as keys and arrays of selected values as values
 * @returns Filtered products
 */
export function filterProductsBySpecifications(
  products: Product[],
  specFilters: Record<string, string[]>
): Product[] {
  // Return all products if no filters are applied
  if (Object.keys(specFilters).length === 0) {
    return products;
  }
  
  return products.filter(product => {
    // If product doesn't have specifications, exclude it
    if (!product.specifications) return false;
    
    // Check each filter
    return Object.entries(specFilters).every(([specName, selectedValues]) => {
      // Skip if no values are selected
      if (!selectedValues || selectedValues.length === 0) return true;
      
      // Check if the product has this specification
      const productValue = product.specifications[specName];
      if (productValue === undefined || productValue === null) return false;
      
      // Convert product value to string
      const productValueStr = String(productValue).trim();
      
      // Check if product value is in the selected values
      return selectedValues.includes(productValueStr);
    });
  });
} 