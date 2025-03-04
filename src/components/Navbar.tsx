/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Navbar.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { Globe, UserCircle, LogOut, ShoppingCart, Heart, User, ChevronDown, Settings, Search, Menu, X, LayoutDashboard } from "lucide-react";
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
import type { StoreState } from '@/lib/store';
import { useTranslation } from 'next-i18next';
import { CartButton } from './CartButton';
import { FavoritesButton } from './FavoritesButton';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
  onMobileMenuOpen: () => void;
}

// Helper function to interpolate between two colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;
  
  const hex = (x: string) => parseInt(x, 16);
  
  const r1 = hex(color1.substring(1, 3));
  const g1 = hex(color1.substring(3, 5));
  const b1 = hex(color1.substring(5, 7));
  
  const r2 = hex(color2.substring(1, 3));
  const g2 = hex(color2.substring(3, 5));
  const b2 = hex(color2.substring(5, 7));
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Smoothstep function for smoother transitions
const smoothstep = (min: number, max: number, value: number): number => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

// Enhanced easing function for more dynamic animations
const easeInOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};

// Multi-point color interpolation for smoother transitions with multiple color stops
const multiColorInterpolate = (colors: string[], stops: number[], t: number): string => {
  if (t <= stops[0]) return colors[0];
  if (t >= stops[stops.length - 1]) return colors[colors.length - 1];
  
  // Find the right segment
  let i = 0;
  while (i < stops.length - 1 && t > stops[i + 1]) i++;
  
  // Normalize t to the segment
  const segmentT = (t - stops[i]) / (stops[i + 1] - stops[i]);
  return interpolateColor(colors[i], colors[i + 1], segmentT);
};

// Adjust color for better contrast against a background
const ensureContrast = (color: string, backgroundColor: string, minContrastRatio: number = 4.5): string => {
  // Simple contrast check - convert both colors to grayscale and ensure difference
  const hex = (x: string) => parseInt(x, 16);
  
  const r1 = hex(color.substring(1, 3));
  const g1 = hex(color.substring(3, 5));
  const b1 = hex(color.substring(5, 7));
  
  const r2 = hex(backgroundColor.substring(1, 3));
  const g2 = hex(backgroundColor.substring(3, 5));
  const b2 = hex(backgroundColor.substring(5, 7));
  
  // Calculate relative luminance for both colors (simplified)
  const luminance1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
  const luminance2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
  
  // If contrast is too low, return white or black depending on background brightness
  const contrastRatio = luminance1 > luminance2 
    ? (luminance1 + 0.05) / (luminance2 + 0.05)
    : (luminance2 + 0.05) / (luminance1 + 0.05);
    
  if (contrastRatio < minContrastRatio) {
    return luminance2 > 0.5 ? "#000000" : "#FFFFFF";
  }
  
  return color;
};

// Color theme definitions
const neonTechTheme = {
  background: { start: "#0D0D0D", end: "#171717" }, // almost black
  elements: { primary: "#14B8A6", secondary: "#FFFFFF" }, // teal-500 and white
  accent: "#22D3EE" // cyan-400
};

const arcticTheme = {
  background: { start: "#E0F2FE", end: "#BFDBFE" }, // sky-100 to blue-100
  elements: { primary: "#1E40AF", secondary: "#0C4A6E" }, // blue-800 and sky-900
  accent: "#38BDF8" // sky-400
};

// Transition theme for highest contrast mid-transition
const contrastTheme = {
  secondary: "#FFFFFF", // White for maximum contrast during transition
  secondaryAlt: "#000000" // Black alternative for dark backgrounds
};

