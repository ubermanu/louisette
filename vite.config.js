import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { version } from './package.json'

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  define: {
    LOUISETTE_VERSION: JSON.stringify(version),
  },
  optimizeDeps: {
    entries: ['highlight.js', '@floating-ui/dom', 'canvas-confetti'],
  },
})
