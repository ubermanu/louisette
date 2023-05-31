import { interactionMode } from '$lib/stores/interactionMode.js'
import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'

export const useFocusVisible = () => {
  const focused$ = writable(false)

  const onFocusIn = () => {
    focused$.set(true)
  }

  const onFocusOut = () => {
    focused$.set(false)
  }

  const focusEvents: Action = (node) => {
    const unsubscribe = interactionMode.subscribe((mode) => {
      if (mode !== 'pointer') {
        node.addEventListener('focusin', onFocusIn)
        node.addEventListener('focusout', onFocusOut)
      } else {
        focused$.set(false)
        node.removeEventListener('focusin', onFocusIn)
        node.removeEventListener('focusout', onFocusOut)
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
    focusEvents,
  }
}
