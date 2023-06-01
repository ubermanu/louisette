import { activeElement } from '$lib/stores/activeElement.js'
import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'

export type FocusWithinConfig = {
  onFocusWithin?: () => void
  onBlurWithin?: () => void
}

/** Fires a callback when the element or any of its children receive/loose focus. */
export const useFocusWithin = (config?: FocusWithinConfig) => {
  const { onFocusWithin, onBlurWithin } = { ...config }

  const focused$ = writable(false)

  const focusWithin: Action = (node) => {
    const unsubscribe = activeElement.subscribe((element) => {
      if (element !== null && node.contains(element)) {
        if (!get(focused$)) {
          onFocusWithin?.()
        }
        focused$.set(true)
      } else {
        if (get(focused$)) {
          onBlurWithin?.()
        }
        focused$.set(false)
      }
    })

    return {
      destroy() {
        unsubscribe()
      },
    }
  }

  return {
    focused: readonly(focused$),
    focusWithin,
  }
}
