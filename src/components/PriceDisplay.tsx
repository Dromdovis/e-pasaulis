// src/components/PriceDisplay.tsx
import { formatPrice } from "@/lib/formatters";

interface PriceDisplayProps {
  price: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCurrency?: boolean;
}

export default function PriceDisplay({ 
  price, 
  className = '', 
  size = 'md',
  showCurrency = true 
}: PriceDisplayProps) {
  if (typeof price !== 'number') {
    return null;
  }
  
  const { whole, decimal } = formatPrice(price);
  
  // Size-based styling
  const sizeClasses = {
    sm: 'text-sm',
    md: '',
    lg: 'text-lg'
  };
  
  return (
    <span className={`inline-flex items-start font-semibold dark:text-white ${sizeClasses[size]} ${className}`}>
      {`${whole}.`}
      <span className="text-[0.65em] font-normal leading-3 mt-1 dark:text-gray-300">
        {decimal}
      </span>
      {showCurrency && <span className="ml-1">€</span>}
    </span>
  );
}