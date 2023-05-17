import { derived, readonly, writable } from 'svelte/store'
import {
  createButton,
  type ButtonConfig,
  type PressEvent,
} from '../Button/button.js'

export type ToggleButtonConfig = ButtonConfig & {
  checked?: boolean
}

export const createToggleButton = (config: ToggleButtonConfig) => {
  const { checked, onPressEnd } = {
    checked: false,
    ...config,
  }

  const checked$ = writable(checked || false)

  // Toggle the checked state on press end (keyboard + mouse)
  const onToggleButtonPressEnd = (event: PressEvent) => {
    checked$.update((c) => !c)
    onPressEnd?.(event)
  }

  const {
    buttonProps,
    disabled: disabled$,
    ...rest
  } = createButton({
    onPressEnd: onToggleButtonPressEnd,
    ...config,
  })

  const toggleButtonProps = derived(
    [buttonProps, checked$],
    ([props, pressed]) => ({
      ...props,
      'aria-pressed': pressed,
    })
  )

  // TODO: Unsubscribe
  disabled$.subscribe((disabled) => {
    if (disabled) checked$.set(false)
  })

  return {
    checked: readonly(checked$),
    disabled: disabled$,
    buttonProps: toggleButtonProps,
    ...rest,
  }
}
