'use client';

import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
}

export default function PriceRangeSlider({ min, max, onChange }: PriceRangeSliderProps) {
  const { t } = useLanguage();
  const [range, setRange] = useState([min, max]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    validateRange(min, max);
    setRange([min, max]);
  }, [min, max]);

  const validateRange = (minValue: number, maxValue: number) => {
    if (minValue < 0) {
      setError(t('invalid_price_range_negative'));
      return false;
    }
    if (minValue >= maxValue) {
      setError(t('invalid_price_range_order'));
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (newRange: number[]) => {
    if (validateRange(newRange[0], newRange[1])) {
      setRange(newRange);
      onChange({ min: newRange[0], max: newRange[1] });
    }
  };

  return (
    <div className="w-full px-2 py-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{t('price_range')}</span>
        <span className="text-sm font-medium">
          ${range[0]} - ${range[1]}
        </span>
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      <Slider.Root
        className="relative flex items-center w-full h-5"
        value={range}
        max={max}
        min={min}
        step={1}
        onValueChange={handleChange}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-primary-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-primary-500 rounded-full hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Min price"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-primary-500 rounded-full hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Max price"
        />
      </Slider.Root>
    </div>
  );
} 