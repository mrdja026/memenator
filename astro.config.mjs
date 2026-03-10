import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [db()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: true,
  },
  security: {
    checkOrigin: false,
  },
});
