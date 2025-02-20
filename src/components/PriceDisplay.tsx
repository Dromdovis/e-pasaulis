// src/components/PriceDisplay.tsx
import { formatPrice } from "@/lib/formatters";


interface PriceDisplayProps {
    price: number;
    className?: string;
  }
  
  export default function PriceDisplay({ price, className = '' }: PriceDisplayProps) {
    if (typeof price !== 'number') {
      return null;
    }
    
    const { whole, decimal } = formatPrice(price);
    
    return (
      <span className={`inline-flex items-start font-semibold ${className}`}>
        {`${whole}.`}
        <span className="text-[0.65em] font-normal leading-3 mt-1">
          {decimal}
        </span>
        <span className="ml-1">€</span>
      </span>
    );
  }