'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth';
import { X, Percent, Tag, ChevronRight } from 'lucide-react';

export function RegisterBanner() {
  const { t } = useLanguage();
  const { isAuthenticated, isInitialized } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Add entrance animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show banner for authenticated users or if it was dismissed
  if (!isInitialized || isAuthenticated || dismissed) {
    return null;
  }

  return (
    <div className={`fixed right-0 top-1/3 z-40 transform -translate-y-1/2 transition-all duration-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-4 rounded-l-lg shadow-lg flex flex-col items-center w-64 relative">
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          aria-label={t('close')}
        >
          <X size={18} />
        </button>

        <Percent className="h-12 w-12 mb-2 text-white" />
        
        <h3 className="font-bold text-xl mb-1">{t('register_special_offer')}</h3>
        <p className="text-center mb-3 text-sm">{t('register_discount_description')}</p>
        
        <div className="bg-white text-primary-700 font-bold text-2xl py-1 px-4 rounded-full mb-3 flex items-center">
          <Tag size={16} className="mr-1" />
          <span>15% OFF</span>
        </div>
        
        <Link 
          href="/register" 
          className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-full flex items-center transition-colors w-full justify-center"
        >
          {t('register_sign_up_now')}
          <ChevronRight size={16} className="ml-1" />
        </Link>
        
        <p className="text-xs mt-3 text-gray-100 text-center">
          {t('register_new_customers_only')}
        </p>
      </div>
    </div>
  );
} 