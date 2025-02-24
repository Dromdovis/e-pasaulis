/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { Globe, UserCircle, LogOut, ShoppingCart, Heart, User, ChevronDown, Settings, Search } from "lucide-react";
import Link from "next/link";
import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useStore, StoreState } from '@/lib/store'; 
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { UserRole } from '@/types/auth';
import { SearchBar } from '@/components/SearchBar';
import { LanguageDropdown } from '@/components/LanguageDropdown';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const router = useRouter();
  const { cart } = useStore();
  const { isAuthenticated, user, isLoading, logout, initialize, isInitialized, isAdmin } = useAuth();
  const favorites = useStore((state: StoreState) => state.favorites);
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const languageSelector = (
    <div className="relative">
      <button
        onClick={(e) => {
          setButtonRect(e.currentTarget.getBoundingClientRect());
          setShowLanguageMenu(!showLanguageMenu);
        }}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800"
      >
        <Globe className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
        <span className="text-secondary-600 dark:text-secondary-300 uppercase">
          {language}
        </span>
        <ChevronDown className="h-4 w-4 text-secondary-600 dark:text-secondary-300" />
      </button>

      {showLanguageMenu && (
        <LanguageDropdown
          onSelect={setLanguage}
          onClose={() => setShowLanguageMenu(false)}
          buttonRect={buttonRect}
        />
      )}
    </div>
  );

  // Don't render user-specific content until mounted and initialized
  if (!mounted || !isInitialized) {
    return (
      <nav className={`bg-[rgb(var(--navbar-bg))] backdrop-blur-sm border-b border-black/5 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400"
            >
              e-pasaulis
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`bg-[rgb(var(--navbar-bg))] backdrop-blur-sm border-b border-black/5 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400"
            >
              e-pasaulis
            </Link>
            {isAuthenticated && user && (
              <span className="text-gray-600 dark:text-gray-300">
                {user.name}
              </span>
            )}
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={language === 'en' ? 'Search...' : 'Ieškoti...'}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {languageSelector}
            <Link 
              href="/favorites" 
              className={`relative text-gray-600 hover:text-gray-800 ${
                favorites.length > 0 ? 'text-primary-600' : ''
              }`}
            >
              <Heart className="h-5 w-5" fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link 
                    href="/admin"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800"
                    title={t('admin_panel')}
                  >
                    <Settings className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                    <span className="hidden md:inline">{t('admin_panel')}</span>
                  </Link>
                )}
                <Link href="/profile" className="relative w-8 h-8">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-800">
                  {t('login')}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
