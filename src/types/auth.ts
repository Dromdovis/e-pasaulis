import { BaseModel } from 'pocketbase';

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google'
}

export interface BaseAuthModel extends BaseModel {
  id: string;
  created: string;
  updated: string;
}

export interface AuthModel extends BaseModel {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  emailVisibility: boolean;
  created: string;
  updated: string;
  provider?: AuthProvider;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: AuthModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  error: string | null;
  intendedPath: string | null;
  initialize: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setIntendedPath: (path: string | null) => void;
} 