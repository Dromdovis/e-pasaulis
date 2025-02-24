'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ReturnsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('returns')}</h1>
        
        <div className="prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('return_policy')}</h2>
            <p className="text-gray-600">
              {t('return_policy_description')}
            </p>
            
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                {t('return_policy_point_1')}
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                {t('return_policy_point_2')}
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                {t('return_policy_point_3')}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('return_process')}</h2>
            <ol className="list-decimal list-inside space-y-4">
              <li>{t('return_process_step_1')}</li>
              <li>{t('return_process_step_2')}</li>
              <li>{t('return_process_step_3')}</li>
              <li>{t('return_process_step_4')}</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
} 