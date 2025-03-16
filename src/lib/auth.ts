/**
 * Authentication Module
 * 
 * This module implements the authentication system using PocketBase as the backend.
 * It follows the Singleton pattern for global auth state management and the
 * Observer pattern for state updates across the application.
 * 
 * Design Patterns:
 * - Singleton: Single auth store instance
 * - Observer: State subscription via Zustand
 * - Adapter: Converting PocketBase user to AuthModel
 */

import { create } from 'zustand';
import { pb } from './db';
import type { AuthModel, AuthState, LoginData } from '@/types/auth';
import { UserRole } from '@/types/auth';
import { persist } from 'zustand/middleware';
import { BaseModel } from 'pocketbase';
import { initiateGoogleLogin, initiateGoogleRegistration } from './auth/googleAuth';

interface PBUser extends BaseModel {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  verified: boolean;
  emailVisibility: boolean;
  created: string;
  updated: string;
}

// Secure auth timeout configuration - 5 minutes in milliseconds
const AUTH_TIMEOUT_MS = 5 * 60 * 1000;
let authTimeoutId: NodeJS.Timeout | null = null;

/**
 * Checks if code is running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Initial authentication state
 */
const getInitialState = (): Omit<AuthState, 'initialize' | 'login' | 'logout' | 'register' | 'refreshUser' | 'setIntendedPath' | 'loginWithGoogle' | 'registerWithGoogle'> => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  intendedPath: null,
  isAdmin: false,
  isInitialized: false,
  error: null
});

/**
 * Validates and normalizes user roles from PocketBase
 * @param role - Raw role string from PocketBase
 * @returns Validated UserRole enum value
 */
const validateUserRole = (role: string): UserRole => {
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
    case 'admin':
      return UserRole.ADMIN;
    case 'super_admin':
      return UserRole.SUPER_ADMIN;
    default:
      return UserRole.USER;
  }
};

/**
 * Converts PocketBase user object to our internal AuthModel
 * Implements Adapter pattern to transform between data models
 */
const convertToAuthModel = (user: PBUser): AuthModel => {
  const validatedRole = validateUserRole(user.role);
  return {
    id: user.id,
    collectionId: user.collectionId,
    collectionName: user.collectionName,
    username: user.username || '',
    email: user.email || '',
    name: user.name || '',
    role: validatedRole,
    avatar: user.avatar,
    created: user.created,
    updated: user.updated,
    verified: user.verified || false,
    emailVisibility: user.emailVisibility || false
  };
};

// Secure storage helpers for auth timeout management
function getAuthTimeout(): number | null {
  if (!isBrowser()) return null;
  
  try {
    const timeoutData = sessionStorage.getItem('auth_expiry');
    if (!timeoutData) return null;
    
    const expiryTime = parseInt(timeoutData, 10);
    if (isNaN(expiryTime)) return null;
    
    // If the expiry time has passed, return null
    if (expiryTime < Date.now()) {
      sessionStorage.removeItem('auth_expiry');
      return null;
    }
    
    return expiryTime;
  } catch (error) {
    console.error('Error reading auth timeout:', error);
    return null;
  }
}

function setAuthTimeout(): void {
  if (!isBrowser()) return;
  
  try {
    // Set expiry time to 5 minutes from now
    const expiryTime = Date.now() + AUTH_TIMEOUT_MS;
    sessionStorage.setItem('auth_expiry', expiryTime.toString());
  } catch (error) {
    console.error('Error setting auth timeout:', error);
  }
}

function clearAuthTimeout(): void {
  if (!isBrowser()) return;
  
  try {
    sessionStorage.removeItem('auth_expiry');
    if (authTimeoutId) {
      clearTimeout(authTimeoutId);
      authTimeoutId = null;
    }
  } catch (error) {
    console.error('Error clearing auth timeout:', error);
  }
}

function scheduledLogout(store: any): void {
  authTimeoutId = setTimeout(() => {
    if (pb.authStore.isValid) {
      console.log('Auth timeout reached, logging out');
      pb.authStore.clear();
      store.setState({ 
        ...getInitialState(),
        isInitialized: true 
      });
    }
  }, AUTH_TIMEOUT_MS);
}

// Modified storage helpers that don't store sensitive auth tokens
function getFromStorage(name: string): any {
  if (!isBrowser()) return null;
  
  try {
    // For auth state, check if we're within the timeout window
    if (name === 'auth-storage') {
      const expiryTime = getAuthTimeout();
      if (!expiryTime) return null;
    }
    
    // Get from sessionStorage
    const str = sessionStorage.getItem(name);
    if (str) return JSON.parse(str);
    
    return null;
  } catch (error) {
    console.error('Error retrieving state from storage:', error);
    return null;
  }
}

