'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SpecificationFilterProps {
  specName: string;
  specValues: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export default function SpecificationFilter({
  specName,
  specValues,
  selectedValues,
  onChange,
}: SpecificationFilterProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredValues, setFilteredValues] = useState<string[]>(specValues);

  // Filter values based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredValues(specValues);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = specValues.filter(value => 
      value.toLowerCase().includes(searchLower)
    );
    setFilteredValues(filtered);
  }, [search, specValues]);

  // Handle checkbox change
  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onChange(newSelectedValues);
  };

  // Format the specification name for display
  const formatSpecName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="border rounded-md mb-4">
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {formatSpecName(specName)}
          {selectedValues.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
              {selectedValues.length}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="mb-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredValues.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No values found</p>
            ) : (
              filteredValues.map((value) => (
                <div key={value} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`${specName}-${value}`}
                    checked={selectedValues.includes(value)}
                    onChange={() => handleCheckboxChange(value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${specName}-${value}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    {value}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 