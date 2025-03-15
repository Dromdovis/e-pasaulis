// src/types/index.ts
export interface Category {
  id: string;
  name_en: string;
  name_lt: string;
  name_ru: string;
  description_en: string;
  description_lt: string;
  description_ru: string;
  slug: string;
  created: string;
  updated: string;
}

export type ProductType = 'physical' | 'digital';

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
  productType: ProductType;
  url?: string;
  image_url?: string;
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
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
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

// Add PocketBase types
export interface PocketBaseOptions {
  $cancelKey?: string;
  requestKey?: string | null;
}