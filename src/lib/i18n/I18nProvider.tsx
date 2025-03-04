'use client';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { createContext, useContext, ReactNode } from 'react';
import { TFunction } from 'i18next';

interface I18nContextType {
  t: TFunction;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    router.push(router.asPath, router.asPath, { locale: lang });
  };

  return (
    <I18nContext.Provider
      value={{
        t,
        changeLanguage,
        currentLanguage: i18n.language,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLanguage must be used within an I18nProvider');
  }
  return context;
}; 