// src/components/StoreInitializer.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export default function StoreInitializer() {
  const initialized = useRef(false);
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
    if (!initialized.current) {
      if (pb.authStore.isValid && checkTokenExpiration()) {
        setTimeout(() => {
          syncWithServer().catch(error => {
            console.error('Failed to sync with server:', error);
            if (error?.status === 0) {
              clearLocalData();
            }
          });
        }, 100);
      }
      initialized.current = true;
    }

    const authListener = async () => {
      try {
        if (pb.authStore.isValid) {
          localStorage.setItem('auth_timestamp', Date.now().toString());
          await syncWithServer();
        } else {
          clearLocalData();
          localStorage.removeItem('auth_timestamp');
        }
      } catch (error) {
        console.error('Auth listener error:', error);
        clearLocalData();
      }
    };

    pb.authStore.onChange(authListener);

    return () => {
      pb.authStore.onChange(() => {});
    };
  }, [syncWithServer, clearLocalData]);

  return null;
}