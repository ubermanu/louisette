import { browser } from '$lib/helpers/environment.js'
import { get, readable } from 'svelte/store'

export const activeElement = readable<HTMLElement | null>(null, (set) => {
  if (!browser) {
    return () => {}
  }

  const setActiveElement = () => {
    if (
      document.activeElement instanceof HTMLElement &&
      get(activeElement) !== document.activeElement
    ) {
      set(document.activeElement)
    }
  }

  setActiveElement()

  document.addEventListener('focusin', setActiveElement)

  return () => {
    document.removeEventListener('focusin', setActiveElement)
  }
})
