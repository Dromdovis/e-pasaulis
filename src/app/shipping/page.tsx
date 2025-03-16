'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ShippingPage() {
  const { t, language } = useLanguage();

  // Function to properly display business days in Lithuanian
  const getBusinessDaysText = (text: string) => {
    if (language === 'lt') {
      return text.replace('business days', 'darbo dienas').replace('business day', 'darbo dieną');
    }
    return text;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('shipping_page_title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t('shipping_page_subtitle')}</p>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('shipping_section1_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('shipping_section1_content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('shipping_section2_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('shipping_section2_content')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('shipping_section3_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('shipping_section3_content')}
            </p>
            
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{t('shipping_table_country')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{t('shipping_table_method')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{t('shipping_table_cost')}</th>
                    <th className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{t('shipping_table_time')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Lithuania</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Standard</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">€3.99</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{getBusinessDaysText('1-2 business days')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Lithuania</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Express</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">€7.99</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{getBusinessDaysText('Next business day')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">EU Countries</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Standard</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">€9.99</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{getBusinessDaysText('3-5 business days')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">EU Countries</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Express</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">€14.99</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{getBusinessDaysText('1-3 business days')}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Worldwide</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">Standard</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">€19.99</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">{getBusinessDaysText('7-14 business days')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 