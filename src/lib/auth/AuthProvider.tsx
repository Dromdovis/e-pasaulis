'use client';

import { ReactNode } from 'react';
import { useAuth as useZustandAuth } from '@/lib/auth';

/**
 * DEPRECATED: This AuthProvider is no longer used.
 * The application now uses the Zustand-based auth store from @/lib/auth.
 * This component is kept as a passthrough to avoid breaking changes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  console.warn(
    'AuthProvider is deprecated and will be removed in a future update. ' +
    'Use the Zustand auth store from @/lib/auth instead.'
  );
  
  return <>{children}</>;
}

/**
 * DEPRECATED: Use useAuth from @/lib/auth instead.
 */
export function useAuth() {
  console.warn(
    'useAuth from AuthProvider is deprecated. ' +
    'Import useAuth from @/lib/auth instead.'
  );
  
  return useZustandAuth();
} 