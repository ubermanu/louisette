import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readonly, writable } from 'svelte/store'
import type { ToggleButton, ToggleButtonConfig } from './toggleButton.types.js'

export const createToggleButton = (
  config?: ToggleButtonConfig
): ToggleButton => {
  const { checked, disabled } = { ...config }

  const checked$ = writable(checked || false)
  const disabled$ = writable(disabled || false)

  const baseId = generateId()

  // Update the aria-pressed attribute based on the checked state
  const toggleButtonAttrs = derived(
    [disabled$, checked$],
    ([disabled, checked]) => ({
      role: 'button',
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
      'aria-pressed': checked,
      'data-togglebutton': baseId,
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

  const onToggleButtonClick = () => {
    toggle()
  }

  const onToggleButtonKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      toggle()
    }
  }

  onBrowserMount(() => {
    const node = document.querySelector<HTMLElement>(
      `[data-togglebutton="${baseId}"]`
    )

    if (!node) {
      throw new Error('Could not find the toggle button')
    }

    node.addEventListener('click', onToggleButtonClick)
    node.addEventListener('keydown', onToggleButtonKeyDown)

    const unsubscribe = disabled$.subscribe((disabled) => {
      if (disabled) {
        checked$.set(false)
      }
    })

    return () => {
      node.removeEventListener('click', onToggleButtonClick)
      node.removeEventListener('keydown', onToggleButtonKeyDown)
      unsubscribe()
    }
  })

  return {
    checked: readonly(checked$),
    disabled: disabled$,
    toggleButtonAttrs,
    check,
    uncheck,
    toggle,
  }
}
