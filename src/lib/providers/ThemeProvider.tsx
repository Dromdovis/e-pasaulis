'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use suppressHydrationWarning to prevent hydration mismatch errors
  // This component ensures client-side only rendering of theme
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div suppressHydrationWarning>
        {children}
      </div>
    </NextThemesProvider>
  );
}

export { useTheme } from 'next-themes'; 