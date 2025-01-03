import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import noOnlyTestsPlugin from 'eslint-plugin-no-only-tests'
import reactPlugin from 'eslint-plugin-react'
import mdxPlugin from 'eslint-plugin-mdx'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '*.astro', 'tests/**/*'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
  {
    files: ['*.astro'],
    extends: [...eslintPluginAstro.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^(Props|_)$',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['tests/**/*'],
    plugins: {
      'no-only-tests': noOnlyTestsPlugin,
    },
    rules: {
      'no-only-tests/no-only-tests': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['*.mdx'],
    settings: {
      'mdx/code-blocks': false,
    },
    languageOptions: {
      parserOptions: {
        ignoreRemarkConfig: false,
      },
    },
    plugins: {
      mdx: mdxPlugin,
    },
    rules: {
      ...mdxPlugin.configs.recommended.rules,
      'no-mixed-spaces-and-tabs': 'off',
    },
  },
  {
    files: ['*.mdx', '*.tsx'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    ignores: [
      'public',
      '.astro',
      'dist',
      'src/components/devicons',
      'src/env.d.ts',
      'playwright-report',
      'src/content/posts/tres-algoritmos-para-a-sequencia-de-fibonacci/index.pt.mdx',
      'src/content/posts/gram-schmidt/index.pt.mdx',
      'src/content/posts/metodo-de-newton/index.pt.mdx',
    ],
  }
)
