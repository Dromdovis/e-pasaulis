/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { Globe, UserCircle, LogOut, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const Navbar = () => {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid);
    setUserName(pb.authStore.model?.name ?? "");
    pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
      setUserName(pb.authStore.model?.name ?? "");
    });
  }, []);

  return (
    // src/components/Navbar.tsx (partial update)
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
            {isAuthenticated && (
              <span className="text-secondary-600 dark:text-secondary-300">
                {userName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/favorites"
              className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 relative"
            >
              <Heart className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 relative"
            >
              <ShoppingCart className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800"
                >
                  <UserCircle className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                </Link>
                <button
                  onClick={() => {
                    pb.authStore.clear();
                    router.push("/");
                    router.refresh();
                  }}
                  className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800"
                >
                  <LogOut className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-500"
                >
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
