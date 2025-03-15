'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { pb } from '@/lib/db';

/**
 * Component that initializes authentication state on app load
 * Place this component high in the component tree
 */
export default function AuthInitializer() {
  const { initialize, isInitialized, isAuthenticated, user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Initialize auth on component mount
  useEffect(() => {
    const initAuth = async () => {
      // Avoid duplicate initialization
      if (initialized || isInitialized) return;
      
      console.log('AuthInitializer - Starting auth initialization');
      
      // Check if PocketBase already has authentication data
      if (pb.authStore.isValid && pb.authStore.model) {
        console.log('AuthInitializer - PocketBase has auth data:', {
          modelId: pb.authStore.model.id,
          isValid: pb.authStore.isValid,
        });
      } else {
        console.log('AuthInitializer - No valid PocketBase auth data');
      }
      
      // Run the auth initialization
      try {
        await initialize();
        console.log('AuthInitializer - Auth initialization complete');
      } catch (error) {
        console.error('AuthInitializer - Auth initialization failed:', error);
      }
      
      setInitialized(true);
    };
    
    initAuth();
  }, [initialize, isInitialized, initialized]);

  // Log auth state changes for debugging
  useEffect(() => {
    if (initialized) {
      console.log('AuthInitializer - Current auth state:', { 
        isInitialized, 
        isAuthenticated, 
        userId: user?.id,
        userRole: user?.role 
      });
    }
  }, [initialized, isInitialized, isAuthenticated, user]);

  // This component doesn't render anything
  return null;
} 