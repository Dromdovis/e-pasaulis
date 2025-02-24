'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle token refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (pb.authStore.isValid) {
        try {
          await pb.collection('users').authRefresh();
        } catch (error) {
          logout();
        }
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return authData;
    },
    onSuccess: (data) => {
      setUser(data.record);
      setIsAuthenticated(true);
    }
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const checkAuth = async () => {
    const isValid = pb.authStore.isValid;
    setIsAuthenticated(isValid);
    if (isValid) {
      setUser(pb.authStore.model);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
} 