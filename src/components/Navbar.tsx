/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { Globe, UserCircle, LogOut, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useStore, StoreState } from '@/lib/store'; 
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Navbar = () => {
  const router = useRouter();
  const { cart } = useStore();
  const { isAuthenticated, userName, userAvatar, isLoading, logout } = useAuth();
  const favorites = useStore((state: StoreState) => state.favorites);
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const languageSelector = (
    <div className="relative">
      <button
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800"
      >
        <Globe className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
        <span className="text-secondary-600 dark:text-secondary-300 uppercase">
          {language}
        </span>
        <ChevronDown className="h-4 w-4 text-secondary-600 dark:text-secondary-300" />
      </button>

      {showLanguageMenu && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-secondary-800 rounded-md shadow-lg py-1 min-w-[120px]">
          <button
            onClick={() => {
              setLanguage('en');
              setShowLanguageMenu(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-secondary-100 dark:hover:bg-secondary-700"
          >
            English
          </button>
          <button
            onClick={() => {
              setLanguage('lt');
              setShowLanguageMenu(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-secondary-100 dark:hover:bg-secondary-700"
          >
            Lietuvių
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-[rgb(var(--navbar-bg))] backdrop-blur-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400"
            >
              e-pasaulis
            </Link>
            {isLoading ? (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              isAuthenticated && (
                <span className="text-gray-600 dark:text-gray-300">
                  {userName}
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-6">
            {languageSelector}
            <Link
              href="/favorites"
              className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 relative"
            >
              <Heart className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              {isLoading ? (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-200 animate-pulse rounded-full"></span>
              ) : (
                favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )
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

            {isLoading ? (
              <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="relative w-8 h-8">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
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
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
