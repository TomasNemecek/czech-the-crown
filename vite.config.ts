import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['**/*.{test,spec}.ts?(x)'],
    exclude: ['node_modules', 'dist']
  }
})