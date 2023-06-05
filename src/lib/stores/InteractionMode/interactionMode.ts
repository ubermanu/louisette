import { browser } from '$lib/helpers/environment.js'
import { readable } from 'svelte/store'

type InteractionMode = 'keyboard' | 'pointer' | 'virtual'

/** A store that tracks the current interaction mode. (keyboard or pointer) */
export const interactionMode = readable<InteractionMode | null>(null, (set) => {
  if (!browser) {
    return () => {}
  }

  const setInteractionMode = (event: PointerEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      // If the user is typing text, don't update the interaction mode
      if (isTypingText(event)) {
        return
      }
      set('keyboard')
    } else if (event instanceof PointerEvent) {
      set(isVirtualPointerEvent(event) ? 'virtual' : 'pointer')
    } else {
      set(null)
    }
  }

  document.addEventListener('keydown', setInteractionMode, {
    capture: true,
    passive: true,
  })

  document.addEventListener('pointerdown', setInteractionMode, {
    capture: true,
    passive: true,
  })

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

const isTypingText = (event: KeyboardEvent) => {
  const isTextInput =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement

  const isTypingEvent = typingKeys.includes(event.key) || event.key.length === 1

  return isTextInput && isTypingEvent
}

const typingKeys = [
  'Backspace',
  'Tab',
  'Enter',
  'Escape',
  'Space',
  'Delete',
  'CapsLock',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Insert',
  'Clear',
  'Copy',
  'Cut',
  'Paste',
  'SelectAll',
  'Undo',
  'Redo',
]
