// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Public address; used for canonical URLs, social previews and the sitemap.
  site: 'https://franciscopinho.vercel.app',
  integrations: [vue(), sitemap()],
});
