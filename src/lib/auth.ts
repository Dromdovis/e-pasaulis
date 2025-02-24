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
import type { AuthModel, AuthState } from '@/types/auth';
import { UserRole } from '@/types/auth';
import { persist } from 'zustand/middleware';
import { PBUser, PocketBaseOptions } from '@/types/pocketbase';

/**
 * Initial authentication state
 */
const getInitialState = () => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  intendedPath: null as string | null,
  isAdmin: false,
  isInitialized: false
});

/**
 * Validates and normalizes user roles from PocketBase
 * @param role - Raw role string from PocketBase
 * @returns Validated UserRole enum value
 */
const validateUserRole = (role: string): UserRole => {
  console.log('🔑 validateUserRole - Input role:', role);
  const normalizedRole = role.toLowerCase();
  console.log('🔑 validateUserRole - Normalized role:', normalizedRole);
  
  let validatedRole: UserRole;
  switch (normalizedRole) {
    case 'admin':
      validatedRole = UserRole.ADMIN;
      break;
    case 'super_admin':
      validatedRole = UserRole.SUPER_ADMIN;
      break;
    default:
      validatedRole = UserRole.USER;
  }
  
  console.log('🔑 validateUserRole - Output role:', validatedRole);
  return validatedRole;
};

/**
 * Converts PocketBase user object to our internal AuthModel
 * Implements Adapter pattern to transform between data models
 */
const convertToAuthModel = (user: PBUser): AuthModel => {
  console.log('👤 convertToAuthModel - Input user:', {
    ...user,
    // Safely mask email if it exists
    email: user.email ? `${user.email.slice(0, 3)}***${user.email.slice(-3)}` : 'no-email'
  });
  
  const validatedRole = validateUserRole(user.role);
  const authModel = {
    id: user.id,
    email: user.email || '',
    name: user.name || '',
    role: validatedRole,
    avatar: user.avatar,
    created: user.created,
    updated: user.updated,
    verified: user.verified || false,
    emailVisibility: user.emailVisibility || false
  };
  
  console.log('👤 convertToAuthModel - Output model:', {
    ...authModel,
    // Safely mask email if it exists
    email: authModel.email ? `${authModel.email.slice(0, 3)}***${authModel.email.slice(-3)}` : 'no-email'
  });
  
  return authModel;
};

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
        console.log('🔄 initialize - Starting initialization');
        if (get().isInitialized) {
          console.log('🔄 initialize - Already initialized, skipping');
          return;
        }

        try {
          set({ isLoading: true });
          const model = pb.authStore.model as AuthModel | null;
          console.log('🔄 initialize - PocketBase auth model:', model);
          
          if (model?.id) {
            try {
              const options: PocketBaseOptions = { requestKey: null };
              console.log('🔄 initialize - Fetching fresh user data for ID:', model.id);
              const user = await pb.collection('users').getOne<PBUser>(model.id, options);
              
              const authUser = convertToAuthModel(user);
              const isValid = pb.authStore.isValid && !!authUser.role;
              const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;

              console.log('🔄 initialize - Setting auth state:', {
                isAuthenticated: isValid,
                userRole: authUser.role,
                isAdmin
              });

              set({
                isAuthenticated: isValid,
                user: authUser,
                isAdmin,
                isLoading: false,
                isInitialized: true
              });
              return;
            } catch (error) {
              console.error('❌ initialize - Failed to fetch user data:', error);
              pb.authStore.clear();
            }
          }

          console.log('🔄 initialize - No valid user, clearing state');
          set({
            ...getInitialState(),
            isInitialized: true
          });
        } catch (error) {
          console.error('❌ initialize - Auth initialization failed:', error);
          pb.authStore.clear();
          set({
            ...getInitialState(),
            isInitialized: true
          });
        }
      },

      login: async (email: string, password: string) => {
        console.log('🔑 login - Starting login process');
        try {
          set({ isLoading: true });
          const options: PocketBaseOptions = { requestKey: null };
          
          console.log('🔑 login - Authenticating with PocketBase');
          const authData = await pb.collection('users').authWithPassword(email, password, options);
          console.log('🔑 login - Auth successful, fetching fresh user data');
          
          const user = await pb.collection('users').getOne<PBUser>(authData.record.id, options);
          const authUser = convertToAuthModel(user);
          const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;

          console.log('🔑 login - Setting auth state:', {
            isAuthenticated: true,
            userRole: authUser.role,
            isAdmin
          });
          
          set({ 
            isAuthenticated: true, 
            user: authUser, 
            isLoading: false, 
            isAdmin,
            isInitialized: true 
          });
          return authUser;
        } catch (error) {
          console.error('❌ login - Login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        pb.authStore.clear();
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
          
          set({ 
            isAuthenticated: true, 
            user: authUser, 
            isLoading: false,
            isAdmin: false,
            isInitialized: true 
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Registration failed:', error);
          throw error;
        }
      },

      refreshUser: async () => {
        console.log('🔄 refreshUser - Starting refresh');
        const currentUser = get().user;
        if (!currentUser?.id) {
          console.log('🔄 refreshUser - No current user, skipping');
          return;
        }

        try {
          set({ isLoading: true });
          const options: PocketBaseOptions = { requestKey: null };
          console.log('🔄 refreshUser - Fetching fresh user data for ID:', currentUser.id);
          
          const user = await pb.collection('users').getOne<PBUser>(currentUser.id, options);
          const authUser = convertToAuthModel(user);
          const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;

          console.log('🔄 refreshUser - Setting updated user state');
          set({
            user: authUser,
            isAdmin,
            isLoading: false
          });
        } catch (error) {
          console.error('❌ refreshUser - Failed to refresh user:', error);
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isAdmin: state.isAdmin,
        isInitialized: state.isInitialized
      })
    }
  )
);

