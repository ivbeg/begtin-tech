// @ts-check
import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';

// English lives at the root, Russian under /ru/. Routing is done by the [...lang] pages,
// not by Astro's i18n router: the sitemap still gets hreflang pairs from the config below.
export default defineConfig({
  site: 'https://begtin.tech',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {en: 'en', ru: 'ru'},
      },
    }),
  ],
});