function setToStorage(name: string, value: any): void {
  if (!isBrowser()) return;
  
  try {
    // Store non-sensitive data only
    if (name === 'auth-storage') {
      // When storing auth state, set/reset the timeout
      setAuthTimeout();
      
      // Filter out sensitive data
      const safeValue = {
        ...value,
        // Don't store the actual token or sensitive data
        token: value.token ? true : false // Just store a boolean indicating token existence
      };
      
      const valueStr = JSON.stringify(safeValue);
      sessionStorage.setItem(name, valueStr);
    } else {
      // For non-auth storage, store normally
      const valueStr = JSON.stringify(value);
      sessionStorage.setItem(name, valueStr);
    }
  } catch (error) {
    console.error('Error saving state to storage:', error);
  }
}

function removeFromStorage(name: string): void {
  if (!isBrowser()) return;
  
  try {
    sessionStorage.removeItem(name);
    if (name === 'auth-storage') {
      clearAuthTimeout();
    }
  } catch (error) {
    console.error('Error removing state from storage:', error);
  }
}

/**
 * Global authentication store using Zustand
 * Implements Observer pattern for state management
 */
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      
      setIntendedPath: (path: string | null) => set({ intendedPath: path }),
      
      initialize: async () => {
        if (get().isInitialized) {
          console.log('Auth already initialized, skipping');
          return;
        }

        console.log('Initializing auth state...');
        try {
          set({ isLoading: true });
          
          // Check if we have a valid PocketBase auth session
          if (pb.authStore.isValid && pb.authStore.model) {
            const user = convertToAuthModel(pb.authStore.model as PBUser);
            const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
            
            set({
              isAuthenticated: true,
              user,
              isAdmin,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          } else {
            set({
              ...getInitialState(),
              isInitialized: true,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({
            ...getInitialState(),
            isInitialized: true,
            isLoading: false,
            error: 'Failed to initialize authentication'
          });
        }
      },

      login: async (data: LoginData) => {
        try {
          set({ isLoading: true });
          const authData = await pb.collection('users').authWithPassword(
            data.email,
            data.password,
            { requestKey: null }
          );
          const user = await pb.collection('users').getOne<PBUser>(authData.record.id, { requestKey: null });
          const authUser = convertToAuthModel(user);
          const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;
          
          // Set timeout for auto-logout
          setAuthTimeout();
          
          // Schedule logout timer
          if (authTimeoutId) {
            clearTimeout(authTimeoutId);
          }
          scheduledLogout(get());
          
          set({ 
            isAuthenticated: true, 
            user: authUser, 
            isLoading: false, 
            isAdmin,
            isInitialized: true,
            error: null
          });
        } catch (error) {
          // Don't log authentication errors (status 400) to console
          const isAuthError = error instanceof Error && 
            (error.toString().includes('400') || error.toString().includes('Invalid login')) || 
            (error && typeof error === 'object' && 'status' in error && error.status === 400);
          
          if (!isAuthError) {
            console.error('Login error:', error);
          }
          
          set({ 
            isLoading: false,
            error: 'auth.invalidCredentials'
          });
          throw error;
        }
      },

      logout: async () => {
        pb.authStore.clear();
        clearAuthTimeout();
        if (authTimeoutId) {
          clearTimeout(authTimeoutId);
          authTimeoutId = null;
        }
        set({ 
          ...getInitialState(),
          isInitialized: true 
        });
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });
          const data = {
            email,
            password,
            passwordConfirm: password,
            name,
            role: UserRole.USER,
            emailVisibility: true
          };
          const record = await pb.collection('users').create<PBUser>(data);
          await pb.collection('users').authWithPassword(email, password);
          
          const user = await pb.collection('users').getOne<PBUser>(record.id);
          const authUser = convertToAuthModel(user);
          
          // Set timeout for auto-logout
          setAuthTimeout();
          
          // Schedule logout timer
          if (authTimeoutId) {
            clearTimeout(authTimeoutId);
          }
          scheduledLogout(get());
          
          set({ 
            isAuthenticated: true, 
            user: authUser, 
            isLoading: false,
            isAdmin: false,
            isInitialized: true,
            error: null
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      refreshUser: async () => {
        const currentUser = get().user;
        if (!currentUser?.id) {
          return;
        }

        try {
          set({ isLoading: true });
          const options = { requestKey: null };
          
          const user = await pb.collection('users').getOne<PBUser>(currentUser.id, options);
          const authUser = convertToAuthModel(user);
          const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;

          set({
            user: authUser,
            isAdmin,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          await initiateGoogleLogin();
        } catch (error) {
          console.error('Google login error:', error);
          set({ 
            isLoading: false,
            error: 'Failed to login with Google'
          });
          throw error;
        }
      },
      
      registerWithGoogle: async () => {
        try {
          set({ isLoading: true });
          await initiateGoogleRegistration();
          // The redirect will happen, and the callback page will handle the response
        } catch (error) {
          console.error('Google registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isInitialized: state.isInitialized,
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
          role: state.user.role
        } : null
      }),
      storage: {
        getItem: getFromStorage,
        setItem: setToStorage,
        removeItem: removeFromStorage,
      },
    }
  )
);

/**
 * Activity tracking to reset the auth timeout
 */
if (typeof window !== 'undefined') {
  // Reset timeout on any user activity
  const resetTimeout = () => {
    if (pb.authStore.isValid) {
      setAuthTimeout();
      // Reset the scheduled logout
      if (authTimeoutId) {
        clearTimeout(authTimeoutId);
      }
      scheduledLogout(useAuth.getState());
    }
  };

  // Add event listeners for user activity
  window.addEventListener('mousedown', resetTimeout);
  window.addEventListener('keydown', resetTimeout);
  window.addEventListener('touchstart', resetTimeout);
  window.addEventListener('scroll', resetTimeout, { passive: true });

  // Reset on tab/window focus
  window.addEventListener('focus', resetTimeout);

  // Set up auth state change listener
  pb.authStore.onChange((token, model) => {
    console.log('Auth store changed:', {
      isValid: pb.authStore.isValid,
      model: model ? 'exists' : 'null',
      token: token ? 'Token exists' : 'No token'
    });

    if (pb.authStore.isValid && model) {
      try {
        // Convert PocketBase user model to our AuthModel
        const user = convertToAuthModel(model as PBUser);
        const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

        // Update auth state
        useAuth.setState({
          isAuthenticated: true,
          user,
          isAdmin,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error processing user data:', error);
        useAuth.setState({
          isAuthenticated: false,
          user: null,
          isAdmin: false,
          isLoading: false,
          error: 'Failed to process user data'
        });
      }
    } else {
      // Clear auth state when no valid auth
      useAuth.setState({
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        isLoading: false,
        error: null
      });
    }
  });
}

/**
 * Service class for authentication-related operations
 * Implements Facade pattern to provide a simplified interface
 */
export class AuthService {
  static async getCurrentUser(): Promise<AuthModel | null> {
    if (!pb.authStore.isValid || !pb.authStore.model?.id) return null;
    
    try {
      const user = await pb.collection('users').getOne<PBUser>(pb.authStore.model.id, {
        requestKey: null // Prevent auto-cancellation
      });
      return convertToAuthModel(user);
    } catch {
      return null;
    }
  }

  static async validateAndRefreshAuth(): Promise<boolean> {
    try {
      if (!pb.authStore.isValid || !pb.authStore.model?.id) {
        return false;
      }

      const user = await this.getCurrentUser();
      if (!user || !user.role) {
        useAuth.getState().logout();
        return false;
      }

      const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      useAuth.setState({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        isAdmin 
      });
      
      // Reset auth timeout
      setAuthTimeout();
      
      // Reset the scheduled logout
      if (authTimeoutId) {
        clearTimeout(authTimeoutId);
      }
      scheduledLogout(useAuth.getState());
      
      return true;
    } catch {
      useAuth.getState().logout();
      return false;
    }
  }

  static async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user || !user.role) return false;

    switch (requiredRole) {
      case UserRole.SUPER_ADMIN:
        return user.role === UserRole.SUPER_ADMIN;
      case UserRole.ADMIN:
        return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      case UserRole.USER:
        return true; // All authenticated users have at least USER role
      default:
        return false;
    }
  }

  static async isAdmin(): Promise<boolean> {
    return this.hasRole(UserRole.ADMIN);
  }

  static async getAllUsers(): Promise<AuthModel[]> {
    try {
      const currentUser = await this.getCurrentUser();
      
      if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN)) {
        throw new Error('Unauthorized access');
      }

      // Use filter to get users (this endpoint has different permissions than getFullList)
      const result = await pb.collection('users').getList<PBUser>(1, 100, {
        requestKey: null,
        $autoCancel: false,
        sort: '-created'
      });

      return result.items.map((user: PBUser) => convertToAuthModel(user));
    } catch (error) {
      throw error;
    }
  }

  static async updateAllUsersEmailVisibility(): Promise<void> {
    try {
      // Get all users
      const users = await pb.collection('users').getFullList<PBUser>();
      
      // Update each user's emailVisibility
      const updates = users.map((user: PBUser) => 
        pb.collection('users').update(user.id, {
          emailVisibility: true
        }, {
          requestKey: null
        })
      );
      
      await Promise.all(updates);
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Validates the current authentication state
 * @returns Promise<boolean> indicating if the auth state is valid
 */
export async function validateAuthState() {
  try {
    if (!pb.authStore.isValid) {
      return false;
    }

    const userId = pb.authStore.model?.id;
    if (!userId) {
      return false;
    }

    await pb.collection('users').getOne(userId);
    
    // Reset auth timeout
    setAuthTimeout();
    
    // Reset the scheduled logout
    if (authTimeoutId) {
      clearTimeout(authTimeoutId);
    }
    scheduledLogout(useAuth.getState());
    
    return true;
  } catch {
    pb.authStore.clear();
    clearAuthTimeout();
    return false;
  }
} 