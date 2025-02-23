// src/app/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { validateAuthState } from '@/lib/auth';
import { useAuth } from '@/lib/auth';

// Add interface for form data
interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

// Update the PocketBaseError interface to better match the actual error structure
interface PocketBaseError {
  status?: number;
  response?: {
    code: number;
    message: string;
    data: {
      [key: string]: {
        code: string;
        message: string;
      };
    };
  };
  data?: {
    code: number;
    message: string;
    data: {
      [key: string]: {
        code: string;
        message: string;
      };
    };
  };
  originalError?: any;
}

// Update PocketBase response interface to match schema
interface PocketBaseResponse {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  created: string;
  updated: string;
}

// Update the validation error interfaces
interface PocketBaseValidationError {
  code: string;
  message: string;
}

interface PocketBaseErrorResponse {
  data: {
    [key: string]: PocketBaseValidationError;
  };
  message: string;
}

async function isPocketBaseAvailable() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (!baseUrl) {
      console.error('PocketBase URL is not defined');
      return false;
    }

    // Use the users collection endpoint which is public for checking availability
    const url = `${baseUrl}/api/collections/users/records`;
    console.log('Checking PocketBase availability at:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Any response (even 403) means the server is running
    const isAvailable = response.status !== 404 && response.status !== 502 && response.status !== 503;
    console.log('Response status:', response.status);
    console.log('PocketBase server status:', isAvailable ? 'Available' : 'Not Available');
    
    if (!isAvailable) {
      const text = await response.text();
      console.log('Response body:', text);
    }
    
    return isAvailable;
  } catch (error) {
    console.error('PocketBase connection error:', error);
    return false;
  }
}

export default function Register() {
  const router = useRouter();
  const { clearLocalData } = useStore();
  const { t } = useLanguage();
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('registerFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Move validations to the top
      if (!formData.name) {
        setError(t('name_required'));
        setLoading(false);
        return;
      }

      if (!formData.email) {
        setError(t('email_required'));
        setLoading(false);
        return;
      }

      if (!formData.password) {
        setError(t('password_required'));
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError(t('invalid_email_format'));
        setLoading(false);
        return;
      }

      // Password validation
      if (formData.password !== formData.passwordConfirm) {
        setError(t('passwords_dont_match'));
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError(t('password_too_short'));
        setLoading(false);
        return;
      }

      // Clear any existing auth state and local data
      pb.authStore.clear();
      clearLocalData();

      const isAvailable = await isPocketBaseAvailable();
      if (!isAvailable) {
        setError(t('server_unavailable'));
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

      console.log('Attempting to create user with data:', {
        ...data,
        password: '[HIDDEN]',
        passwordConfirm: '[HIDDEN]'
      });

      try {
        const newUser = await pb.collection('users').create(data);
        console.log('User created successfully:', newUser);

        // Authenticate immediately after registration
        const authData = await pb.collection('users').authWithPassword(
          data.email,
          data.password
        );

        // Update auth store state
        useAuth.getState().login(data.email, data.password);

        // Clear saved form data after successful registration
        localStorage.removeItem('registerFormData');
        
        // Force a router refresh to update server components
        router.refresh();
        
        // Redirect to home page with products
        window.location.href = '/';
      } catch (error: any) {
        console.error('Registration error full details:', error);
        
        if (error?.data?.data) {
          const validationErrors = error.data.data as Record<string, PocketBaseValidationError>;
          
          if (validationErrors.email?.code === 'validation_not_unique') {
            setError(t('email_already_exists'));
          } else if (validationErrors.username?.code === 'validation_not_unique') {
            setError(t('username_already_exists'));
          } else {
            // Get the first error message
            const firstError = Object.values(validationErrors)[0] as PocketBaseValidationError | undefined;
            setError(firstError?.message || error.message || t('registration_failed'));
          }
        } else {
          setError(error.message || t('registration_failed'));
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError(t('registration_failed'));
    } finally {
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
        <h1 className="text-2xl font-bold mb-6">{t('register')}</h1>
        {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t('name')}
            value={formData.name}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange('name')}
          />
          <input
            type="email"
            placeholder={t('email')}
            value={formData.email}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange('email')}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('password')}
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
              placeholder={t('confirm_password')}
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
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? t('registering') : t('register')}
          </button>
          <div className="text-center text-sm text-gray-600">
            {t('already_have_account')}{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              {t('login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}