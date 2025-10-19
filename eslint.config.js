import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	globalIgnores(['dist/**', 'build/**', 'node_modules']),
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended']
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, chrome: 'readonly' }
		}
	},
	eslintConfigPrettier,
	tseslint.configs.recommended
])
