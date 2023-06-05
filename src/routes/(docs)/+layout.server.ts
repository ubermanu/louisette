import { base } from '$app/paths'
import Case from 'case'
import path from 'node:path'
import type { SidebarItem } from '../../app.js'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = async ({ locals }) => {
  const docEntries = await import.meta.glob('/src/lib/**/README.md')

  const docs = await Promise.all(
    Object.keys(docEntries).map(async (path) => {
      const md = await import(/* @vite-ignore */ path)

      if (!md.metadata.path) {
        console.warn(`No path found for ${path}`)
      }

      return {
        title: md.metadata.title || '',
        href: `${base}/${md.metadata.path}`,
        depth: md.metadata.path?.split('/').length || 0,
      }
    })
  )

  let sidebar: SidebarItem[] = []

  for (const i of docs) {
    // If the slug has no depth, push it
    if (i.depth === 1) {
      sidebar.push(i)
    } else {
      const parentPath = path.dirname(i.href)
      const parent = sidebar.find((item) => item.href === parentPath)

      if (parent) {
        parent.children?.push(i)
      } else {
        sidebar.push({
          title: Case.capital(parentPath.split('/').pop() || ''),
          href: parentPath,
          children: [i],
        })
      }
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
