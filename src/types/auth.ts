export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface AuthModel {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created: string;
  updated: string;
  verified: boolean;
  emailVisibility: boolean;
}

export interface User extends AuthModel {
  // Additional user-specific fields can be added here
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthModel | null;
  intendedPath: string | null;
  isAdmin: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  setIntendedPath: (path: string | null) => void;
  login: (email: string, password: string) => Promise<AuthModel>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
} 