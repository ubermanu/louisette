import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type CheckboxConfig = {
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
}

export const createCheckbox = (config?: CheckboxConfig) => {
  const { checked, disabled, indeterminate } = { ...config }

  const checked$ = writable(indeterminate ? false : checked || false)
  const disabled$ = writable(disabled || false)
  const indeterminate$ = writable(indeterminate || false)

  const checkboxAttrs = derived(
    [checked$, disabled$, indeterminate$],
    ([checked, disabled, indeterminate]) => ({
      role: 'checkbox',
      'aria-checked': indeterminate ? 'mixed' : checked,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    })
  )

  const check = () => {
    checked$.set(true)
    indeterminate$.set(false)
  }

  const partiallyCheck = () => {
    indeterminate$.set(true)
    checked$.set(false)
  }

  const uncheck = () => {
    checked$.set(false)
    indeterminate$.set(false)
  }

  const toggle = () => {
    const checked = get(checked$)
    const indeterminate = get(indeterminate$)

    if (checked) {
      uncheck()
    } else if (indeterminate) {
      check()
    } else {
      check()
    }
  }

  const onCheckboxClick = (event: MouseEvent) => {
    event.preventDefault()
    if (get(disabled$)) return
    toggle()
  }

  const onCheckboxKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault()
      if (get(disabled$)) return
      toggle()
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
    indeterminate: readonly(indeterminate$),
    disabled: disabled$,
    checkboxAttrs,
    checkbox: useCheckbox,
    check,
    partiallyCheck,
    uncheck,
    toggle,
  }
}
