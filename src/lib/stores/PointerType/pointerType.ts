import { browser } from '$lib/helpers/environment.js'
import { readable } from 'svelte/store'

type PointerType = 'touch' | 'mouse' | 'pen' | 'game'

/** A store that tracks the user's device pointer type */
export const pointerType = readable<PointerType | null>(null, (set) => {
  if (!browser) {
    return () => {}
  }

  // Targets mobile devices like smartphones and tablets
  const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)')

  // Targets desktop devices with a mouse or touchpad
  const mouseQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

  // Targets devices that use a pen or stylus
  const penQuery = window.matchMedia('(hover: none) and (pointer: fine)')

  // Targets game with pointer devices
  // eg: Nintendo Wii, Microsoft Kinect, PlayStation Move
  const gameQuery = window.matchMedia('(hover: hover) and (pointer: coarse)')

  const setPointerType = () => {
    if (touchQuery.matches) {
      set('touch')
    } else if (mouseQuery.matches) {
      set('mouse')
    } else if (penQuery.matches) {
      set('pen')
    } else if (gameQuery.matches) {
      set('game')
    } else {
      set(null)
    }
  }

  setPointerType()

  // Only listen for changes to the touch query (the others are static)
  touchQuery.addEventListener('change', setPointerType, true)

  return () => {
    touchQuery.removeEventListener('change', setPointerType, true)
  }
})
