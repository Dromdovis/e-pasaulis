// src/types/index.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  images: string[];
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  categoryId: string;
  category: string;
  specifications?: Record<string, string | number | boolean>;
}

export interface Favorite {
  id: string;
  product_id: string;
  user_id: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface StoreState {
  cart: CartItem[];
  favorites: string[];
  isInitialized: boolean;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleFavorite: (productId: string) => void;
  syncWithServer: () => Promise<void>;
  clearLocalData: () => void;
}

export interface Review {
  id: string;
  rating: number;
  product: string;
  user: string;
  comment: string;
  created: string;
  updated: string;
  expand?: {
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}

export type ProductRecord = Product;