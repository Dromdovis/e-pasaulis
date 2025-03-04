'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { UserCircle, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';

export default function UserMenu() {
  const { t } = useTranslation('common');
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
      >
        <UserCircle className="w-6 h-6" />
        <span className="hidden sm:inline">{t('navigation.login')}</span>
      </Link>
    );
  }

  const displayName = user?.name || user?.email || t('navigation.user');
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
      >
        <UserCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{t('navigation.profile')}</span>
            </div>
          </Link>

          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{t('navigation.settings')}</span>
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('navigation.admin_panel')}</span>
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>{t('navigation.logout')}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 