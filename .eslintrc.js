module.exports = {
   root: true,
   extends: [
      '@yieldstudio/eslint-config/react-native',
      'plugin:@typescript-eslint/recommended',
      'plugin:jest/recommended',
      'plugin:prettier/recommended',
   ],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
         jsx: true,
      },
      warnOnUnsupportedTypeScriptVersion: false,
      tsconfigRootDir: __dirname,
   },
   plugins: ['@typescript-eslint', 'react', 'react-native', 'jest', 'prettier', 'import'],
   env: {
      'jest/globals': true,
      'react-native/react-native': true,
   },
   overrides: [
      {
         files: ['*.ts', '*.tsx'],
         rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/naming-convention': [
               'error',
               {
                  selector: 'interface',
                  format: ['PascalCase'],
               },
               {
                  selector: 'variable',
                  format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
               },
            ],
         },
      },
      {
         files: ['*.js', '*.jsx'],
         rules: {
            '@typescript-eslint/no-var-requires': 'off',
         },
      },
   ],
   rules: {
      // Prettier rules
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      // React and React Native rules
      'react-native/no-unused-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-raw-text': 'off',
      'react-native/no-single-element-style-arrays': 'warn',
      'react-native/sort-styles': 'warn',
      'react/no-children-prop': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'error',

      // TypeScript rules
      '@typescript-eslint/no-use-before-define': ['warn', { functions: false, classes: false }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-namespace': 'error',

      // Import rules
      'import/no-cycle': 'warn',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/order': ['error', {
         'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
         'newlines-between': 'always',
         'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }],
      'import/no-named-as-default': 'error',
      'import/no-extraneous-dependencies': 'error',

      // General rules
      'unicorn/filename-case': 'off',
      'react/function-component-definition': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Using TypeScript's no-unused-vars instead
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'warn',
      'no-unsafe-optional-chaining': 'error',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
   },
   settings: {
      'import/parsers': {
         '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
         typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json'
         },
         node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
         }
      },
      react: {
         version: 'detect'
      }
   }
};
