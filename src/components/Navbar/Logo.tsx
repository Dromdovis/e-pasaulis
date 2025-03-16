import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/providers/ThemeProvider';

export default function Logo() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link href="/" className="flex items-center">
      <svg
        width="140"
        height="40"
        viewBox="0 0 140 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10"
      >
        <path
          d="M14.5 8C10.3579 8 7 11.3579 7 15.5C7 19.6421 10.3579 23 14.5 23H22V15.5C22 11.3579 18.6421 8 14.5 8Z"
          fill={isDark ? "#60A5FA" : "#2563EB"}
        />
        <path
          d="M14.5 25C10.3579 25 7 28.3579 7 32.5C7 36.6421 10.3579 40 14.5 40C18.6421 40 22 36.6421 22 32.5V25H14.5Z"
          fill={isDark ? "#93C5FD" : "#3B82F6"}
        />
        <path
          d="M31.5 8C27.3579 8 24 11.3579 24 15.5V32.5C24 36.6421 27.3579 40 31.5 40C35.6421 40 39 36.6421 39 32.5C39 28.3579 35.6421 25 31.5 25H24V15.5C24 13.567 25.567 12 27.5 12H39V8H31.5Z"
          fill={isDark ? "#60A5FA" : "#2563EB"}
        />
        <text
          x="45"
          y="28"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
          fill={isDark ? "#FFFFFF" : "#1E3A8A"}
        >
          pasaulis
        </text>
      </svg>
    </Link>
  );
} 