import { error } from '@sveltejs/kit'
import type { SvelteComponent } from 'svelte/internal'
import type { MdsvexResolver } from '../../../mdsvex.js'
import type { PageLoad } from './$types.js'

type DocEntry = {
  path: string
  component: SvelteComponent
  metadata: Record<string, string>
  example?: SvelteComponent
  sources?: { path: string; filename: string; code: string }[]
}

export const load: PageLoad = async ({ params }) => {
  const docEntries = await import.meta.glob('/src/lib/**/README.md')

  const docs: DocEntry[] = await Promise.all(
    Object.entries(docEntries).map(async ([path, resolver]) => {
      const md = await (resolver as MdsvexResolver)?.()
      return {
        path: path.replace(/^\/src\/lib\/(.*)\/README.md$/, '$1'),
        component: md.default,
        metadata: md.metadata,
      }
    })
  )

  const entry = docs.find((doc) => doc.metadata?.path === params.path)

  if (!entry) {
    throw error(404)
  }

  const exampleEntries = await import.meta.glob(
    '/src/lib/**/example/+page.svelte'
  )

  const examples = await Promise.all(
    Object.entries(exampleEntries).map(async ([path, resolver]) => {
      const md = await (resolver as MdsvexResolver)?.()
      return {
        path: path.replace(/^\/src\/lib\/(.*)\/example\/\+page.svelte$/, '$1'),
        component: md.default,
      }
    })
  )

  const example = examples.find((example) => example.path === entry.path)
  if (example) {
    entry.example = example.component
  }

  const sourceEntries = await import.meta.glob('/src/lib/**/example/*.svelte', {
    as: 'raw',
  })
  const sourceFiles = await Promise.all(
    Object.entries(sourceEntries).map(async ([path, resolver]) => {
      const file = await resolver?.()
      return {
        path: path.replace(/^\/src\/lib\/(.*)\/example\/(.*)$/, '$1'),
        filename: path.replace(/^\/src\/lib\/(.*)\/example\/(.*)$/, '$2'),
        code: file,
      }
    })
  )

  const sources = sourceFiles.filter((source) => source.path === entry.path)
  if (sources.length) {
    entry.sources = sources
  }

  return {
    ...entry,
  }
}
