import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#dceee6',
          200: '#bce0d2',
          300: '#91cdb7',
          400: '#5fb397',
          500: '#2d8469',
          600: '#1e6852',
          700: '#165140',
          800: '#113d30',
          900: '#0a2e22',  // Dhruva Signature Deep Regal Emerald
          950: '#061e16',
        },
        emerald: {
          50: '#f0f7f4',
          100: '#dceee6',
          200: '#bce0d2',
          300: '#91cdb7',
          400: '#5fb397',
          500: '#2d8469',
          600: '#1e6852',
          700: '#165140',
          800: '#113d30',
          900: '#0a2e22',
          950: '#061e16',
        },
        gold: {
          50: '#fbf8f3',
          100: '#f6f0e6',
          200: '#ebdcc5',
          300: '#dec39d',
          400: '#cfa672',
          500: '#9b7745',  // Refined Warm Gold
          600: '#836233',
        },
        accent: {
          500: '#9b7745',
          600: '#836233',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'reveal': 'reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'reveal': {
          '0%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'top' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
      },
      boxShadow: {
        'premium': '0 30px 60px -12px rgba(10, 29, 22, 0.15)',
        'card': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
