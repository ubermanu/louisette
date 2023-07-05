import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Checkbox, CheckboxConfig } from './checkbox.types.js'

export const createCheckbox = (config?: CheckboxConfig): Checkbox => {
  const { checked, disabled, indeterminate } = { ...config }

  const checked$ = writable(indeterminate ? false : checked || false)
  const disabled$ = writable(disabled || false)
  const indeterminate$ = writable(indeterminate || false)

  const baseId = generateId()

  const checkboxAttrs = derived(
    [checked$, disabled$, indeterminate$],
    ([checked, disabled, indeterminate]) => ({
      role: 'checkbox',
      'aria-checked': indeterminate ? 'mixed' : checked,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
      'data-checkbox': baseId,
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

  onBrowserMount(() => {
    const node = document.querySelector<HTMLElement>(
      `[data-checkbox="${baseId}"]`
    )

    if (!node) {
      throw new Error('Could not find the checkbox node')
    }

    node.addEventListener('click', onCheckboxClick)
    node.addEventListener('keydown', onCheckboxKeyDown)

    return () => {
      node.removeEventListener('click', onCheckboxClick)
      node.removeEventListener('keydown', onCheckboxKeyDown)
    }
  })

  return {
    checked: readonly(checked$),
    indeterminate: readonly(indeterminate$),
    disabled: disabled$,
    checkboxAttrs,
    check,
    partiallyCheck,
    uncheck,
    toggle,
  }
}
