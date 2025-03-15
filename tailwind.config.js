const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary-50, 236 252 255))',
          100: 'rgb(var(--primary-100, 207 239 255))',
          200: 'rgb(var(--primary-200, 165 219 246))',
          300: 'rgb(var(--primary-300, 100 189 230))',
          400: 'rgb(var(--primary-400, 56 161 214))',
          500: 'rgb(var(--primary-500, 25 142 203))',
          600: 'rgb(var(--primary-600, 7 116 178))',
          700: 'rgb(var(--primary-700, 3 92 146))',
          800: 'rgb(var(--primary-800, 7 77 119))',
          900: 'rgb(var(--primary-900, 12 58 87))',
          950: 'rgb(var(--primary-950, 8 40 61))',
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        secondary: colors.slate,
        success: colors.emerald,
        warning: colors.amber,
        error: colors.red,
        info: colors.blue,
      },
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'rgb(var(--foreground))',
            a: {
              color: 'rgb(var(--primary-600))',
              '&:hover': {
                color: 'rgb(var(--primary-700))',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}; 