/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A6A6',
          dark: '#008989',
          light: '#33BFBF',
        },
        secondary: {
          DEFAULT: '#1E293B',
          light: '#334155',
          lighter: '#475569',
        },
        accent: {
          DEFAULT: '#F8FAFC',
          dark: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        devconnect: {
          "primary": "#00A6A6",
          "secondary": "#1E293B",
          "accent": "#F8FAFC",
          "neutral": "#334155",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#F1F5F9",
        },
      },
    ],
  },
}

