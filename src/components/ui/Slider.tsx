'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onChange: (value: number[]) => void;
  formatLabel?: (value: number) => string;
}

export default function Slider({ min, max, value, onChange, formatLabel }: SliderProps) {
  return (
    <div className="relative pt-1 pb-8">
      <SliderPrimitive.Root
        className="relative flex items-center w-full h-5 select-none touch-none"
        value={value}
        min={min}
        max={max}
        step={1}
        onValueChange={onChange}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary-500" />
        </SliderPrimitive.Track>
        
        {value.map((val, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="block h-5 w-5 rounded-full border-2 border-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {formatLabel && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm">
                {formatLabel(val)}
              </div>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    </div>
  );
} 