import { base } from '$app/paths'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = async () => {
  return {
    sidebar: [
      await getSidebarSection('Components', 'component'),
      await getSidebarSection('Interactions', 'interaction'),
    ],
  }
}

const getSidebarSection = async (title: string, sub: string) => {
  const __dirname = path.dirname(import.meta.url.replace('file://', ''))
  const folders = await fs.readdir(path.join(__dirname, './' + sub))

  const entries = folders.map((folder) => {
    return {
      name: folder.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      }),
      url: `${base}/${sub}/${folder}`,
    }
  })

  return {
    title,
    entries,
  }
}
