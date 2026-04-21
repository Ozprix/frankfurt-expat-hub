/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

const animationPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'@keyframes enter': {
			from: {
				opacity: 'var(--tw-enter-opacity, 1)',
				transform:
					'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1))',
			},
		},
		'@keyframes exit': {
			to: {
				opacity: 'var(--tw-exit-opacity, 1)',
				transform:
					'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1))',
			},
		},
		'.animate-in': {
			animationName: 'enter',
			animationDuration: '150ms',
			'--tw-enter-opacity': 'initial',
			'--tw-enter-scale': 'initial',
			'--tw-enter-translate-x': 'initial',
			'--tw-enter-translate-y': 'initial',
		},
		'.animate-out': {
			animationName: 'exit',
			animationDuration: '150ms',
			'--tw-exit-opacity': 'initial',
			'--tw-exit-scale': 'initial',
			'--tw-exit-translate-x': 'initial',
			'--tw-exit-translate-y': 'initial',
		},
		'.fade-in-0': { '--tw-enter-opacity': '0' },
		'.fade-out-0': { '--tw-exit-opacity': '0' },
		'.fade-out-80': { '--tw-exit-opacity': '0.8' },
		'.zoom-in-95': { '--tw-enter-scale': '.95' },
		'.zoom-out-95': { '--tw-exit-scale': '.95' },
		'.slide-in-from-top-2': { '--tw-enter-translate-y': '-0.5rem' },
		'.slide-in-from-bottom-2': { '--tw-enter-translate-y': '0.5rem' },
		'.slide-in-from-left-1\\/2': { '--tw-enter-translate-x': '-50%' },
		'.slide-in-from-left-2': { '--tw-enter-translate-x': '-0.5rem' },
		'.slide-in-from-right-2': { '--tw-enter-translate-x': '0.5rem' },
		'.slide-out-to-left-1\\/2': { '--tw-exit-translate-x': '-50%' },
		'.slide-out-to-right-full': { '--tw-exit-translate-x': '100%' },
		'.slide-out-to-top-\\[48\\%\\]': { '--tw-exit-translate-y': '-48%' },
		'.slide-in-from-top-\\[48\\%\\]': { '--tw-enter-translate-y': '-48%' },
	});
});

module.exports = {
	darkMode: ['class'],
	content: [
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [animationPlugin],
};
