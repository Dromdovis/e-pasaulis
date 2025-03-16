// src/app/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { UserRole } from '@/types/auth';
import { Eye, EyeOff } from 'lucide-react';
import { pb } from '@/lib/db';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, loginWithGoogle, isLoading, intendedPath, isAuthenticated, user, initialize, isInitialized } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize auth state
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      // Always redirect to homepage or intended path, never directly to admin
      const redirectPath = intendedPath || '/';
      
      // Use window.location.href for hard navigation
      window.location.href = redirectPath;
    }
  }, [isInitialized, isAuthenticated, user, intendedPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      // Let the useEffect handle the redirect
    } catch (error) {
      // Don't log errors to console for authentication failures (status 400)
      // Check if the error is a ClientResponseError with status 400 before showing in console
      const isAuthError = error instanceof Error && 
        error.toString().includes('400') || 
        (error && typeof error === 'object' && 'status' in error && error.status === 400);
      
      if (!isAuthError) {
        console.error('Login error:', error);
      }
      
      // Always show user-friendly message regardless of error type
      setError(t('invalid_credentials') || 'Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      
      // Add redirect after successful Google authentication
      // Wait a moment to ensure auth state is updated
      setTimeout(() => {
        if (pb.authStore.isValid) {
          window.location.href = intendedPath || '/';
        }
      }, 500);
    } catch (error) {
      // Handle the special auto-cancellation case
      if (error instanceof Error && error.message === 'auth_flow_interrupted') {
        console.log('Auth flow was interrupted, but this may be normal during authentication');
        // Don't show error to the user as this is likely just part of the auth flow
        
        // Check if we still got authenticated despite the "error"
        setTimeout(() => {
          if (pb.authStore.isValid) {
            window.location.href = intendedPath || '/';
          }
        }, 500);
        return;
      }
      
      console.error('Google login error:', error);
      setError(t('google_login_failed') || 'Failed to login with Google');
    }
  };

  // Show loading state while checking auth
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {t('login_title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder={t('login_email_placeholder')}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 pr-10"
                placeholder={t('login_password_placeholder')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label={showPassword ? t('hide_password') : t('show_password')}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('logging_in') : t('login_button')}
            </button>
          </div>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">
                {t('continue_with_google')}
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              {t('login_with_google')}
            </button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600 dark:text-gray-400">
              {t('dont_have_account')}{' '}
            </span>
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('register')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}