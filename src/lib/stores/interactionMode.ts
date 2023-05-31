import { readable } from 'svelte/store'

const browser = typeof window !== 'undefined'

type InteractionMode = 'keyboard' | 'pointer' | 'virtual'

/** A store that tracks the current interaction mode. (keyboard or pointer) */
export const interactionMode = readable<InteractionMode | null>(null, (set) => {
  if (!browser) {
    return () => {}
  }

  const setInteractionMode = (event: PointerEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      set('keyboard')
    } else if (event instanceof PointerEvent) {
      set(isVirtualPointerEvent(event) ? 'virtual' : 'pointer')
    } else {
      set(null)
    }
  }

  document.addEventListener('keydown', setInteractionMode, true)
  document.addEventListener('pointerdown', setInteractionMode, true)

  return () => {
    document.removeEventListener('keydown', setInteractionMode)
    document.removeEventListener('pointerdown', setInteractionMode)
  }
})

const isVirtualPointerEvent = (event: PointerEvent) => {
  return (
    (event.width === 0 && event.height === 0) ||
    (event.width === 1 &&
      event.height === 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType === 'mouse')
  )
}
