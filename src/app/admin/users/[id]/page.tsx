'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/db';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types/auth';
import type { AuthModel } from '@/types/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { PBUser } from '@/types/pocketbase';

type PageParams = {
  params: Promise<{ id: string }>;
};

export default function EditUserPage({ params }: PageParams) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<AuthModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    emailVisibility: false
  });

  // Unwrap the params Promise
  const userId = use(params).id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user with ID:', userId);
        const userData = await pb.collection('users').getOne<PBUser>(userId, {
          requestKey: null, // Prevent auto-cancellation
          $autoCancel: false
        });
        console.log('Fetched user data:', {
          ...userData,
          email: userData.email ? `${userData.email.slice(0, 3)}***${userData.email.slice(-3)}` : 'no-email'
        });

        const authModel: AuthModel = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role as UserRole,
          avatar: userData.avatar,
          created: userData.created,
          updated: userData.updated,
          verified: userData.verified,
          emailVisibility: userData.emailVisibility
        };

        setUser(authModel);
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          emailVisibility: userData.emailVisibility
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch user');
        } else {
          setError('Failed to fetch user');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Only super_admin can change roles to admin/super_admin
      if (currentUser?.role !== UserRole.SUPER_ADMIN &&
          (formData.role === UserRole.ADMIN || formData.role === UserRole.SUPER_ADMIN)) {
        setError('Only super admins can assign admin roles');
        return;
      }

      await pb.collection('users').update(userId, formData, {
        requestKey: null, // Prevent auto-cancellation
        $autoCancel: false
      });
      router.push('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to update user');
      } else {
        setError('Failed to update user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit User: {user?.name}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={currentUser?.role !== UserRole.SUPER_ADMIN}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailVisibility"
            checked={formData.emailVisibility}
            onChange={(e) => setFormData({ ...formData, emailVisibility: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="emailVisibility" className="ml-2 block text-sm text-gray-900">
            Make email visible
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
} 