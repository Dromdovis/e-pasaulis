'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Search className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_products')}
            className="w-full p-2 border rounded-lg"
          />
          {/* Add search results here */}
        </div>
      )}
    </div>
  );
} 