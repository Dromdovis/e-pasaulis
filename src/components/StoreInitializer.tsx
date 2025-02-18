// src/components/StoreInitializer.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useStore, StoreState } from '@/lib/store';
import { pb } from '@/lib/db';

export default function StoreInitializer() {
  const initialized = useRef(false);
  const { syncWithServer, clearLocalData } = useStore();

  useEffect(() => {
    if (!initialized.current) {
      if (pb.authStore.isValid) {
        syncWithServer();
      }
      initialized.current = true;
    }

    // Properly typed listener function
    const authListener = async () => {
      if (pb.authStore.isValid) {
        await syncWithServer();
      } else {
        clearLocalData();
      }
    };

    // Add listener
    pb.authStore.onChange(authListener);

    // Remove listener on cleanup
    return () => {
      pb.authStore.onChange(() => {});
    };
  }, [syncWithServer, clearLocalData]);

  return null;
}