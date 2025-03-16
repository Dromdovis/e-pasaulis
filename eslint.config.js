import { fileURLToPath } from 'url';
import path from 'path';
import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';

// Convert URL to filepath for __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // Global ignores from previous .eslintignore
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      'next.config.js',
      'next-env.d.ts',
      '*.js', // Keep this if you really want to ignore all JS files
      '!eslint.config.js', // But don't ignore this config
      'src/types/pocketbase.d.ts', // Ignore pocketbase type definitions
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        // Timer functions
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        // Performance API
        performance: 'readonly',
        // Crypto API
        crypto: 'readonly',
        // Node
        process: 'readonly',
        // React
        React: 'readonly',
        // Form data
        FormData: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        // Others
        URLSearchParams: 'readonly',
        URL: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      // From .eslintrc.json
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description'
      }],
      'no-unused-vars': 'off', // Turn off the base rule
      'no-undef': 'warn', // Downgrade to warning for now
      'no-useless-catch': 'warn'
    },
  },
  {
    // Retain the core-web-vitals settings from Next.js
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    // Browser and Node environment settings
    files: ['**/*.{js,mjs}'], // Add rules specifically for JS files
    languageOptions: {
      globals: {
        // Browser
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        // Node
        process: 'readonly',
        // ES6
        Promise: 'readonly',
        // Form data
        FormData: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        // Others
        URLSearchParams: 'readonly',
        URL: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
]; 