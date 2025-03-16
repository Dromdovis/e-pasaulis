'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{t('about_page_title')}</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="mb-12 relative h-64 rounded-xl overflow-hidden">
            <Image
              src="/images/company-office.jpg"
              alt={t('about_us')}
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">{t('about_page_section1_title')}</h2>
          <p className="mb-6 dark:text-gray-300">
            {t('about_page_section1_content')}
          </p>

          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">{t('about_page_section2_title')}</h2>
          <p className="mb-6 dark:text-gray-300">
            {t('about_page_section2_content')}
          </p>

          <div className="grid md:grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('about_happyCustomers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('about_productsDelivered')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400">{t('about_satisfactionRate')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 