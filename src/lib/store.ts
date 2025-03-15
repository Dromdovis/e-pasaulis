// src/lib/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb } from './db'
import { RecordModel } from 'pocketbase'
import type { Product } from '@/types/product'
import { useAuth } from './auth'

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
  favoriteProducts: Product[];
  isInitialized: boolean;
  isServerSynced: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  clearLocalData: () => void;
  clearCart: () => Promise<void>;
  setFavoriteProducts: (products: Product[]) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set: (state: Partial<StoreState>) => void, get: () => StoreState) => ({
      cart: [],
      favorites: [],
      favoriteProducts: [],
      isInitialized: false,
      isServerSynced: false,

      addToCart: async (productId: string, quantity: number = 1) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.productId === productId);
        
        let newCart: CartItem[];
        if (existingItem) {
          // Update quantity if item exists
          newCart = cart.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item if it doesn't exist
          newCart = [...cart, { productId, quantity }];
        }
        
        set({ cart: newCart });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            let record;
            try {
              record = await pb.collection('carts').getFirstListItem<CartRecord>(
                `user="${pb.authStore.model.id}"`,
                { requestKey: null }
              );
            } catch {
              // Create new cart if none exists
              record = await pb.collection('carts').create({
                user: pb.authStore.model.id,
                products: newCart
              });
              return;
            }
            
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

      updateQuantity: async (productId: string, quantity: number) => {
        const { cart } = get();
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          return get().removeFromCart(productId);
        }
        
        const newCart = cart.map((item) => 
          item.productId === productId 
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        );

        set({ cart: newCart });

        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`,
              { requestKey: null }
            ).catch(() => null);
            
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: newCart
              });
            } else {
              await pb.collection('carts').create({
                user: pb.authStore.model.id,
                products: newCart
              });
            }
          } catch (error) {
            console.error('Failed to sync cart quantity with server:', error);
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
              `user="${pb.authStore.model.id}"`,
              { requestKey: null }
            ).catch(() => null);
            
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: newCart
              });
            }
          } catch (error) {
            console.error('Failed to sync cart removal with server:', error);
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
              await pb.collection('favorites').update(record.id, {
                products: newFavorites
              });
            } else {
              await pb.collection('favorites').create({
                user: pb.authStore.model.id,
                products: newFavorites
              });
            }
          } catch (error) {
            console.error('Failed to sync favorites with server:', error);
          }
        }
      },

      syncWithServer: async () => {
        const userId = pb.authStore.model?.id;
        if (!pb.authStore.isValid || !userId) {
          set({ isServerSynced: true });
          return;
        }

        try {
          // Get cart and favorites from server with unique request keys to prevent auto cancellation
          const [cartData, favoritesData] = await Promise.all([
            pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${userId}"`,
              { requestKey: null }
            ).catch(() => null),
            pb.collection('favorites').getFirstListItem<FavoritesRecord>(
              `user="${userId}"`,
              { requestKey: null }
            ).catch(() => null)
          ]);

          // Create cart and favorites records if they don't exist
          if (!cartData) {
            const currentCart = get().cart;
            await pb.collection('carts').create({
              user: userId,
              products: currentCart.length > 0 ? currentCart : []
            });
          } else {
            // If server cart exists, prefer it over local cart
            set({ cart: cartData.products || [] });
          }

          if (!favoritesData) {
            const currentFavorites = get().favorites;
            await pb.collection('favorites').create({
              user: userId,
              products: currentFavorites.length > 0 ? currentFavorites : []
            });
          } else {
            // If server favorites exist, prefer them over local favorites
            set({ favorites: favoritesData.products || [] });
          }

          set({ isInitialized: true, isServerSynced: true });
        } catch (error) {
          console.error('Failed to sync with server:', error);
          set({ isServerSynced: true }); // Mark as synced even on error to prevent infinite retries
        }
      },

      clearLocalData: () => {
        set({ 
          cart: [], 
          favorites: [], 
          favoriteProducts: [],
          isInitialized: false,
          isServerSynced: false
        });
      },
      
      clearCart: async () => {
        const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.id;
        
        // Clear cart locally
        set({ cart: [] });
        
        // Clear cart on server if user is authenticated
        if (isAuthenticated && pb.authStore.model?.id) {
          try {
            const record = await pb.collection('carts').getFirstListItem<CartRecord>(
              `user="${pb.authStore.model.id}"`,
              { requestKey: null }
            ).catch(() => null);
            
            if (record) {
              await pb.collection('carts').update(record.id, {
                products: []
              });
            }
          } catch (error) {
            console.error('Failed to clear cart on server:', error);
          }
        }
      },
      
      setFavoriteProducts: (products: Product[]) => {
        set({ favoriteProducts: products });
      }
    }),
    {
      name: 'e-pasaulis-store',
      partialize: (state: StoreState) => ({
        cart: state.cart,
        favorites: state.favorites,
        favoriteProducts: state.favoriteProducts
      })
    }
  )
);

// Observer for auth state changes to sync cart with server
// This automatically syncs the cart with the server when the user logs in
export const initStoreAuthObserver = () => {
  // Run once at startup
  const syncWithAuth = async () => {
    const auth = useAuth.getState();
    const store = useStore.getState();
    
    if (auth.isAuthenticated && !store.isServerSynced) {
      await store.syncWithServer();
    } else if (!auth.isAuthenticated && store.isServerSynced) {
      // Clear cart data when user logs out
      store.clearLocalData();
    }
  };
  
  // Subscribe to auth changes
  useAuth.subscribe((state) => {
    if (state.isAuthenticated) {
      useStore.getState().syncWithServer();
    } else {
      useStore.getState().clearLocalData();
    }
  });
  
  // Initial sync
  syncWithAuth();
  
  return { syncWithAuth };
};