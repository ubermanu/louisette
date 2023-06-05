import { base } from '$app/paths'
import Case from 'case'
import path from 'node:path'
import type { SidebarItem } from '../../app.js'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = async () => {
  const docs = await import.meta.glob('/src/docs/**/*.md')

  // TODO: Get titles from metadata
  const slugs = Array.from(Object.entries(docs))
    .map(([p]) => p.replace(/^\/src\/docs\//, '').replace(/\.md$/, ''))
    .sort((a, b) => depthCompare(a, b) || a.localeCompare(b))

  let sidebar: SidebarItem[] = []

  for (const slug of slugs) {
    // If the slug has no depth, push it
    if (!slug.includes('/')) {
      sidebar.push({
        title: Case.capital(path.basename(slug)),
        href: `${base}/${slug}`,
      })
      continue
    }

    // If the slug has a path, push it to the correct parent
    if (slug.includes('/')) {
      const parent = path.dirname(slug)
      const child = path.basename(slug)

      // If the parent doesn't exist, create it
      if (!sidebar.find((item) => item.title === parent)) {
        sidebar.push({
          title: parent,
          href: '',
          children: [],
        })
      }

      // Push the child to the parent
      sidebar
        .find((item) => item.title === parent)
        ?.children?.push({
          title: Case.capital(child),
          href: `${base}/${slug}`,
        })
    }
  }

  return {
    sidebar,
  }
}

/**
 * Sort paths by their depth
 *
 * @param a
 * @param b
 */
const depthCompare = (a: string, b: string) => {
  const aDepth = a.split('/').length
  const bDepth = b.split('/').length
  if (aDepth < bDepth) return -1
  if (aDepth > bDepth) return 1
  return 0
}
