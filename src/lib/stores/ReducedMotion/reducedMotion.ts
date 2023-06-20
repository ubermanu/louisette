import { browser } from '$lib/helpers/environment.js'
import { readable } from 'svelte/store'

/** A store that tracks whether the user has requested reduced motion */
export const reducedMotion = readable(false, (set) => {
  if (!browser) {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const setReducedMotion = () => {
    set(mediaQuery.matches)
  }

  setReducedMotion()

  mediaQuery.addEventListener('change', setReducedMotion, true)

  return () => {
    mediaQuery.removeEventListener('change', setReducedMotion, true)
  }
})
