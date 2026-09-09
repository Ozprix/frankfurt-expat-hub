import globals from 'globals';

export default [
	{
		ignores: [
			'node_modules*/**',
			'dist/**',
			'build/**',
			'.claude/**',
			'.playwright-cli/**',
			'frankfurt/**',
			'supabase/.temp/**',
			'vite.config.js',
			'vite.config.js.timestamp-*.mjs',
			'src/App.jsx',
		],
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: { ...globals.browser, React: 'readonly', Intl: 'readonly' },
		},
		rules: {
			'no-undef': 'error',
			'no-unused-vars': 'off',
		},
	},
	{ files: ['tools/**/*.js', 'tailwind.config.js'], languageOptions: { globals: globals.node } },
];
