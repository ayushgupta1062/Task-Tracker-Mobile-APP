/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0084FF',
        primaryLight: 'rgba(0,132,255,0.15)',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#0A0A0A',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#FF801E',
      },
    },
  },
  plugins: [],
};
