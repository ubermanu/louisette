import { activeElement } from '$lib/index.js'
import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'
import type { FocusWithin, FocusWithinConfig } from './focusWithin.types.js'

export const useFocusWithin = (config?: FocusWithinConfig): FocusWithin => {
  const { onFocusWithin, onBlurWithin } = { ...config }

  const focused$ = writable(false)

  const focusWithin: Action = (node) => {
    const unsubscribe = activeElement.subscribe((element) => {
      // Skip if the element is NULL or the body.
      // Happens when the focus is changed to another element (see activeElement.ts).
      if (element === document.body || element === null) {
        return
      }

      if (node.contains(element)) {
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
