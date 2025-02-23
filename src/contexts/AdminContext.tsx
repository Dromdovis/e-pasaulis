'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../lib/auth';
import { User } from '../types/auth';

interface AdminContextType {
  isAdmin: boolean;
  adminUser: User | null;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminUser: null,
  loading: true
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        const adminStatus = await AuthService.isAdmin();
        
        setIsAdmin(adminStatus);
        setAdminUser(user);
      } catch (error) {
        console.error('Failed to check admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext); 