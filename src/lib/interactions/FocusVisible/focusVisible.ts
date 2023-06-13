import { interactionMode } from '$lib/index.js'
import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'
import type { FocusVisible } from './focusVisible.types.js'

export const useFocusVisible = (): FocusVisible => {
  const focused$ = writable(false)

  const onFocusIn = () => {
    focused$.set(true)
  }

  const onFocusOut = () => {
    focused$.set(false)
  }

  const focusVisible: Action = (node) => {
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
    focusVisible,
  }
}
