import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types.js'

export const load: PageLoad = async ({ params }) => {
  const docEntries = await import.meta.glob('/src/lib/**/README.md')

  const docs = await Promise.all(
    Object.keys(docEntries).map(async (path) => {
      const md = await import(/* @vite-ignore */ path)
      return {
        component: md.default,
        metadata: md.metadata,
      }
    })
  )

  const entry = docs.find((doc) => doc.metadata?.path === params.path)

  if (!entry) {
    throw error(404)
  }

  return {
    ...entry,
  }
}
