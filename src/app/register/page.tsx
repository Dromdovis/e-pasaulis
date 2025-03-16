// src/app/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

// Add interface for form data
interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

interface ValidationError {
  code: string;
  message: string;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface ValidationErrors {
  [key: string]: ValidationError;
}

async function isPocketBaseAvailable() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (!baseUrl) {
      return false;
    }

    // Use the users collection endpoint which is public for checking availability
    const url = `${baseUrl}/api/collections/users/records`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Any response (even 403) means the server is running
    return response.status !== 404 && response.status !== 502 && response.status !== 503;
  } catch {
    return false;
  }
}

export default function Register() {
  const router = useRouter();
  const { clearLocalData } = useStore();
  const { t } = useLanguage();
  const { registerWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Type the form data state
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('registerFormData');
      return saved ? JSON.parse(saved) : {
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
      };
    }
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    };
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('registerFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Move validations to the top
      if (!formData.name) {
        setErrorMessage(t('name_required') || 'Full name is required');
        setLoading(false);
        return;
      }

      if (!formData.email) {
        setErrorMessage(t('email_required') || 'Email is required');
        setLoading(false);
        return;
      }

      if (!formData.password) {
        setErrorMessage(t('password_required') || 'Password is required');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage(t('invalid_email_format') || 'Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Password validation
      if (formData.password !== formData.passwordConfirm) {
        setErrorMessage(t('passwords_dont_match') || 'Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setErrorMessage(t('password_too_short') || 'Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      // Clear any existing auth state and local data
      pb.authStore.clear();
      clearLocalData();

      const isAvailable = await isPocketBaseAvailable();
      if (!isAvailable) {
        setErrorMessage(t('server_unavailable') || 'Server is unavailable. Please try again later.');
        setLoading(false);
        return;
      }

      // Updated data structure to match PocketBase schema
      const data = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name.trim(),
        emailVisibility: true,
        verified: false,
        role: 'user',
      };

      try {
        await pb.collection('users').create(data);

        // Authenticate immediately after registration
        await pb.collection('users').authWithPassword(
          data.email,
          data.password
        );

        // Clear saved form data after successful registration
        localStorage.removeItem('registerFormData');
        
        // Force a router refresh to update server components
        router.refresh();
        
        // Redirect to home page with products
        window.location.href = '/';
      } catch {
        setErrorMessage(t('registration_failed') || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } catch {
      setErrorMessage(t('registration_failed') || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await registerWithGoogle();
      
      // Add redirect after successful Google authentication
      // Wait a moment to ensure auth state is updated
      setTimeout(() => {
        if (pb.authStore.isValid) {
          window.location.href = '/';
        }
      }, 500);
    } catch (error) {
      // Handle the special auto-cancellation case
      if (error instanceof Error && error.message === 'auth_flow_interrupted') {
        console.log('Auth flow was interrupted, but this may be normal during authentication');
        setLoading(false);
        // Don't show error to the user as this is likely just part of the auth flow
        
        // Check if we still got authenticated despite the "error"
        setTimeout(() => {
          if (pb.authStore.isValid) {
            window.location.href = '/';
          }
        }, 500);
        return;
      }
      
      console.error('Google registration error:', error);
      setErrorMessage(t('failed_to_register_with_google') || 'Failed to register with Google');
      setLoading(false);
    }
  };

  // Fix the onChange handlers
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [field]: e.target.value}));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('register_title')}</h1>
        {errorMessage && <div className="mb-4 p-2 bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300 rounded">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t('register_name_placeholder')}
            value={formData.name}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleInputChange('name')}
          />
          <input
            type="email"
            placeholder={t('register_email_placeholder')}
            value={formData.email}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleInputChange('email')}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('register_password_placeholder')}
              value={formData.password}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={handleInputChange('password')}
            />
            <div 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-300" /> : 
                <Eye className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              }
            </div>
          </div>
          
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('register_confirm_password_placeholder')}
              value={formData.passwordConfirm}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={handleInputChange('passwordConfirm')}
            />
            <div 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-300" /> : 
                <Eye className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              }
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? t('registering') : t('register_button')}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">{t('or_use_google')}</p>
          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            {t('register_with_google')}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {t('already_have_account')} <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">{t('login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}