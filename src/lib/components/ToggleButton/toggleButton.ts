import {
  createButton,
  type ButtonConfig,
} from '$lib/components/Button/button.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type ToggleButtonConfig = ButtonConfig & {
  checked?: boolean
}

export type ToggleButton = ReturnType<typeof createToggleButton>

export const createToggleButton = (config?: ToggleButtonConfig) => {
  const { checked, ...buttonConfig } = { ...config }

  const checked$ = writable(checked || false)

  const { buttonAttrs: buttonAttrs$, disabled: disabled$ } = createButton({
    ...buttonConfig,
  })

  // Update the aria-pressed attribute based on the checked state
  const toggleButtonAttrs = derived(
    [buttonAttrs$, checked$],
    ([buttonAttrs, checked]) => ({
      ...buttonAttrs,
      'aria-pressed': checked,
    })
  )

  const check = () => {
    if (get(disabled$)) {
      return
    }
    checked$.set(true)
  }

  const uncheck = () => {
    if (get(disabled$)) {
      return
    }
    checked$.set(false)
  }

  const toggle = () => {
    if (get(disabled$)) {
      return
    }
    checked$.update((checked) => !checked)
  }

  const onToggleButtonClick = (event: MouseEvent) => {
    toggle()
  }

  const onToggleButtonKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      toggle()
    }
  }

  const useToggleButton: Action = (node) => {
    node.addEventListener('click', onToggleButtonClick)
    node.addEventListener('keydown', onToggleButtonKeyDown)

    const unsubscribe = disabled$.subscribe((disabled) => {
      if (disabled) {
        checked$.set(false)
      }
    })

    return {
      destroy() {
        node.removeEventListener('click', onToggleButtonClick)
        node.removeEventListener('keydown', onToggleButtonKeyDown)
        unsubscribe()
      },
    }
  }

  return {
    checked: readonly(checked$),
    disabled: disabled$,
    toggleButtonAttrs,
    toggleButton: useToggleButton,
    check,
    uncheck,
    toggle,
  }
}
