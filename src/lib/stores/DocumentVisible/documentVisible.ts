import { browser } from '$lib/helpers/environment.js'
import { readable } from 'svelte/store'

/** A store that tracks whether the document is visible */
export const documentVisible = readable(true, (set) => {
  if (!browser) {
    return () => {}
  }

  const setDocumentVisible = () => {
    set(!document.hidden)
  }

  document.addEventListener('visibilitychange', setDocumentVisible)

  return () => {
    document.removeEventListener('visibilitychange', setDocumentVisible)
  }
})
