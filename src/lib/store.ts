// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb } from './db'
import { RecordModel } from 'pocketbase'

export interface CartItem {
  productId: string;
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
  favorites: string[];
  isInitialized: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  clearLocalData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      isInitialized: false,

      // Add updateQuantity action
      updateQuantity: async (productId: string, quantity: number) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        const newCart = cart.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        );

        set({ cart: newCart });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`
            );
            await pb.collection('carts').update<CartRecord>(record.id, {
              products: newCart
            });
          } catch (error) {
            set({ cart });
            throw error;
          }
        }
      },



     addToCart: async (productId: string) => {
       const { cart } = get();
       const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
       const existingItem = cart.find(item => item.productId === productId);
       
       const newCart = existingItem 
         ? cart.map(item => 
             item.productId === productId 
               ? { ...item, quantity: item.quantity + 1 }
               : item
           )
         : [...cart, { productId, quantity: 1 }];

       set({ cart: newCart });

       if (isAuthenticated && pb.authStore.model?.id) {
         try {
           const record = await pb.collection('carts').getFirstListItem<CartRecord>(
             `user="${pb.authStore.model.id}"`
           ).catch(() => null);

           if (record) {
             await pb.collection('carts').update<CartRecord>(record.id, {
               products: newCart
             });
           } else {
             await pb.collection('carts').create<CartRecord>({
               user: pb.authStore.model.id,
               products: newCart
             });
           }
         } catch (error) {
           set({ cart });
           throw error;
         }
       }
     },

     removeFromCart: async (productId: string) => {
       const { cart } = get();
       const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
       const newCart = cart.filter(item => item.productId !== productId);

       set({ cart: newCart });

       if (isAuthenticated && pb.authStore.model?.id) {
         try {
           const record = await pb.collection('carts').getFirstListItem<CartRecord>(
             `user="${pb.authStore.model.id}"`
           );
           await pb.collection('carts').update<CartRecord>(record.id, {
             products: newCart
           });
         } catch (error) {
           set({ cart });
           throw error;
         }
       }
     },

     toggleFavorite: async (productId: string) => {
       const { favorites } = get();
       const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
       const isFavorite = favorites.includes(productId);
       const newFavorites = isFavorite 
         ? favorites.filter(id => id !== productId)
         : [...favorites, productId];

       set({ favorites: newFavorites });

       if (isAuthenticated && pb.authStore.model?.id) {
         try {
           const record = await pb.collection('favorites').getFirstListItem<FavoritesRecord>(
             `user="${pb.authStore.model.id}"`
           ).catch(() => null);

           if (record) {
             await pb.collection('favorites').update<FavoritesRecord>(record.id, {
               products: newFavorites
             });
           } else {
             await pb.collection('favorites').create<FavoritesRecord>({
               user: pb.authStore.model.id,
               products: newFavorites
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
           favorites: favoritesData?.products || [],
           isInitialized: true
         });
       } catch (error) {
         console.error('Failed to sync with server:', error);
       }
     },

     clearLocalData: () => {
       set({ cart: [], favorites: [], isInitialized: false });
     }
   }),
   {
    name: 'e-shop-storage',
    partialize: (state) => ({ cart: state.cart, favorites: state.favorites })
   }
 )
);