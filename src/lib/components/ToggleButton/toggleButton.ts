import {
  createButton,
  type ButtonConfig,
} from '$lib/components/Button/button.js'
import type { PressEvent } from '$lib/interactions/Press/press.js'
import { derived, readonly, writable } from 'svelte/store'

export type ToggleButtonConfig = ButtonConfig & {
  checked?: boolean
}

export type ToggleButton = ReturnType<typeof createToggleButton>

export const createToggleButton = (config?: ToggleButtonConfig) => {
  const { checked, onPress, ...buttonConfig } = { ...config }

  const checked$ = writable(checked || false)

  const {
    buttonAttrs: buttonAttrs$,
    disabled: disabled$,
    ...rest
  } = createButton({
    ...buttonConfig,
    onPress: (event?: PressEvent) => {
      checked$.update((c) => !c)
      onPress?.(event)
    },
  })

  // Update the aria-pressed attribute based on the checked state
  const toggleButtonAttrs = derived(
    [buttonAttrs$, checked$],
    ([Attrs, checked]) => ({
      ...Attrs,
      'aria-pressed': checked,
    })
  )

  // Uncheck the button when disabled
  disabled$.subscribe((disabled) => {
    if (disabled) {
      checked$.set(false)
    }
  })

  return {
    checked: readonly(checked$),
    disabled: disabled$,
    buttonAttrs: toggleButtonAttrs,
    ...rest,
  }
}
