const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-[#62C3F8]',
    'bg-[#4F9BC4]',
    'bg-[#3A7391]',
    'bg-[#264B5E]',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('../../public/images/bg2.png')",
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwind-scrollbar-hide'),
    nextui({
      themes: {
        dark: {
          colors: {
            default: {
              foreground: '#000000',
              DEFAULT: '#ffffff',
            },
            primary: {
              foreground: '#000000',
              DEFAULT: '#62C3F8',
            },
            secondary: {
              foreground: '#000000',
              DEFAULT: '#315c72',
            },
          },
        },
      },
    }),
  ],
};
