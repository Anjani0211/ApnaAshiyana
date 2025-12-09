/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adivasi/Tribal Color Palette
        primary: {
          50: '#fef5e7',
          100: '#fde8c8',
          200: '#fbd5a5',
          300: '#f9c27d',
          400: '#f7b55c',
          500: '#d97706', // Terracotta/Clay
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        terracotta: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#c2410c', // Deep Terracotta
          600: '#9a3412',
          700: '#7c2d12',
          800: '#5c1d09',
          900: '#3f1506',
        },
        earth: {
          50: '#faf5f0',
          100: '#f5ebe0',
          200: '#ead5c1',
          300: '#d4a574',
          400: '#b8864a', // Earth Brown
          500: '#8b4513', // Saddle Brown
          600: '#6b3410',
          700: '#4a240b',
          800: '#2d1507',
          900: '#1a0c04',
        },
        forest: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#b8e5c7',
          300: '#8fd8a8',
          400: '#5fbf85',
          500: '#2d5016', // Forest Green
          600: '#234012',
          700: '#1a300d',
          800: '#122009',
          900: '#0a1005',
        },
        ochre: {
          50: '#fffbf0',
          100: '#fff6e0',
          200: '#ffedc1',
          300: '#ffe4a2',
          400: '#ffdb83',
          500: '#d4a017', // Golden Ochre
          600: '#a67d12',
          700: '#785a0d',
          800: '#4a3708',
          900: '#1c1403',
        },
        clay: {
          50: '#fef7ed',
          100: '#fdeee0',
          200: '#fbdcc1',
          300: '#f9caa2',
          400: '#f7b883',
          500: '#a16207', // Clay Red
          600: '#814e06',
          700: '#613a04',
          800: '#402603',
          900: '#201301',
        },
        saffron: {
          50: '#fffbf0',
          100: '#fff6e0',
          200: '#ffedc1',
          300: '#ffe4a2',
          400: '#ffdb83',
          500: '#d4a017', // Using ochre as saffron
          600: '#a67d12',
          700: '#785a0d',
          800: '#4a3708',
          900: '#1c1403',
        },
        green: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#b8e5c7',
          300: '#8fd8a8',
          400: '#5fbf85',
          500: '#2d5016', // Forest Green
          600: '#234012',
          700: '#1a300d',
          800: '#122009',
          900: '#0a1005',
        },
        secondary: {
          50: '#faf8f3',
          100: '#f5f0e7',
          200: '#ebe1cf',
          300: '#d4c39e',
          400: '#b8a57a',
          500: '#8b7355', // Natural Beige
          600: '#6b5a43',
          700: '#4a3f2f',
          800: '#2d251c',
          900: '#1a150e',
        },
        accent: {
          50: '#fef5e7',
          100: '#fde8c8',
          200: '#fbd5a5',
          300: '#f9c27d',
          400: '#f7b55c',
          500: '#d97706', // Terracotta
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        tribal: ['Poppins', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'tribal-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        'earth-texture': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a16207' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}
