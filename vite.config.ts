import { fileURLToPath, URL } from 'node:url'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './docs',
    emptyOutDir: true,
  },
  // publicDir: 'voyage-demo',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    sentryVitePlugin({
      org: 'purista',
      project: 'voyage',

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and need `project:releases` and `org:read` scopes
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
