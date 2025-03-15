'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthStoreProvider } from '@/lib/auth/AuthStoreProvider';
import { ToastProvider } from '@/lib/providers/ToastProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthStoreProvider>
            <ToastProvider>
              {children}
              <Toaster position="bottom-right" />
            </ToastProvider>
          </AuthStoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
// Export non-wrapped version for internal use 