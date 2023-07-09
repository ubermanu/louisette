import { tabbable } from '$lib/helpers/tabbable.js'
import type { Action } from 'svelte/action'

export const focusTrap: Action = (node: HTMLElement) => {
  const onKeyDown = (event: KeyboardEvent) => {
    const focusableElements = tabbable(node)

    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          event.preventDefault()
          lastFocusableElement.focus()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          event.preventDefault()
          firstFocusableElement.focus()
        }
      }
    }
  }

  node.addEventListener('keydown', onKeyDown, true)

  return {
    destroy() {
      node.removeEventListener('keydown', onKeyDown, true)
    },
  }
}
