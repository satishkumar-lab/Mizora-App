/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mizora: {
          bg: '#fafafa',
          card: '#ffffff',
          primary: '#34c759',
          accent: '#ddfb43',
          'accent-bright': '#c8f526',
          'accent-soft': '#f5ffbb',
          limeText: '#1e2c00',
          secondary: '#626b5e',
          shell: '#edeef0',
          track: '#e5ece2',
          'track-bar': '#e5e5ea',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi-Regular'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-bold': ['Satoshi-Bold'],
      },
      borderRadius: {
        card: 15,
        'card-lg': 20,
        'card-xl': 24,
        pill: 100,
      },
      boxShadow: {
        card: '0px 4px 6px rgba(0, 0, 0, 0.02)',
        nav: '0px 0px 10px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
