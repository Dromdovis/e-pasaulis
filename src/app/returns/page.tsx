'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ReturnsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('returns_page_title')}</h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_section1_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('returns_section1_content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_section2_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('returns_section2_content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_section3_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('returns_section3_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_process_title')}</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-600 dark:text-gray-300">
              <li>{t('returns_process_step1')}</li>
              <li>{t('returns_process_step2')}</li>
              <li>{t('returns_process_step3')}</li>
              <li>{t('returns_process_step4')}</li>
            </ol>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_eligible_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('returns_eligible_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('returns_not_eligible_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('returns_not_eligible_content')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 