import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-inter)', 'var(--font-gurmukhi)', 'var(--font-devanagari)', 'system-ui', 'sans-serif'],
        head:  ['var(--font-sora)', 'var(--font-gurmukhi)', 'var(--font-devanagari)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-jb-mono)', 'monospace'],
        indic: ['var(--font-gurmukhi)', 'var(--font-devanagari)', 'sans-serif'],
      },
      colors: {
        bg:        'rgb(var(--bg) / <alpha-value>)',
        surface:   'rgb(var(--surface) / <alpha-value>)',
        'surface-2':'rgb(var(--surface-2) / <alpha-value>)',
        subtle:    'rgb(var(--subtle) / <alpha-value>)',
        border:    'rgb(var(--border) / <alpha-value>)',
        'border-strong':'rgb(var(--border-strong) / <alpha-value>)',
        fg:        'rgb(var(--text) / <alpha-value>)',
        'fg-2':    'rgb(var(--text-2) / <alpha-value>)',
        muted:     'rgb(var(--muted) / <alpha-value>)',
        accent:    'rgb(var(--accent) / <alpha-value>)',
        'accent-2':'rgb(var(--accent-2) / <alpha-value>)',
        danger:    'rgb(var(--danger) / <alpha-value>)',
        warning:   'rgb(var(--warning) / <alpha-value>)',
      },
      borderRadius: { 'xs': '4px', 'sm': '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '20px' },
      boxShadow: {
        'soft-1': 'var(--shadow-1)',
        'soft-2': 'var(--shadow-2)',
        'soft-3': 'var(--shadow-3)',
        'glow':   'var(--glow)',
      },
      animation: {
        'fade-in':   'fade-in .35s cubic-bezier(.16,1,.3,1) both',
        'shimmer':   'shimmer 1.6s linear infinite',
        'pulse-soft':'pulse-soft 1.8s ease-in-out infinite',
      },
      keyframes: {
        'fade-in':    { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        'shimmer':    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.55' } },
      },
    },
  },
  plugins: [],
};
export default config;
