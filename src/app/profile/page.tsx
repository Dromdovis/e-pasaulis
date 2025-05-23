'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { pb } from '@/lib/db';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      
      await pb.collection('users').update(user.id, formData);
      await refreshUser();
    } catch (error) {
      console.error('Failed to update avatar:', error);
      setError('Failed to update avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both password fields');
      return;
    }

    setIsUpdating(true);
    setPasswordError(null);
    try {
      await pb.collection('users').update(user.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Failed to update password:', error);
      setPasswordError('Failed to update password. Please check your current password and try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        {t('profile_settings')}
      </h1>
      
      {/* Avatar Section */}
      <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('profile_photo')}
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400 dark:text-gray-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <span className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-gray-700 dark:text-gray-200">
                {isUploading ? t('profile_uploading') : t('profile_change_photo')}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </label>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('profile_change_password')}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile_current_password')}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isUpdating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile_new_password')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isUpdating}
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? t('profile_updating') : t('profile_update_password')}
          </button>
        </form>
      </div>
    </div>
  );
} 