// src/app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Register() {
  const router = useRouter();
  const { clearLocalData } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clear any existing auth state and local data
      pb.authStore.clear();
      clearLocalData();

      // Create the user account
      await pb.collection('users').create(formData);
      
      // Authenticate the user
      await pb.collection('users').authWithPassword(formData.email, formData.password);
      
      // Force a router refresh to update server components
      router.refresh();
      
      // Navigate to home page with a full page refresh
      window.location.href = '/';
    } catch (error: Error | unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please check your details.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              onChange={e => setFormData(prev => ({...prev, passwordConfirm: e.target.value}))}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}