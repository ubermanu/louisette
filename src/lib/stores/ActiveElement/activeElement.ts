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

  document.addEventListener('focus', setActiveElement, {
    capture: true,
    passive: true,
  })

  document.addEventListener('blur', setActiveElement, {
    capture: true,
    passive: true,
  })

  return () => {
    document.removeEventListener('focus', setActiveElement)
    document.removeEventListener('blur', setActiveElement)
  }
})
