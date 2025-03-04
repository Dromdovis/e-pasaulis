// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb } from './db'
import { RecordModel } from 'pocketbase'
import type { Product } from '@/types/product'

export interface CartItem extends Product {
  id: string;
  quantity: number;
}

interface CartRecord extends RecordModel {
  user: string;
  products: CartItem[];
}

interface FavoritesRecord extends RecordModel {
  user: string;
  products: string[];
}

export interface StoreState {
  cart: CartItem[];
  favorites: Product[];
  isInitialized: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  clearLocalData: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
}

export interface RootState {
  cart: Product[];
  favorites: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set: (state: Partial<StoreState>) => void, get: () => StoreState) => ({
      cart: [],
      favorites: [],
      isInitialized: false,

      // Add updateQuantity action
      updateQuantity: async (productId: string, quantity: number) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        const newCart = cart.map((item: CartItem) => 
          item.id === productId 
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        );

        set({ cart: newCart });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`
            );
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: newCart
              });
            }
          } catch (error) {
            set({ cart });
            throw error;
          }
        }
      },

      addToCart: async (product: Product) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        const cartItem: CartItem = { ...product, quantity: 1 };
        
        set({ cart: [...cart, cartItem] });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`
            );
            
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: [...cart, cartItem]
              });
            } else {
              await pb.collection('carts').create({
                user: pb.authStore.model.id,
                products: [...cart, cartItem]
              });
            }
          } catch (error) {
            console.error('Failed to sync cart with server:', error);
          }
        }
      },

      removeFromCart: async (productId: string) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        const newCart = cart.filter((item: CartItem) => item.id !== productId);
        
        set({ cart: newCart });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`
            );
            
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: newCart
              });
            }
          } catch (error) {
            console.error('Failed to sync cart with server:', error);
          }
        }
      },

      toggleFavorite: async (productId: string) => {
        const { favorites } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        const isFavorite = favorites.some((item: Product) => item.id === productId);
        const newFavorites = isFavorite 
          ? favorites.filter((item: Product) => item.id !== productId)
          : [...favorites, { id: productId } as Product];

        set({ favorites: newFavorites });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('favorites').getFirstListItem<FavoritesRecord>(
              `user="${pb.authStore.model.id}"`
            );

            if (record) {
              await pb.collection('favorites').update(record.id, {
                products: newFavorites.map(item => item.id)
              });
            } else {
              await pb.collection('favorites').create({
                user: pb.authStore.model.id,
                products: newFavorites.map(item => item.id)
              });
            }
          } catch (error) {
            set({ favorites });
            throw error;
          }
        }
      },

      syncWithServer: async () => {
        const userId = pb.authStore.model?.id;
        if (!pb.authStore.isValid || !userId) return;

        try {
          const [cartData, favoritesData] = await Promise.all([
            pb.collection('carts').getFirstListItem<CartRecord>(`user="${userId}"`).catch(() => null),
            pb.collection('favorites').getFirstListItem<FavoritesRecord>(`user="${userId}"`).catch(() => null)
          ]);

          if (!cartData) {
            await pb.collection('carts').create<CartRecord>({
              user: userId,
              products: []
            });
          }

          if (!favoritesData) {
            await pb.collection('favorites').create<FavoritesRecord>({
              user: userId,
              products: []
            });
          }

          set({
            cart: cartData?.products || [],
            favorites: favoritesData?.products.map(id => ({ id } as Product)) || [],
            isInitialized: true
          });
        } catch (error) {
          console.error('Failed to sync with server:', error);
        }
      },

      clearLocalData: () => {
        set({ cart: [], favorites: [], isInitialized: false });
      },

      addToFavorites: (product: Product) => {
        const { favorites } = get();
        set({ favorites: [...favorites, product] });
      },

      removeFromFavorites: (productId: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((item: Product) => item.id !== productId) });
      }
    }),
    {
      name: 'store-storage',
      partialize: (state: StoreState) => ({
        cart: state.cart,
        favorites: state.favorites,
        isInitialized: state.isInitialized
      })
    }
  )
);