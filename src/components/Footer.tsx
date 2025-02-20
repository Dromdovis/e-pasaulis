'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[rgb(var(--card-bg))] shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('about_us')}</h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              {t('about_description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('shipping_info')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('customer_service')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('returns')}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600">
                  {t('support')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contact_us')}</h3>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-300">
              <li>{t('email')}: info@e-pasaulis.lt</li>
              <li>{t('phone')}: +370 63605050</li>
              <li>{t('address')}: Klaipėda, Lithuania</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-200 dark:border-secondary-700 mt-8 pt-8 text-center text-secondary-600 dark:text-secondary-300">
          <p>&copy; {new Date().getFullYear()} E-Pasaulis. {t('all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
} 