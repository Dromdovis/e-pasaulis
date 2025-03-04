import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { pb } from '@/lib/db';
import { makeStaticProps } from '@/utils/serverProps';

export default function ForgotPasswordPage() {
  const { t } = useTranslation(['common', 'auth']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await pb.collection('users').requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('email')) {
          setError(t('auth:forgotPassword.errors.emailNotFound'));
        } else if (err.message.includes('too many')) {
          setError(t('auth:forgotPassword.errors.tooManyRequests'));
        } else {
          setError(t('errors.general'));
        }
      } else {
        setError(t('errors.general'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth:forgotPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth:forgotPassword.subtitle')}
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
            <p className="text-sm text-green-700 dark:text-green-200">
              {t('auth:forgotPassword.success')}
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth:forgotPassword.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder={t('auth:forgotPassword.emailPlaceholder')}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.loading') : t('auth:forgotPassword.submitButton')}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t('auth:forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = makeStaticProps(['common', 'auth']); 