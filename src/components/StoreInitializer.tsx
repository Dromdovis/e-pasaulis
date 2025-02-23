// src/components/StoreInitializer.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import { validateAuthState } from '@/lib/auth';

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

interface SyncError {
  status?: number;
  message?: string;
}

export default function StoreInitializer() {
  const initialized = useRef(false);
  const syncInProgress = useRef(false);
  const { syncWithServer, clearLocalData } = useStore();

  const checkTokenExpiration = () => {
    const tokenTimestamp = localStorage.getItem('auth_timestamp');
    if (!tokenTimestamp) {
      localStorage.setItem('auth_timestamp', Date.now().toString());
      return true;
    }

    const elapsed = Date.now() - parseInt(tokenTimestamp);
    if (elapsed > TOKEN_EXPIRY_TIME) {
      pb.authStore.clear();
      localStorage.removeItem('auth_timestamp');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let isSubscribed = true;

    const handleSync = async () => {
      if (syncInProgress.current) return;
      syncInProgress.current = true;

      try {
        if (!pb.authStore.isValid) {
          clearLocalData();
          localStorage.removeItem('auth_timestamp');
          return;
        }

        const isValid = await validateAuthState();
        if (!isValid) {
          pb.authStore.clear();
          clearLocalData();
          localStorage.removeItem('auth_timestamp');
          return;
        }

        if (checkTokenExpiration()) {
          await syncWithServer();
          if (isSubscribed) {
            localStorage.setItem('auth_timestamp', Date.now().toString());
          }
        }
      } catch (error) {
        console.error('Store sync error:', error);
        if ((error as SyncError).status === 0) {
          clearLocalData();
        }
      } finally {
        syncInProgress.current = false;
      }
    };

    // Initial sync
    if (!initialized.current && pb.authStore.isValid) {
      handleSync();
      initialized.current = true;
    }

    // Set up auth change listener
    const authListener = () => {
      if (isSubscribed && !syncInProgress.current) {
        handleSync();
      }
    };

    pb.authStore.onChange(authListener);

    return () => {
      isSubscribed = false;
      pb.authStore.onChange(() => {});
    };
  }, [syncWithServer, clearLocalData]);

  return null;
}