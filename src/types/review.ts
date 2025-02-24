export interface Review {
  id: string;
  user_id: string;  // Reference to users collection
  product_id: string;  // Reference to products collection
  rating: number;  // 1-5 stars
  comment: string;
  created: string;
  updated: string;
  expand?: {
    user_id?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
} 