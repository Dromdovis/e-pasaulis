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
} 