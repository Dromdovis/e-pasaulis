'use client';
import { createPortal } from 'react-dom';

interface LanguageDropdownProps {
  onSelect: (lang: 'en' | 'lt') => void;
  onClose: () => void;
  buttonRect: DOMRect | null;
}

export function LanguageDropdown({ onSelect, onClose, buttonRect }: LanguageDropdownProps) {
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
        English
      </button>
      <button
        onClick={() => {
          onSelect('lt');
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-secondary-100 dark:hover:bg-secondary-700"
      >
        Lietuvių
      </button>
    </div>,
    document.body
  );
} 