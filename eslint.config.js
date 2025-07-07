import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends([
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'next',
    'next/core-web-vitals',
  ]),
  {
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', // not needed in Next.js
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
];
