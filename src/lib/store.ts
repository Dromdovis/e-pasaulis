// src/lib/store.ts
import { create } from 'zustand'

interface CartItem {
  id: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  favorites: string[];
  addToCart: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  favorites: [],
  addToCart: (productId) => set((state) => ({
    cart: [...state.cart, { id: productId, quantity: 1 }]
  })),
  toggleFavorite: (productId) => set((state) => ({
    favorites: state.favorites.includes(productId) 
      ? state.favorites.filter(id => id !== productId)
      : [...state.favorites, productId]
  }))
}));