// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        primary: {
          // Your primary color scale
          500: '#0ea5e9',
          600: '#0284c7',
          // Add other shades as needed
        },
      },
    },
  },
  plugins: [],
};