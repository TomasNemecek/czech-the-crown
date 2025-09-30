import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.ts?(x)'],
    exclude: ['node_modules', 'dist'],
    globals: true
  },
  server: {
    //DEV proxy settings to avoid CORS issues when fetching from CNB on localhost
    proxy: {
      '/cnb': {
        target: 'https://www.cnb.cz',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/cnb/, ''),
      },
    },
  },
})