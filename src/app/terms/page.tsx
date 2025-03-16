'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('terms_page_title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t('terms_page_subtitle')}</p>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('terms_section1_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('terms_section1_content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('terms_section2_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('terms_section2_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('terms_section3_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('terms_section3_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('terms_section4_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('terms_section4_content')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 