// Set up auth state change listener
if (typeof window !== 'undefined') {
  pb.authStore.onChange(async () => {
    const { isInitialized } = useAuth.getState();
    if (!isInitialized) return;

    try {
      const model = pb.authStore.model as AuthModel | null;
      if (model?.id) {
        // Fetch fresh user data to ensure role is up to date
        const user = await pb.collection('users').getOne<PBUser>(model.id);
        console.log('Auth change - Fetched user data:', user);
        
        const authUser = convertToAuthModel(user);
        const isValid = pb.authStore.isValid && !!authUser.role;
        const isAdmin = authUser.role === UserRole.ADMIN || authUser.role === UserRole.SUPER_ADMIN;

        console.log('Auth change - Setting auth state:', {
          isAuthenticated: isValid,
          user: authUser,
          isAdmin
        });

        useAuth.setState({
          isAuthenticated: isValid,
          user: authUser,
          isAdmin
        });
      } else {
        useAuth.setState({
          isAuthenticated: false,
          user: null,
          isAdmin: false
        });
      }
    } catch (error) {
      console.error('Auth state change error:', error);
      pb.authStore.clear();
      useAuth.setState({
        isAuthenticated: false,
        user: null,
        isAdmin: false
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
      return true;
    } catch (error) {
      console.error('Auth validation failed:', error);
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
      console.log('🔒 getAllUsers - Current user role:', currentUser?.role);
      
      if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN)) {
        console.error('❌ getAllUsers - Unauthorized access, user role:', currentUser?.role);
        throw new Error('Unauthorized access');
      }

      console.log('✅ getAllUsers - Authorized access, fetching users');
      
      // Use filter to get users (this endpoint has different permissions than getFullList)
      const result = await pb.collection('users').getList<PBUser>(1, 100, {
        requestKey: null,
        $autoCancel: false,
        sort: '-created'
      });

      return result.items.map(user => convertToAuthModel(user));
    } catch (error) {
      console.error('❌ getAllUsers - Failed to fetch users:', error);
      throw error;
    }
  }

  static async updateAllUsersEmailVisibility(): Promise<void> {
    try {
      // Get all users
      const users = await pb.collection('users').getFullList<PBUser>();
      
      // Update each user's emailVisibility
      const updates = users.map(user => 
        pb.collection('users').update(user.id, {
          emailVisibility: true
        }, {
          requestKey: null
        })
      );
      
      await Promise.all(updates);
      console.log('Successfully updated email visibility for all users');
    } catch (error) {
      console.error('Failed to update email visibility:', error);
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
    return true;
  } catch (error) {
    console.log('Auth validation failed:', error);
    pb.authStore.clear();
    return false;
  }
} 