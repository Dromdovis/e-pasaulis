// src/app/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

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

        // Update auth store state
        useAuth.getState().login({
          email: data.email,
          password: data.password
        });

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
      // The redirect will happen in the registerWithGoogle method
    } catch (error) {
      console.error('Google registration error:', error);
      setErrorMessage('Failed to register with Google');
      setLoading(false);
    }
  };

  // Fix the onChange handlers
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [field]: e.target.value}));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">{t('register') || 'Register'}</h1>
        {errorMessage && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t('name') || 'Full Name'}
            value={formData.name}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange('name')}
          />
          <input
            type="email"
            placeholder={t('email') || 'Email Address'}
            value={formData.email}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange('email')}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('password') || 'Password'}
              value={formData.password}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange('password')}
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t('confirm_password') || 'Confirm Password'}
              value={formData.passwordConfirm}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange('passwordConfirm')}
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('or_use_google') || 'Or use Google'}
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 mt-2"
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
            {t('continue_with_google') || 'Continue with Google'}
          </Link>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 
              (t('registering') || 'Registering...') : 
              (t('register') || 'Register')
            }
          </Button>
          <div className="text-center text-sm text-gray-600">
            {t('already_have_account') || 'Already have an account?'}{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              {t('login') || 'Login'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}