import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const docEntries = await import.meta.glob('/src/lib/**/*/README.md')

  event.locals.docs = await Promise.all(
    Object.keys(docEntries).map(async (path) => {
      const md = await import(/* @vite-ignore */ path)
      return {
        component: md.default,
        metadata: md.metadata,
      }
    })
  )

  return resolve(event)
}
