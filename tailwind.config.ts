import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-blue': '#0074C8',
        'white': '#FFFFFF',
        // Secondary Colors
        'sky-blue': '#5BB9F0',
        'navy-blue': '#004B84',
        'cool-gray': '#E6ECF2',
        // Accent Colors
        'gold': '#FFD700',
        'soft-green': '#A5D6A7',
        'coral-red': '#FF6F61',
        // Typography Colors
        'main-text': '#1A1A1A',
        'secondary-text': '#4F4F4F',
        'highlight-text': '#0074C8',
        // Background System
        'app-bg': '#FAFAFA',
        'card-bg': '#FFFFFF',
      },
      keyframes: {
        'spin-wheel': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(var(--rotation))' },
        },
        'win-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.9' },
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'spin-wheel': 'spin-wheel 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'win-pulse': 'win-pulse 1s ease-in-out infinite',
        'confetti': 'confetti 3s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
