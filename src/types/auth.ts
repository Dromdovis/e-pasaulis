export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
  created: string;
  updated: string;
} 