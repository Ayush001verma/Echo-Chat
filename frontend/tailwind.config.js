import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1d32',
          700: '#162a46',
          600: '#1e3a5f',
          500: '#254a7a',
        },
      },
      animation: {
        'border': 'border 4s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing-dot': 'typing-dot 1.4s infinite ease-in-out both',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'border': {
          to: { '--border-angle': '360deg' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15)' },
        },
        'typing-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.4)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        business: {
          ...require("daisyui/src/theming/themes")["business"],
          "primary": "#06b6d4",
          "secondary": "#8b5cf6",
          "accent": "#10b981",
          "neutral": "#1e3a5f",
          "base-100": "#0a1628",
          "base-200": "#0f1d32",
          "base-300": "#162a46",
          "base-content": "#e2e8f0",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}