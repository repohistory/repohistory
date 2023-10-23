import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
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
export default config;
