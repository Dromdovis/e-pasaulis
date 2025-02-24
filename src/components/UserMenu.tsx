'use client';

import { useState, useRef, useEffect } from 'react';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { User } from '@/types/auth';

interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
      >
        <UserCircle className="w-6 h-6" />
        <span className="hidden sm:inline">{t('login')}</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User avatar'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserCircle className="w-8 h-8" />
        )}
        <span className="hidden sm:inline">{user.name || user.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <UserCircle className="w-4 h-4" />
              <span>{t('profile')}</span>
            </div>
          </Link>
          
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{t('settings')}</span>
            </div>
          </Link>
          
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 