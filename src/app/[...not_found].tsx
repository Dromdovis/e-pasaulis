'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft } from 'lucide-react';

export default function CatchAllNotFound() {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // Hardcoded messages for each language as backup
  const defaultMessages = {
    en: "This page doesn't exist yet, thanks for understanding. - ePasaulis",
    ru: "Эта страница еще не существует, спасибо за понимание. - ePasaulis",
    lt: "Šis puslapis dar neegzistuoja, ačiū už supratimą. - ePasaulis"
  };
  
  // Get message with fallback to language-specific default
  const message = t('page_not_found_message') || defaultMessages[language as keyof typeof defaultMessages] || defaultMessages.en;
  
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-primary-500 mb-4">404</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {message}
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          aria-label={t('back_to_home') || 'Back to Home'}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('back_to_home') || 'Back to Home'}
        </button>
      </div>
    </div>
  );
} 