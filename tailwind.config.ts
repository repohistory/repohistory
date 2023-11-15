const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('../../public/background.jpg')",
      },
    },
  },
  darkMode: 'class',
  plugins: [
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
