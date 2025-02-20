import { create } from 'zustand';
import { pb } from './db';

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