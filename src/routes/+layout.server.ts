import fs from 'node:fs/promises'
import path from 'node:path'
import type { LayoutServerLoad } from './$types.js'

export const load: LayoutServerLoad = async () => {
  const __dirname = path.dirname(import.meta.url.replace('file://', ''))

  // Get the list of components in the component folder
  const folders = await fs.readdir(path.join(__dirname, './component'))

  const components = folders.map((folder) => {
    return {
      name: folder.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      }),
      url: `/component/${folder}`,
    }
  })

  return {
    components,
  }
}

export const prerender = true
