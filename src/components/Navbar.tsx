// src/components/Navbar.tsx
'use client';
import { useEffect, useState } from 'react';
import { Globe, UserCircle, LogOut, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { pb } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

const Navbar = () => {
  const router = useRouter();
  const cart = useStore(state => state.cart);
  const favorites = useStore(state => state.favorites);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid);
    setUserName(pb.authStore.model?.name ?? '');
    pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
      setUserName(pb.authStore.model?.name ?? '');
    });
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              e-pasaulis
            </Link>
            {isAuthenticated && (
              <span className="text-gray-600">{userName}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/favorites" className="p-2 rounded-md hover:bg-gray-100 relative">
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 rounded-md hover:bg-gray-100 relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button className="flex items-center gap-1">
              <Globe className="h-5 w-5" />
              <span>EN</span>
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="p-2 rounded-md hover:bg-gray-100">
                  <UserCircle className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-md hover:bg-gray-100">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-md hover:bg-gray-100">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;