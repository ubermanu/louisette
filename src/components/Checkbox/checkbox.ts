import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

// TODO: Add support for indeterminate state
export type CheckboxConfig = {
  checked?: boolean
  disabled?: boolean
}

export const createCheckbox = (config?: CheckboxConfig) => {
  const { checked, disabled } = { ...config }

  const checked$ = writable(checked || false)
  const disabled$ = writable(disabled || false)

  const checkboxProps = derived(
    [checked$, disabled$],
    ([checked, disabled]) => ({
      role: 'checkbox',
      'aria-checked': checked,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    })
  )

  const check = () => {
    checked$.set(true)
  }

  const uncheck = () => {
    checked$.set(false)
  }

  const toggle = () => {
    checked$.update((c) => !c)
  }

  const onCheckboxClick = (event: MouseEvent) => {
    event.preventDefault()
    if (get(disabled$)) return
    toggle()
  }

  const onCheckboxKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      if (get(disabled$)) return
      toggle()
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      if (get(disabled$)) return
      uncheck()
    }
  }

  const useCheckbox: Action = (node) => {
    node.addEventListener('click', onCheckboxClick)
    node.addEventListener('keydown', onCheckboxKeyDown)

    return {
      destroy() {
        node.removeEventListener('click', onCheckboxClick)
        node.removeEventListener('keydown', onCheckboxKeyDown)
      },
    }
  }

  return {
    checked: readonly(checked$),
    disabled: disabled$,
    checkboxProps,
    useCheckbox,
    check,
    uncheck,
    toggle,
  }
}
