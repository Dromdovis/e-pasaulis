'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SpecificationFilterProps {
  specName: string;
  specValues: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  defaultOpen?: boolean;
}

export default function SpecificationFilter({
  specName,
  specValues,
  selectedValues,
  onChange,
  defaultOpen = false,
}: SpecificationFilterProps) {
  const { t } = useLanguage();
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
    <div className="border rounded-md mb-3">
      <div className="px-3 py-2 border-b">
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {formatSpecName(specName)}
          {selectedValues.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
              {selectedValues.length}
            </span>
          )}
        </span>
      </div>

      <div className="px-3 py-2">
        {specValues.length > 10 && (
          <div className="mb-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full p-1.5 border text-sm rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        <div className="max-h-60 overflow-y-auto">
          {filteredValues.length === 0 ? (
            <p className="text-sm text-gray-500 py-1">No values found</p>
          ) : (
            filteredValues.map((value) => (
              <div key={value} className="flex items-center py-1">
                <input
                  type="checkbox"
                  id={`${specName}-${value}`}
                  checked={selectedValues.includes(value)}
                  onChange={() => handleCheckboxChange(value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${specName}-${value}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  {value}
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 