import { create } from 'zustand';
import { pb } from './db';
import { User, UserRole } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  userName: string | null;
  userAvatar: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: pb.authStore.isValid,
  isLoading: true,
  user: pb.authStore.model,
  userName: pb.authStore.model?.name,
  userAvatar: pb.authStore.model?.avatar ? 
    `${pb.baseUrl}/api/files/${pb.authStore.model.collectionId}/${pb.authStore.model.id}/${pb.authStore.model.avatar}` 
    : null,
  login: async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    set({
      isAuthenticated: true,
      user: authData.record,
      userName: authData.record.name,
      userAvatar: authData.record.avatar ?
        `${pb.baseUrl}/api/files/${authData.record.collectionId}/${authData.record.id}/${authData.record.avatar}`
        : null,
    });
  },
  logout: async () => {
    pb.authStore.clear();
    set({ isAuthenticated: false, user: null, userName: null, userAvatar: null });
  },
  refreshUser: async () => {
    if (!pb.authStore.model) return;
    const user = await pb.collection('users').getOne(pb.authStore.model.id);
    set({
      user,
      userName: user.name,
      userAvatar: user.avatar ?
        `${pb.baseUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`
        : null,
    });
  },
}));

// Initialize loading state
if (typeof window !== 'undefined') {
  useAuth.setState({ isLoading: false });
}

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    if (!pb.authStore.isValid) return null;
    
    try {
      const user = await pb.collection('users').getOne(pb.authStore.model?.id);
      return user as User;
    } catch {
      return null;
    }
  }

  static async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

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
} 