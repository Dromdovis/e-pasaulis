'use client';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LanguageDropdownProps {
  onSelect: (lang: string) => void;
  onClose: () => void;
  buttonRect: DOMRect | undefined;
}

export function LanguageDropdown({ onSelect, onClose, buttonRect }: LanguageDropdownProps) {
  const { t } = useLanguage();
  
  if (!buttonRect) return null;

  return createPortal(
    <div 
      className="fixed bg-white dark:bg-secondary-800 rounded-md shadow-lg py-1 min-w-[120px]"
      style={{
        top: `${buttonRect.bottom + 5}px`,
        left: `${buttonRect.left}px`,
        zIndex: 9999
      }}
    >
      <button
        onClick={() => {
          onSelect('en');
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-secondary-100 dark:hover:bg-secondary-700"
      >
        {t('language_en')}
      </button>
      <button
        onClick={() => {
          onSelect('lt');
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-secondary-100 dark:hover:bg-secondary-700"
      >
        {t('language_lt')}
      </button>
    </div>,
    document.body
  );
} 