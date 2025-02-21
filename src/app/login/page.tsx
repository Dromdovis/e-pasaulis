/* eslint-disable react/no-unescaped-entities */
// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Login() {
  const { t } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Authenticate with PocketBase
      const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);
      
      // Force a router refresh to update server components
      router.refresh();
      
      // Navigate to home page and force a full page refresh
      window.location.href = '/';
    } catch {
      setError(t('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">{t('login')}</h1>
        {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t('email')}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('password')}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? t('logging_in') : t('login')}
          </button>
          <div className="text-center text-sm text-gray-600">
            {t('dont_have_account')}{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t('register')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}