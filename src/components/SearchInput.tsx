'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Input } from '@/components/ui/Input';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ onSearch, placeholder }: SearchInputProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    const sanitizedValue = value.replace(/[<>]/g, '').trim();
    onSearch(sanitizedValue);
  }, [debouncedValue, value, onSearch]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm"
    />
  );
} 