import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types.js'

export const load: PageLoad = async ({ params }) => {
  const docs = import.meta.glob('/src/docs/**/*.md')
  const examples = import.meta.glob('/src/examples/**/*/*.svelte')

  let component, metadata
  let sources = []
  let example

  for (const path in docs) {
    if (path.includes(params.path as string)) {
      const md = await import(/* @vite-ignore */ path)
      component = md.default
      metadata = md.metadata
      break
    }
  }

  for (const path in examples) {
    if (path.includes(params.path as string)) {
      const svelte = await import(/* @vite-ignore */ `${path}?raw&inline`)
      sources.push({
        filename: basename(path),
        code: svelte.default,
      })

      if (path.endsWith('/+page.svelte')) {
        const page = await import(/* @vite-ignore */ path)
        example = page.default
      }
    }
  }

  if (!component) {
    throw error(404, 'Not found')
  }

  return {
    component,
    metadata,
    example,
    sources,
  }
}

const basename = (path: string) => path.split('/').pop() || ''
