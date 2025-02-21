// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://andy-beaver.github.io/new-onsite-dashboard',
  base: '/',
  integrations: [tailwind(), react()],
  output: 'static'
});