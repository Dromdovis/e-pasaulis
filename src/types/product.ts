import { BaseModel } from 'pocketbase';

export interface Product extends BaseModel {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
  created: string;
  updated: string;
  specifications: Record<string, string | number | boolean>;
  stock?: number;
  getType?: () => string;
  validateSpecs?: () => boolean;
} 