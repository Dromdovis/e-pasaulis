/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Navbar.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { Globe, UserCircle, LogOut, ShoppingCart, Heart, User, ChevronDown, Settings, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { UserRole } from '@/types/auth';
import { SearchBar } from '@/components/SearchBar';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import UserMenu from '@/components/UserMenu';
import Logo from '@/components/Logo';

interface NavbarProps {
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
  onMobileMenuOpen: () => void;
}

export default function Navbar({ mobileMenuOpen, onMobileMenuClose, onMobileMenuOpen }: NavbarProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langButtonRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cart = useStore(state => state.cart);
  const favorites = useStore(state => state.favorites);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLanguageChange = (newLang: 'en' | 'lt') => {
    setLanguage(newLang);
    setLangMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langButtonRef.current && !langButtonRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold text-gray-900 dark:text-white">E-Pasaulis</span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-lg">
              <SearchBar />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Language Selector */}
            <div className="hidden sm:flex items-center relative" ref={langButtonRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex items-center space-x-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left ${
                      language === 'en' ? 'text-primary-600 dark:text-primary-400' : ''
                    }`}
                  >
                    {t('language_en')}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('lt')}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left ${
                      language === 'lt' ? 'text-primary-600 dark:text-primary-400' : ''
                    }`}
                  >
                    {t('language_lt')}
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link href="/favorites" className="relative">
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <UserCircle className="w-6 h-6" />
                  {user && <span className="text-sm font-medium hidden sm:inline">{user.name || user.email}</span>}
                </button>

                {userMenuOpen && user && (
                  <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{t('profile')}</span>
                      </div>
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>{t('settings')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </div>
                    </button>
                  </div>
                )}

                {!user && (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  >
                    <UserCircle className="w-6 h-6" />
                    <span className="hidden sm:inline">{t('login')}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={onMobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden py-2">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Language Selection in Mobile Menu */}
            <div className="px-3 py-2">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="flex items-center justify-between w-full py-2"
              >
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-medium">{t('select_language')}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileLangOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {mobileLangOpen && (
                <div className="ml-7 mt-2 space-y-2 bg-gray-50 dark:bg-gray-700 rounded-md p-2">
                  <button
                    onClick={() => {
                      handleLanguageChange('en');
                      setMobileLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      language === 'en' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {t('language_en')}
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange('lt');
                      setMobileLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      language === 'lt' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {t('language_lt')}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Section in Mobile Menu */}
            {user ? (
              <>
                <div className="px-3 py-2 border-t dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <UserCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                  <div className="space-y-1 ml-7">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={onMobileMenuClose}
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{t('profile')}</span>
                      </div>
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={onMobileMenuClose}
                    >
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        <span>{t('settings')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        onMobileMenuClose();
                        handleLogout();
                      }}
                      className="block w-full px-3 py-2 text-left rounded-md text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>{t('logout')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onMobileMenuClose}
              >
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-2" />
                  <span>{t('login')}</span>
                </div>
              </Link>
            )}

            {/* Favorites and Cart Links */}
            <Link
              href="/favorites"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onMobileMenuClose}
            >
              <Heart className="w-5 h-5 mr-2" />
              <span>{t('favorites')}</span>
              {favorites.length > 0 && (
                <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onMobileMenuClose}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span>{t('cart')}</span>
              {cart.length > 0 && (
                <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
