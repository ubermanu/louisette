import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({ strict: false }),

    // Set the base url using environment variables.
    paths: {
      base: process.env.SVELTEKIT_BASE_URL || '',
    },

    alias: {
      $images: './src/images',
    },
  },

  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
}

export default config
