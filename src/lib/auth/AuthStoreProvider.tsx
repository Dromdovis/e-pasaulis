'use client';

import { ReactNode, useEffect } from 'react';
import { initStoreAuthObserver } from '@/lib/store';

interface AuthStoreProviderProps {
  children: ReactNode;
}

/**
 * Provider that initializes the store auth observer to sync cart and favorites with authentication state.
 * This ensures that:
 * 1. Cart data is synced with the server when user logs in
 * 2. Cart data is cleared when user logs out
 * 3. Both auth and cart state stay in sync
 */
export function AuthStoreProvider({ children }: AuthStoreProviderProps) {
  useEffect(() => {
    // Initialize the auth-store observer only on the client side
    const { syncWithAuth } = initStoreAuthObserver();
    
    // Initial sync
    syncWithAuth();
    
    // No cleanup needed as the observer is already attached in initStoreAuthObserver
  }, []);

  return <>{children}</>;
} 