/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#004727',
          'green-dark': '#00351d',
          'green-light': '#0a5c34',
        },
        dark: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
        },
        muted: {
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5',
          400: '#a3a3a3',
          500: '#737373',
          600: '#404040',
        }
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
