'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/lib/providers/ToastProvider';
import { AuthModel, AuthState, UserRole } from '@/types/auth';
import { ClientResponseError } from 'pocketbase';
import { RecordModel } from 'pocketbase';

const AuthContext = createContext<AuthState | null>(null);

interface UserRecord extends RecordModel {
  username: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
  emailVisibility: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
    isAdmin: false,
    isInitialized: false,
    intendedPath: null,
    setIntendedPath: (path: string | null) => setState(prev => ({ ...prev, intendedPath: path })),
    initialize: async () => {
      if (state.isInitialized) return;
      await initialize();
    },
    login: async (email: string, password: string) => {
      await login(email, password);
    },
    register: async (email: string, password: string, name: string) => {
      await register(email, password, name);
    },
    logout: async () => {
      await logout();
    }
  });

  const initialize = async () => {
    try {
      if (pb.authStore.isValid && pb.authStore.model) {
        const record = await pb.collection('users').getOne<UserRecord>(pb.authStore.model.id);
        const user: AuthModel = {
          id: record.id,
          collectionId: record.collectionId,
          collectionName: record.collectionName,
          created: record.created,
          updated: record.updated,
          username: record.username || '',
          email: record.email,
          name: record.name || '',
          role: record.role as UserRole,
          verified: record.verified,
          emailVisibility: record.emailVisibility
        };
        const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user,
          error: null,
          isAdmin,
          isInitialized: true
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
          isAdmin: false,
          isInitialized: true
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        isAdmin: false,
        isInitialized: true
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword<UserRecord>(email, password);
      if (!authData.record) {
        throw new Error('No user data received');
      }
      const record = authData.record;
      const user: AuthModel = {
        id: record.id,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        created: record.created,
        updated: record.updated,
        username: record.username || '',
        email: record.email,
        name: record.name || '',
        role: record.role as UserRole,
        verified: record.verified,
        emailVisibility: record.emailVisibility
      };
      const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
        isAdmin,
        isInitialized: true
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to login')
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
        role: UserRole.USER,
        emailVisibility: true
      });
      await login(email, password);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to register')
      }));
      throw error;
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setState(prev => ({
      ...prev,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      error: null,
      isAdmin: false
    }));
    router.push('/login');
  };

  useEffect(() => {
    state.initialize();
  }, []);

  // Handle token refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (pb.authStore.isValid) {
        try {
          await pb.collection('users').authRefresh();
        } catch (error) {
          state.logout();
        }
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 