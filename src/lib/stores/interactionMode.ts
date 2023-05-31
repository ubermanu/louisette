import { readable } from 'svelte/store'

const browser = typeof window !== 'undefined'

/** A store that tracks the current interaction mode. (keyboard or pointer) */
export const interactionMode = readable<string | null>(null, (set) => {
  if (!browser) {
    return () => {}
  }

  const setInteractionMode = (event: PointerEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      set('keyboard')
    } else {
      set('pointer')
    }
  }

  document.addEventListener('keydown', setInteractionMode, true)
  document.addEventListener('pointerdown', setInteractionMode, true)

  return () => {
    document.removeEventListener('keydown', setInteractionMode)
    document.removeEventListener('pointerdown', setInteractionMode)
  }
})
