export interface Review {
  id: string;
  user: string;  // Reference to users collection
  product: string;  // Reference to products collection
  rating: number;  // 1-5 stars
  comment: string;
  created: string;
  updated: string;
} 