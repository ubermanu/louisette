import { derived, readonly, writable } from 'svelte/store'
import type { PressEvent } from '../../interactions/Press/press.js'
import { createButton, type ButtonConfig } from '../Button/button.js'

export type ToggleButtonConfig = ButtonConfig & {
  checked?: boolean
}

export const createToggleButton = (config?: ToggleButtonConfig) => {
  const { checked, onPress, ...buttonConfig } = { ...config }

  const checked$ = writable(checked || false)

  const {
    buttonProps: buttonProps$,
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
  const toggleButtonProps = derived(
    [buttonProps$, checked$],
    ([props, checked]) => ({
      ...props,
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
    buttonProps: toggleButtonProps,
    ...rest,
  }
}