export default function Navbar({ mobileMenuOpen, onMobileMenuClose, onMobileMenuOpen }: NavbarProps) {
  const { t } = useTranslation('common');
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langButtonRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cart = useStore((state: StoreState) => state.cart);
  const favorites = useStore((state: StoreState) => state.favorites);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  
  // Animation state
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [sizeFactor, setSizeFactor] = useState(1); // 1 = 100% size, 0.8 = 80% size
  const [pulseIntensity, setPulseIntensity] = useState(0); // 0-1 for pulse glow intensity
  const [isNeonTech, setIsNeonTech] = useState(true);

  // Check if user is admin or super_admin
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const displayName = user?.name || user?.email || t('navigation.user');

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

  // Enhanced theme animation logic with size and pulse effects
  useEffect(() => {
    let animationFrame: number;
    let lastUpdateTime = Date.now();
    
    // Timing constants (all in milliseconds)
    const staticDuration = 5000; // 5 seconds static at each end
    const transitionDuration = 10000; // 10 seconds for full transition
    const totalCycleDuration = (staticDuration * 2) + (transitionDuration * 2);
    
    // Size animation parameters
    const minSizeFactor = 0.8; // 20% smaller at peak of transition
    
    let cycleTime = 0;
    
    const updateAnimation = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime;
      lastUpdateTime = now;
      
      // Update cycle time and keep it within bounds
      cycleTime = (cycleTime + deltaTime) % totalCycleDuration;
      
      // Calculate color transition progress and size factor
      let colorProgress: number;
      let currentSizeFactor = 1; // Default to full size
      let currentPulseIntensity = 0;
      
      // First static period (Arctic)
      if (cycleTime < staticDuration) {
        colorProgress = 0;
        currentSizeFactor = 1; // Full size during static period
        currentPulseIntensity = 0;
      } 
      // First transition period (Arctic to Neon)
      else if (cycleTime < staticDuration + transitionDuration) {
        const transitionTime = cycleTime - staticDuration;
        const transitionProgress = transitionTime / transitionDuration;
        
        colorProgress = transitionProgress;
        
        // Gradual size change: Shrink during first half, grow during second half
        if (transitionProgress <= 0.5) {
          // First half of transition: Gradually shrink to 80%
          currentSizeFactor = 1 - ((1 - minSizeFactor) * (transitionProgress * 2));
        } else {
          // Second half of transition: Gradually grow back to 100%
          currentSizeFactor = minSizeFactor + ((1 - minSizeFactor) * ((transitionProgress - 0.5) * 2));
        }
        
        // Pulse intensity peaks at middle of transition
        currentPulseIntensity = 1 - Math.abs(transitionProgress - 0.5) * 2;
      } 
      // Second static period (Neon)
      else if (cycleTime < (staticDuration * 2) + transitionDuration) {
        colorProgress = 1;
        currentSizeFactor = 1; // Full size during static period
        currentPulseIntensity = 0;
      } 
      // Second transition period (Neon to Arctic)
      else {
        const transitionTime = cycleTime - ((staticDuration * 2) + transitionDuration);
        const transitionProgress = transitionTime / transitionDuration;
        
        colorProgress = 1 - transitionProgress;
        
        // Gradual size change: Shrink during first half, grow during second half
        if (transitionProgress <= 0.5) {
          // First half of transition: Gradually shrink to 80%
          currentSizeFactor = 1 - ((1 - minSizeFactor) * (transitionProgress * 2));
        } else {
          // Second half of transition: Gradually grow back to 100%
          currentSizeFactor = minSizeFactor + ((1 - minSizeFactor) * ((transitionProgress - 0.5) * 2));
        }
        
        // Pulse intensity peaks at middle of transition
        currentPulseIntensity = 1 - Math.abs(transitionProgress - 0.5) * 2;
      }
      
      // Apply smooth easing to the color transition
      const smoothColorProgress = smoothstep(0, 1, colorProgress);
      
      // Update state values
      setTransitionProgress(smoothColorProgress);
      setSizeFactor(currentSizeFactor);
      setPulseIntensity(currentPulseIntensity);
      
      animationFrame = requestAnimationFrame(updateAnimation);
    };
    
    lastUpdateTime = Date.now();
    animationFrame = requestAnimationFrame(updateAnimation);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  // Use multi-point interpolation for smoother color transitions
  const progress = transitionProgress;
  
  // Calculate the current background color for contrast checking
  const currentBackgroundMid = interpolateColor(
    interpolateColor(arcticTheme.background.start, arcticTheme.background.end, 0.5),
    interpolateColor(neonTechTheme.background.start, neonTechTheme.background.end, 0.5),
    progress
  );
  
  // Define smoother color stops for multi-stage interpolation of the E letter
  const eColorStops = [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1];
  const eColors = [
    arcticTheme.elements.secondary, // Start with Arctic blue
    "#264676", // Transition color
    "#FFFFFF", // Use white for contrast in mid-transition
    "#FFFFFF", // Keep white at middle point
    "#FFFFFF", // Continue with white
    "#BFBFBF", // Transition color
    neonTechTheme.elements.secondary  // End with Neon white
  ];
  
  // Ensure rings are always visible with good contrast
  const ringColor = interpolateColor(
    arcticTheme.elements.primary,
    neonTechTheme.accent,
    smoothstep(0, 1, progress)
  );
  
  // Ensure consistent sizing between themes
  const strokeWidth = 0.8;
  const nodeRadius = 1;
  const dataPointRadius = 0.7;
  const outerRingStrokeWidth = 1;
  
  // Modifying progress for E letter to speed through problematic regions
  // This creates a non-linear timing curve that moves faster through the middle
  let eProgress = progress;
  if (progress > 0.3 && progress < 0.7) {
    // Accelerate through the middle section where contrast issues occur
    // Map 0.3-0.7 to 0.3-0.7 but with a steeper curve in the middle
    const normalizedProgress = (progress - 0.3) / 0.4; // 0-1 range
    const acceleratedProgress = Math.pow(normalizedProgress, 0.7); // Accelerate with power curve
    eProgress = 0.3 + (acceleratedProgress * 0.4);
  }
  
  const logoColors = {
    background: {
      start: interpolateColor(
        arcticTheme.background.start,
        neonTechTheme.background.start,
        progress
      ),
      end: interpolateColor(
        arcticTheme.background.end,
        neonTechTheme.background.end,
        progress
      )
    },
    elements: {
      primary: interpolateColor(
        arcticTheme.elements.primary,
        neonTechTheme.elements.primary,
        progress
      ),
      // Use enhanced color management for the E letter
      secondary: ensureContrast(
        multiColorInterpolate(eColors, eColorStops, eProgress),
        currentBackgroundMid,
        5 // Higher contrast ratio requirement
      )
    },
    accent: interpolateColor(
      arcticTheme.accent,
      neonTechTheme.accent,
      progress
    ),
    ring: ringColor
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              e-pasaulis
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
            <LanguageSelector />

            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center space-x-4">
              <CartButton />
              <FavoritesButton />

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <UserCircle className="w-6 h-6" />
                      <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{t('navigation.profile')}</span>
                          </div>
                        </Link>

                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
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
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <LayoutDashboard className="w-4 h-4" />
                              <span>{t('navigation.adminPanel')}</span>
                            </div>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="w-4 h-4" />
                            <span>{t('navigation.logout')}</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <UserCircle className="w-6 h-6" />
                    <span className="hidden sm:inline">{t('navigation.login')}</span>
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
            {/* Profile Section in Mobile Menu */}
            {isAuthenticated && user ? (
              <div className="px-3 py-2 border-t dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <UserCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{displayName}</span>
                </div>
                <div className="space-y-1 ml-7">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onMobileMenuClose}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{t('navigation.profile')}</span>
                    </div>
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onMobileMenuClose}
                  >
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>{t('navigation.settings')}</span>
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={onMobileMenuClose}
                    >
                      <div className="flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        <span>{t('navigation.adminPanel')}</span>
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      onMobileMenuClose();
                      handleLogout();
                    }}
                    className="block w-full px-3 py-2 text-left rounded-md text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>{t('navigation.logout')}</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onMobileMenuClose}
              >
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-2" />
                  <span>{t('navigation.login')}</span>
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
              <span>{t('navigation.favorites')}</span>
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
              <span>{t('navigation.cart')}</span>
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
