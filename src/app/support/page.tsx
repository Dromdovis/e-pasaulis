'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { HelpCircle, FileText, Mail } from 'lucide-react';

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('support_page_title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t('support_page_subtitle')}</p>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('support_section1_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('support_section1_content')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Link href="/faq" className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <HelpCircle className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{t('faq')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Answers to common questions</p>
              </Link>
              
              <Link href="/returns" className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{t('returns')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Return policy and process</p>
              </Link>
              
              <Link href="/contact" className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{t('contact')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get in touch with us</p>
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('support_section2_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('support_section2_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('support_contact_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('support_contact_content')}
            </p>
            
            <div className="bg-primary-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{t('contact_email_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">info@e-pasaulis.lt</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{t('contact_phone_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">+370 600 00000</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 