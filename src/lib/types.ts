export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  specifications: Record<string, string>;
  collectionId: string;
  collectionName: string;
} 