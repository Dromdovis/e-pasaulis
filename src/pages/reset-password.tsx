import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { pb } from '@/lib/db';
import { makeStaticProps } from '@/utils/serverProps';

export default function ResetPasswordPage() {
  const { t } = useTranslation(['common', 'auth']);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate form
    if (!formData.password) {
      setError(t('auth:resetPassword.errors.passwordRequired'));
      return;
    }
    if (!formData.confirmPassword) {
      setError(t('auth:resetPassword.errors.confirmPasswordRequired'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth:resetPassword.errors.passwordsDontMatch'));
      return;
    }
    if (formData.password.length < 8) {
      setError(t('auth:resetPassword.errors.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const token = router.query.token as string;
      if (!token) {
        throw new Error('Invalid token');
      }

      await pb.collection('users').confirmPasswordReset(
        token,
        formData.password,
        formData.confirmPassword
      );

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('token')) {
          setError(t('auth:resetPassword.errors.invalidToken'));
        } else {
          setError(t('auth:resetPassword.errors.resetFailed'));
        }
      } else {
        setError(t('auth:resetPassword.errors.resetFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth:resetPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth:resetPassword.subtitle')}
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
            <p className="text-sm text-green-700 dark:text-green-200">
              {t('auth:resetPassword.success')}
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  {t('auth:resetPassword.passwordLabel')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder={t('auth:resetPassword.passwordPlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  {t('auth:resetPassword.confirmPasswordLabel')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.loading') : t('auth:resetPassword.submitButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export const getStaticProps = makeStaticProps(['common', 'auth']); 